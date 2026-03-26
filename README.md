# Sistema de Evaluación APGAR Premium 🏥

Este proyecto es una aplicación web moderna para calcular y registrar el Test APGAR en neonatología. Diseñado específicamente para profesionales de la salud, permite una evaluación rápida y precisa del estado del recién nacido.

El sistema ofrece una solución digital a la problemática de la gestión de datos en neonatología, permitiendo un seguimiento eficiente de cada paciente.

## 🚀 Requisitos Previos

- **Python 3.10+**
- **Node.js y npm**
- **PostgreSQL** (Puerto: 5432, Usuario: `postgres`, Password: `postgrest123`)

## 🛠️ Configuración Inicial

### 1. Clonar e Ingresar al Directorio
```powershell
cd "c:\Users\Danilo\Documents\DARLYNE\3BGU\PRUEBA UNIDAD 1\test-Apgar"
```

### 2. Entorno Virtual (VENV)
Para inicializar tu entorno de trabajo cada vez que comiences:
```powershell
# Crear el entorno (solo la primera vez)
python -m venv venv

# ACTIVAR el entorno (cada vez que trabajes)
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

Debes tener dos terminales abiertas con el entorno virtual activado en el caso del backend:

### Terminal 1: Backend (FastAPI)
```powershell
.\venv\Scripts\activate
cd backend
uvicorn app.main:app --reload
```
La API estará disponible en: `http://localhost:8000`

### Terminal 2: Frontend (Vite)
```powershell
cd frontend
npm run dev
```
La aplicación estará disponible en: `http://localhost:3000`

## 🗄️ Base de Datos
La aplicación se conecta automáticamente a PostgreSQL. Asegúrate de que el servicio de Postgres esté corriendo en el puerto 5432 con las credenciales configuradas en `backend/app/database.py`.

## ✨ Características
- **Interfaz Premium**: Diseño basado en Glassmorphism con efectos de transparencia y desenfoque.
- **Cálculo en Tiempo Real**: El puntaje y la clasificación se actualizan mientras seleccionas los parámetros.
- **Persistencia**: Todos los registros se guardan con fecha y hora en PostgreSQL.
- **Historial Interactivo**: Revisa las evaluaciones anteriores de forma instantánea.

---

## 🤖 Desarrollo con IA
Este proyecto ha sido desarrollado con la asistencia de **Antigravity**, una herramienta de IA avanzada de Google DeepMind.

La IA ha sido fundamental en:
- **Diseño de Arquitectura**: Separación limpia entre el backend de alto rendimiento (FastAPI) y el frontend reactivo.
- **Implementación de Lógica**: Programación precisa de los algoritmos de cálculo APGAR y validación de datos.
- **Estética Premium**: Aplicación de principios de diseño modernos como Glassmorphism y micro-animaciones.
- **Documentación**: Generación de guías de configuración y requerimientos.
