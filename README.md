# Expediente Neonatal Unificado Premium 🏥

Este proyecto es una aplicación web profesional para la gestión, evaluación y análisis del recién nacido. Permite un seguimiento clínico longitudinal mediante los tests de APGAR y Silverman-Anderson, integrados en un flujo de trabajo moderno y eficiente.

## 🚀 Requisitos Previos

- **Python 3.10+**
- **Node.js y npm**
- **PostgreSQL** (Puerto: 5432, Usuario: `postgres`, Password: `postgresql123`)

## 🛠️ Configuración Inicial

### 1. Clonar e Ingresar al Directorio
```powershell
cd "c:\Proyectos BC3 U5\test-Apgar"
```

### 2. Entorno Virtual (VENV)
```powershell
# Crear el entorno (solo la primera vez)
python -m venv venv

# ACTIVAR el entorno
.\venv\Scripts\activate
```

### 3. Instalar Dependencias
```powershell
# Backend
pip install -r backend/requirements.txt

# Frontend
cd frontend
npm install
cd ..
```

## ▶️ Ejecución de la Aplicación

### Terminal 1: Backend (FastAPI)
```powershell
.\venv\Scripts\activate
cd backend
uvicorn app.main:app --reload
```
API: `http://localhost:8000` | Docs: `http://localhost:8000/docs`

### Terminal 2: Frontend (Vite)
```powershell
cd frontend
npm run dev
```
Aplicación: `http://localhost:3000`

## ✨ Características Profesionales
- **Expediente Único**: Agrupa todas las evaluaciones de un mismo neonato.
- **Stepper de 4 Pasos**: Interfaz guiada (Nacimiento -> APGAR -> Silverman -> Resumen).
- **Análisis de Riesgo**: Detección automática de bajo peso, prematuridad y distrés respiratorio.
- **Gráficos de Evolución**: Visualización de la recuperación neonatal en tiempo real.
- **Diseño Glassmorphism**: Estética moderna, limpia y profesional.

---

## 🤖 Desarrollo con IA
Este proyecto ha sido desarrollado y optimizado por **Antigravity** (Google DeepMind).
La IA permitió transformar un calculador básico en una plataforma clínica integral, asegurando una arquitectura escalable y una experiencia de usuario de nivel hospitalario.
