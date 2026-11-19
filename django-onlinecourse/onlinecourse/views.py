"""Course listing, enrollment, assessment submission and scoring views."""
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.db import transaction
from django.http import HttpResponseBadRequest
from django.shortcuts import get_object_or_404, redirect, render
from django.urls import reverse
from django.views import generic
from django.views.decorators.http import require_POST

from .models import Choice, Course, Enrollment, Question, Submission


class CourseListView(generic.ListView):
    model = Course
    template_name = 'onlinecourse/course_list_bootstrap.html'
    context_object_name = 'course_list'


class CourseDetailView(generic.DetailView):
    model = Course
    template_name = 'onlinecourse/course_details_bootstrap.html'
    context_object_name = 'course'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['lessons'] = self.object.lesson_set.prefetch_related('questions__choices')
        context['enrolled'] = self.request.user.is_authenticated and Enrollment.objects.filter(
            user=self.request.user, course=self.object).exists()
        return context


def registration_request(request):
    if request.method == 'POST':
        username = request.POST.get('username', '').strip()
        password = request.POST.get('psw', '')
        if len(username) < 3 or len(password) < 8:
            return render(request, 'onlinecourse/user_registration_bootstrap.html',
                          {'message': 'Username must be at least 3 characters and password at least 8.'})
        if User.objects.filter(username=username).exists():
            return render(request, 'onlinecourse/user_registration_bootstrap.html',
                          {'message': 'Username already exists.'})
        user = User.objects.create_user(username=username, password=password,
                                      first_name=request.POST.get('firstname', ''),
                                      last_name=request.POST.get('lastname', ''))
        login(request, user)
        return redirect('onlinecourse:index')
    return render(request, 'onlinecourse/user_registration_bootstrap.html')


def login_request(request):
    if request.method == 'POST':
        user = authenticate(request, username=request.POST.get('username', ''),
                            password=request.POST.get('psw', ''))
        if user is not None:
            login(request, user)
            return redirect('onlinecourse:index')
        return render(request, 'onlinecourse/user_login_bootstrap.html',
                      {'message': 'Invalid username or password.'})
    return render(request, 'onlinecourse/user_login_bootstrap.html')


def logout_request(request):
    logout(request)
    return redirect('onlinecourse:index')


@login_required
@require_POST
def enroll(request, course_id):
    course = get_object_or_404(Course, pk=course_id)
    with transaction.atomic():
        _, created = Enrollment.objects.get_or_create(user=request.user, course=course)
        if created:
            Course.objects.filter(pk=course.pk).update(total_enrollment=course.total_enrollment + 1)
    return redirect('onlinecourse:course_details', pk=course.id)


@login_required
@require_POST
def submit(request, course_id):
    """Store only choices belonging to the user's enrolled course."""
    course = get_object_or_404(Course, pk=course_id)
    enrollment = get_object_or_404(Enrollment, user=request.user, course=course)
    questions = Question.objects.filter(lesson__course=course).distinct()
    if not questions.exists():
        return HttpResponseBadRequest('This course has no assessment questions.')

    selected_ids = []
    for question in questions:
        for raw_id in request.POST.getlist(f'choice_{question.pk}'):
            if not raw_id.isdecimal():
                return HttpResponseBadRequest('Invalid choice identifier.')
            selected_ids.append(int(raw_id))
    valid_choices = list(Choice.objects.filter(question__in=questions, pk__in=selected_ids))
    if len({choice.pk for choice in valid_choices}) != len(set(selected_ids)):
        return HttpResponseBadRequest('One or more answers do not belong to this course.')
    for choice in valid_choices:
        if choice.pk not in set(map(int, request.POST.getlist(f'choice_{choice.question_id}'))):
            return HttpResponseBadRequest('An answer was submitted for the wrong question.')

    with transaction.atomic():
        submission = Submission.objects.create(enrollment=enrollment)
        submission.choices.set(valid_choices)
    return redirect('onlinecourse:show_exam_result', course_id=course.pk, submission_id=submission.pk)


@login_required
def show_exam_result(request, course_id, submission_id):
    """Compute weighted scores from questions, and display exact answers."""
    course = get_object_or_404(Course, pk=course_id)
    submission = get_object_or_404(Submission, pk=submission_id, enrollment__course=course,
                                   enrollment__user=request.user)
    selected_ids = set(submission.choices.values_list('id', flat=True))
    questions = Question.objects.filter(lesson__course=course).prefetch_related('choices')
    result_rows = []
    total_score = 0
    total_grade = 0
    for question in questions:
        choices = list(question.choices.all())
        answers = {choice.pk for choice in choices if choice.pk in selected_ids}
        correct = question.is_get_score(answers)
        total_grade += question.grade
        if correct:
            total_score += question.grade
        result_rows.append({
            'question': question, 'correct': correct,
            'choices': [{'choice': choice, 'selected': choice.pk in answers} for choice in choices],
        })
    grade = round((total_score / total_grade) * 100) if total_grade else 0
    return render(request, 'onlinecourse/exam_result_bootstrap.html', {
        'course': course, 'submission': submission, 'results': result_rows,
        'grade': grade, 'total_score': total_score, 'total_grade': total_grade,
        'passed': grade >= 70,
    })
