#!/bin/sh
set -eu
python manage.py migrate --noinput
python manage.py seed_cars
export DJANGO_SECRET_KEY="${DJANGO_SECRET_KEY:-$(python -c "import secrets; print(secrets.token_urlsafe(48))")}"
exec gunicorn djangoproj.wsgi:application --bind "0.0.0.0:${PORT:-8080}" --workers 1 --access-logfile -
