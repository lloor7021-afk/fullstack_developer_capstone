from django.contrib.auth.models import User
from django.test import TestCase
from django.urls import reverse
from .models import Choice, Course, Enrollment, Lesson, Question, Submission


class AssessmentTests(TestCase):
    def setUp(self):
        self.student = User.objects.create_user(username='student1', password='studentpass123')
        self.other = User.objects.create_user(username='student2', password='studentpass123')
        self.course = Course.objects.create(name='Django Basics', description='Django overview')
        self.lesson = Lesson.objects.create(course=self.course, title='Introduction', order=0, content='Welcome')
        self.question = Question.objects.create(lesson=self.lesson, content='What is Django?', grade=10)
        self.right = Choice.objects.create(question=self.question, content='A web framework', is_correct=True)
        self.wrong = Choice.objects.create(question=self.question, content='A text editor', is_correct=False)
        self.enrollment = Enrollment.objects.create(user=self.student, course=self.course)

    def test_models_and_admin(self):
        self.assertEqual(self.question.choices.count(), 2)
        self.assertTrue(self.question.is_get_score([self.right.pk]))
        self.assertFalse(self.question.is_get_score([self.wrong.pk]))
        self.assertFalse(self.question.is_get_score([self.right.pk, self.wrong.pk]))

    def test_course_details_shows_bootstrap_exam(self):
        response = self.client.get(reverse('onlinecourse:course_details', args=[self.course.pk]))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Django Basics')
        self.assertContains(response, 'Your lessons')
        self.assertContains(response, 'FINAL ASSESSMENT')

    def test_submit_creates_submission_and_renders_congratulations(self):
        self.client.force_login(self.student)
        response = self.client.post(reverse('onlinecourse:submit', args=[self.course.pk]), {
            f'choice_{self.question.id}': [str(self.right.pk)]
        })
        self.assertEqual(response.status_code, 302)
        self.assertEqual(Submission.objects.count(), 1)
        self.assertTrue(Submission.objects.get().choices.filter(pk=self.right.pk).exists())
        result = self.client.get(response.url)
        self.assertContains(result, 'Congratulations! You passed.')
        self.assertContains(result, '100%')
        self.assertContains(result, 'Exam results')

    def test_incorrect_answer_returns_fail(self):
        self.client.force_login(self.student)
        resp = self.client.post(reverse('onlinecourse:submit', args=[self.course.pk]), {
            f'choice_{self.question.id}': [str(self.wrong.pk)]
        })
        self.assertContains(self.client.get(resp.url), 'Keep practicing!')

    def test_another_users_result_is_private(self):
        self.client.force_login(self.student)
        resp = self.client.post(reverse('onlinecourse:submit', args=[self.course.pk]), {
            f'choice_{self.question.id}': [str(self.right.pk)]
        })
        self.client.force_login(self.other)
        self.assertEqual(self.client.get(resp.url).status_code, 404)

    def test_reject_choice_of_different_course(self):
        other_course = Course.objects.create(name='Different course', description='no')
        other_lesson = Lesson.objects.create(course=other_course, title='else')
        other_question = Question.objects.create(lesson=other_lesson, content='Other question')
        invalid_choice = Choice.objects.create(question=other_question, content='X', is_correct=True)
        self.client.force_login(self.student)
        resp = self.client.post(reverse('onlinecourse:submit', args=[self.course.pk]), {
            f'choice_{self.question.id}': [str(invalid_choice.pk)]
        })
        self.assertEqual(resp.status_code, 400)

    def test_login_required_for_submission(self):
        resp = self.client.post(reverse('onlinecourse:submit', args=[self.course.pk]), {})
        self.assertEqual(resp.status_code, 302)
        self.assertIn('login', resp.url)

    def test_enroll_works(self):
        self.client.force_login(self.other)
        resp = self.client.post(reverse('onlinecourse:enroll', args=[self.course.pk]))
        self.assertEqual(resp.status_code, 302)
        self.assertTrue(Enrollment.objects.filter(course=self.course, user=self.other).exists())
