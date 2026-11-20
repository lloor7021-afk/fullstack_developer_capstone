# Full Stack Application Development Capstone Project

Best Cars Dealership Reviews — IBM Skills Network / Coursera.

This public repository is named `fullstack_developer_capstone`, as required by the course. The completed application is under `fullstack-capstone/server/`. It was copied from the latest corrected project in `lloor7021-afk/github-final-project`; the original repository is retained.

## Application

- Django authentication, registration, logout, admin, and review storage.
- React dealership listing, state filter, dealer details, review form, and sentiment icons.
- Dataset: 50 dealers, 5 car makes, and 110 car models.
- VADER sentiment endpoint for review text.
- GitHub Actions: Python Lint and React Lint, each with Install dependencies and Run Linter.
- Multi-stage Docker build for IBM Cloud Code Engine.

## Run locally

```bash
cd fullstack-capstone/server
python -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_cars
cd frontend
npm ci
npm run build
cd ..
python manage.py runserver
```

Create the course admin account interactively with `python manage.py createsuperuser --username root`. Keep credentials out of git.

## Coursework API routes

- `/fetchDealers`
- `/fetchDealers/Kansas`
- `/djangoapp/dealer/15`
- `/djangoapp/reviews/dealer/15`
- `/djangoapp/get_cars`
- `/analyze/Fantastic%20services`
- `/djangoapp/register`, `/djangoapp/login`, `/djangoapp/logout`

GET logout is supported for the course cURL demonstration. POST requests require the Django CSRF cookie and header. HTTPS cURL POST requests also send a same-origin Referer.

## Code Engine

Public application: https://fullstack-capstone.2hdtxqm90q23.us-south.codeengine.appdomain.cloud/

Build context: `fullstack-capstone/server`. Dockerfile builds React and serves Django with Gunicorn and WhiteNoise on port 8080. SQLite user/review data is instance-local and may reset when the application revision is replaced; this course deployment uses one instance.

## Starter and license

IBM starter: https://github.com/ibm-developer-skills-network/xrwvm-fullstack_developer_capstone

See the repository license.
