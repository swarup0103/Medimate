FROM node:22-bookworm-slim AS frontend-build
WORKDIR /build
COPY live-deploy/archive/ /tmp/archive-parts/
COPY live-deploy/patch_branding.mjs /tmp/patch_branding.mjs
RUN apt-get update && apt-get install -y --no-install-recommends unzip \
    && cat /tmp/archive-parts/part-*.b64 | base64 -d > /tmp/MediMateDeploy.zip \
    && unzip -q /tmp/MediMateDeploy.zip -d /build \
    && rm -rf /var/lib/apt/lists/*
RUN node /tmp/patch_branding.mjs /build/medimate \
    && sed -i 's|"./login.css"|"./Login.css"|' /build/medimate/src/pages/Login.jsx \
    && sed -i 's|"./register.css"|"./Register.css"|' /build/medimate/src/pages/Register.jsx
RUN cd /build/medimate && npm ci --no-audit --no-fund && npm run build

FROM python:3.12-slim
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
WORKDIR /app
COPY --from=frontend-build /build/backend/requirements.txt /app/backend/requirements.txt
RUN pip install --no-cache-dir -r /app/backend/requirements.txt
COPY --from=frontend-build /build/backend /app/backend
COPY live-deploy/init_core_schema.py /app/backend/init_core_schema.py
COPY --from=frontend-build /build/medimate/dist /app/medimate/dist
WORKDIR /app/backend
CMD ["sh","-c","python init_core_schema.py && gunicorn --bind 0.0.0.0:${PORT:-8080} --workers 1 --threads 4 --timeout 120 app:app"]
