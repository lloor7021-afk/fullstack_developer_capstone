"""Course, lesson and assessment models based on the IBM starter application's schema."""
from django.conf import settings
from django.db import models
from django.utils import timezone


class Instructor(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    full_time = models.BooleanField(default=True)
    total_learners = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.user.username


class Learner(models.Model):
    STUDENT, DEVELOPER, DATA_SCIENTIST, DATABASE_ADMIN = 'student', 'developer', 'data_scientist', 'dba'
    OCCUPATION_CHOICES = [
        (STUDENT, 'Student'), (DEVELOPER, 'Developer'),
        (DATA_SCIENTIST, 'Data Scientist'), (DATABASE_ADMIN, 'Database Admin'),
    ]
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    occupation = models.CharField(max_length=20, choices=OCCUPATION_CHOICES, default=STUDENT)
    social_link = models.URLField(blank=True)

    def __str__(self):
        return self.user.username


class Course(models.Model):
    name = models.CharField(max_length=100)
    image = models.ImageField(upload_to='course_images/', blank=True)
    description = models.TextField()
    pub_date = models.DateField(default=timezone.localdate)
    instructors = models.ManyToManyField(Instructor, blank=True)
    users = models.ManyToManyField(settings.AUTH_USER_MODEL, through='Enrollment')
    total_enrollment = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.name


class Lesson(models.Model):
    title = models.CharField(max_length=200)
    order = models.PositiveIntegerField(default=0)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    content = models.TextField()

    class Meta:
        ordering = ['order', 'id']

    def __str__(self):
        return f'{self.course.name}: {self.title}'


class Enrollment(models.Model):
    AUDIT, HONOR = 'audit', 'honor'
    COURSE_MODES = [(AUDIT, 'Audit'), (HONOR, 'Honor')]
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    date_enrolled = models.DateField(default=timezone.localdate)
    mode = models.CharField(max_length=5, choices=COURSE_MODES, default=HONOR)
    rating = models.FloatField(default=5)

    class Meta:
        constraints = [models.UniqueConstraint(fields=['user', 'course'], name='unique_course_enrollment')]

    def __str__(self):
        return f'{self.user.username} enrolled in {self.course.name}'


class Question(models.Model):
    lesson = models.ForeignKey(Lesson, related_name='questions', on_delete=models.CASCADE)
    content = models.TextField(help_text='Enter the exam question.')
    grade = models.PositiveIntegerField(default=10)

    def is_get_score(self, selected_choice_ids):
        """A question is correct only if all and only its correct choices were selected."""
        correct_ids = set(self.choices.filter(is_correct=True).values_list('id', flat=True))
        selected = set(selected_choice_ids)
        return bool(correct_ids) and selected == correct_ids

    def __str__(self):
        return self.content[:90]


class Choice(models.Model):
    question = models.ForeignKey(Question, related_name='choices', on_delete=models.CASCADE)
    content = models.CharField(max_length=300)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return self.content


class Submission(models.Model):
    enrollment = models.ForeignKey(Enrollment, on_delete=models.CASCADE, related_name='submissions')
    choices = models.ManyToManyField(Choice, blank=True)
    submitted_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f'{self.enrollment.user.username} - submission #{self.pk}'
