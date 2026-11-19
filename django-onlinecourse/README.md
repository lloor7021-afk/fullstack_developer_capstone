# OnlineCourse Academy — Django Assessment

A working extension of the IBM online course assessment lab. It implements Django `Question`, `Choice`, and `Submission` models, admin inlines, a Bootstrap course details page, protected assessment submission, weighted scoring, and results feedback.

## Local setup

```bash
python -m pip install -r requirements.txt
python manage.py makemigrations onlinecourse
python manage.py migrate
DEMO_ADMIN_PASSWORD='choose-a-local-password' DEMO_STUDENT_PASSWORD='choose-another-local-password' python manage.py seed_demo
python manage.py test
python manage.py runserver
```

- Open `http://127.0.0.1:8000/admin/` for the real Django administration interface.
- Open `http://127.0.0.1:8000/onlinecourse/` for the course list.
- Log in as `student` using the password you supplied to `seed_demo` to enroll and take the exam.
- No demonstration passwords are stored in the repository.

## Final assignment links

| Question | Required evidence |
|---|---|
| 1 | `onlinecourse/models.py` — Question, Choice, Submission |
| 2 | `onlinecourse/admin.py` — 7 imported classes and inlines |
| 3 | `03-admin-site.png` — actual Django Admin screenshot |
| 4 | `onlinecourse/templates/onlinecourse/course_details_bootstrap.html` |
| 5 | `onlinecourse/views.py` — `submit` and `show_exam_result` |
| 6 | `onlinecourse/urls.py` — the two new routes |
| 7 | `07-final.png` — actual passing exam result with score |

## Grading and access

The grading routine selects only choices belonging to the course, prevents another learner from opening a different user's submission, and gives full credit for a question only when its selected answers exactly match the correct answer set. Its passing threshold is 70%.

## Verifying screenshots

The GitHub Actions workflow runs tests, starts the real Django application, logs into `/admin/` with a demo account, and submits a sample assessment in Chrome. The two screenshots are produced by the browser against the live app and are published as workflow artifacts, not fabricated images.

## Note

This is a self-contained educational implementation suitable for local use, not production deployment. Before deploying publicly, configure a secret key, allowed hosts, CSRF settings, cookies, and HTTPS appropriately.
