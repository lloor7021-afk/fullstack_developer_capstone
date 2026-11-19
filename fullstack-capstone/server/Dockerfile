FROM node:20-bookworm-slim AS frontend
WORKDIR /build
COPY frontend/package*.json ./
RUN npm ci --no-audit --no-fund
COPY frontend/ ./
RUN npm run build

FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt whitenoise==6.11.0
COPY . .
COPY --from=frontend /build/build ./frontend/build
ENV DJANGO_DEBUG=0 PORT=8080
RUN python manage.py collectstatic --noinput
EXPOSE 8080
CMD ["sh", "start.sh"]
