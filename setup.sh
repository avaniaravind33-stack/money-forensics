cd /Users/avaniaravind/money-forensics

# Initialize Next.js frontend
npx create-next-app@latest frontend --typescript --tailwind --app --no-eslint --import-alias "@/*" --yes

# Initialize FastAPI backend
mkdir -p backend/app/{api,models,core,services}
touch backend/app/__init__.py
touch backend/app/main.py
touch backend/requirements.txt
touch backend/Dockerfile
touch Procfile
touch railway.json
