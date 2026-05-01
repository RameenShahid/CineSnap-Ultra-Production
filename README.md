# 🎬 CineSnap Ultra - Full Project Generator Script

# =========================
# 📁 CREATE ROOT PROJECT
# =========================
mkdir -p cinesnap-ultra
cd cinesnap-ultra

# =========================
# 📁 CREATE FOLDERS
# =========================
mkdir -p frontend/app/login frontend/app/register frontend/app/dashboard
mkdir -p frontend/components frontend/utils

mkdir -p backend/routes backend/models backend/middleware backend/config

mkdir -p ai-service

# =========================
# 📄 CREATE ROOT FILES
# =========================
touch docker-compose.yml README.md setup.sh

# =========================
# 📄 FRONTEND FILES
# =========================
touch frontend/app/page.jsx
touch frontend/app/layout.jsx
touch frontend/app/globals.css
touch frontend/app/login/page.jsx
touch frontend/app/register/page.jsx
touch frontend/app/dashboard/page.jsx

touch frontend/components/Navbar.jsx
touch frontend/components/ImageUploader.jsx
touch frontend/components/Controls.jsx
touch frontend/components/ResultViewer.jsx

touch frontend/utils/api.js
touch frontend/package.json
touch frontend/next.config.js
touch frontend/tailwind.config.js
touch frontend/.env.local

# =========================
# 📄 BACKEND FILES
# =========================
touch backend/server.js
touch backend/package.json
touch backend/.env

touch backend/routes/auth.js
touch backend/routes/removeBg.js
touch backend/routes/billing.js

touch backend/models/User.js
touch backend/middleware/auth.js
touch backend/config/database.js

# =========================
# 📄 AI SERVICE FILES
# =========================
touch ai-service/app.py
touch ai-service/requirements.txt
touch ai-service/Dockerfile
touch ai-service/.env

# =========================
# 📝 WRITE README.md
# =========================
cat << 'EOF' > README.md
# 🎬 CineSnap Ultra
### Transform Your Photos into Cinematic, AI-Enhanced Masterpieces Instantly

CineSnap Ultra is a full-stack AI-powered photo editing platform that converts ordinary images into cinematic visuals using AI.

---

## 🌟 Features
- AI Background Removal
- Cinematic Filters
- Lighting & Color Control
- Real-time UI
- Full-stack architecture (Next.js + Node + FastAPI)

---

## 🏗 Structure

cinesnap-ultra/
├── frontend/
├── backend/
├── ai-service/
├── docker-compose.yml
├── README.md
└── setup.sh

---

## 🚀 Run

### AI Service
cd ai-service
pip install -r requirements.txt
python app.py

### Backend
cd backend
npm install
npm run dev

### Frontend
cd frontend
npm install
npm run dev

---

## 🎯 Vision
Turn anyone into a cinematic influencer using AI 🚀

EOF

# =========================
# 🐳 DOCKER COMPOSE
# =========================
cat << 'EOF' > docker-compose.yml
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"

  backend:
    build: ./backend
    ports:
      - "5000:5000"

  ai-service:
    build: ./ai-service
    ports:
      - "8000:8000"
EOF

# =========================
# 🎉 DONE
# =========================
echo "✅ CineSnap Ultra project structure created successfully!"
echo "📁 Navigate into: cinesnap-ultra/"
echo "🚀 Start building your AI app!"
