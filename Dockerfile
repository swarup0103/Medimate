FROM node:22-bookworm-slim AS frontend-build
WORKDIR /build
COPY live-deploy/archive/ /tmp/archive-parts/
RUN apt-get update && apt-get install -y --no-install-recommends unzip \
    && cat /tmp/archive-parts/part-*.b64 | base64 -d > /tmp/MediMateDeploy.zip \
    && unzip -q /tmp/MediMateDeploy.zip -d /build \
    && rm -rf /var/lib/apt/lists/*
RUN cd /build/medimate && npm ci --no-audit --no-fund && npm run build

FROM python:3.12-slim
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
WORKDIR /app
COPY --from=frontend-build /build/backend/requirements.txt /app/backend/requirements.txt
RUN pip install --no-cache-dir -r /app/backend/requirements.txt
COPY --from=frontend-build /build/backend /app/backend
COPY --from=frontend-build /build/medimate/dist /app/medimate/dist
WORKDIR /app/backend
CMD ["sh","-c","gunicorn --bind 0.0.0.0:${PORT:-8080} --workers 1 --threads 4 --timeout 120 app:app"]
