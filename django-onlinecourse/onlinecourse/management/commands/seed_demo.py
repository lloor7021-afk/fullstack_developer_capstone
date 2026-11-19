"""Create repeatable example lessons and an actual mock exam for screenshots/tests."""
import os
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from onlinecourse.models import Choice, Course, Enrollment, Lesson, Question


class Command(BaseCommand):
    help = 'Seed a sample course, assessment, and local demonstration accounts.'

    def handle(self, *args, **kwargs):
        User = get_user_model()
        admin_name = os.environ.get('DEMO_ADMIN_USERNAME', 'admin')
        admin_password = os.environ.get('DEMO_ADMIN_PASSWORD')
        student_password = os.environ.get('DEMO_STUDENT_PASSWORD')
        if not admin_password or not student_password:
            raise ValueError('Set DEMO_ADMIN_PASSWORD and DEMO_STUDENT_PASSWORD before creating demo users.')
        admin, _ = User.objects.get_or_create(username=admin_name)
        admin.is_staff = True
        admin.is_superuser = True
        admin.set_password(admin_password)
        admin.save()
        student, _ = User.objects.get_or_create(username='student')
        student.set_password(student_password)
        student.save()

        course, _ = Course.objects.get_or_create(name='Django Application Development', defaults={
            'description': 'Learn Django models, admin tools, URL routing and web application assessments.'
        })
        lesson_rows = [
            ('Getting started with Django', 'Create apps, define URL routes, and render views with templates.'),
            ('Models and the database', 'Use Django ORM models and relationships to store structured data.'),
            ('Assessment and deployment', 'Use server-side grading, form validation, and administration tools.'),
        ]
        for i, (title, content) in enumerate(lesson_rows):
            lesson, _ = Lesson.objects.get_or_create(course=course, title=title, defaults={'order': i, 'content': content})
            lesson.order = i
            lesson.content = content
            lesson.save()
        questions = [
            (0, 'What is the purpose of a Django model?', [
                ('To represent and manage database data', True),
                ('To compile a CSS stylesheet', False),
                ('To configure the operating system', False),
            ]),
            (1, 'Which Django feature provides an admin management interface?', [
                ('Django Admin', True),
                ('A static HTML file', False),
                ('An image upload alone', False),
            ]),
            (2, 'What is a Django view responsible for?', [
                ('Receiving requests and returning responses', True),
                ('Only setting the server timezone', False),
                ('Only choosing an icon color', False),
            ]),
        ]
        lessons = list(course.lesson_set.all())
        for idx, prompt, choices in questions:
            q, _ = Question.objects.get_or_create(lesson=lessons[idx], content=prompt, defaults={'grade': 10})
            for text, is_correct in choices:
                Choice.objects.update_or_create(question=q, content=text, defaults={'is_correct': is_correct})
        Enrollment.objects.get_or_create(user=student, course=course)
        Course.objects.filter(pk=course.pk).update(total_enrollment=1)
        self.stdout.write(self.style.SUCCESS(f'Seeded course #{course.pk} with 3 questions and 2 demo users.'))
