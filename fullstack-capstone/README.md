# fullstack_developer_capstone

## Project Name: Full Stack Application Development Capstone Project — Best Cars Dealership Reviews

**Course-required repository name:** `fullstack_developer_capstone`  
**Current containing repository:** `github-final-project` (project under `fullstack-capstone/`).

**Note:** The course grader requires a GitHub repository *named* `fullstack_developer_capstone`; including this name in this README alone does not meet that repository-name requirement.
**Project:** Full Stack Application Development Capstone Project (Car Dealership Reviews)
**Student submission:** IBM Skills Network / Coursera

Django backend, React frontend and dealership/review APIs based on the IBM Skills Network full stack capstone starter project.

Source code is in `fullstack-capstone/server/`.

## Local development
```bash
cd fullstack-capstone/server
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

This GitHub source code is **not proof of production deployment**. Live Code Engine URL and screenshots must come from an actual successful deployment.

## Coursework routes
- `/djangoapp/get_dealers`, `/fetchDealers`, and `/fetchDealers/Kansas`
- `/djangoapp/dealer/15`
- `/djangoapp/reviews/dealer/15`
- `/djangoapp/login` and `/djangoapp/logout` (GET supported for the course cURL demonstration)
- `/about`, `/contact`, `/`

Upstream IBM starter: https://github.com/ibm-developer-skills-network/xrwvm-fullstack_developer_capstone

## Automated lint workflow

The GitHub Actions workflow `.github/workflows/fullstack-lint.yml` includes Python Lint and React Lint jobs, each with Install dependencies and Run Linter steps. Only a **green successful completed run** qualifies as evidence for Task 23 (Coursera Question 22). GitHub Actions build logs are not a substitute.
