#!/usr/bin/env bash
# Render build script

set -o errexit  # exit on error

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Collect static files (if needed)
python manage.py collectstatic --noinput

# Run migrations
python manage.py migrate
