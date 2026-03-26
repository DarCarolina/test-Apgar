# Documentación de Requerimientos - Sistema de Evaluación APGAR

## 📌 Datos del Proyecto
* **Nombre del Proyecto:** Sistema de Evaluación APGAR para Neonatología
* **Carrera Objetivo:** Medicina / Neonatología / Enfermería

## ❓ Problemática Identificada
En el entorno de neonatología, la rapidez y precisión en la evaluación del recién nacido son críticas. El Test APGAR es el estándar de oro, pero su cálculo manual y el registro en papel pueden estar sujetos a errores o pérdida de información. Existe la necesidad de una herramienta digital centralizada que permita:
1.  Realizar el cálculo de forma automática e instantánea.
2.  Reducir el margen de error humano en la clasificación.
3.  Mantener un historial persistente y accesible de las evaluaciones realizadas.

## 🚀 Funcionalidades Principales (MVP)
*   **Interfaz de Entrada:** Formulario interactivo para ingresar el nombre del neonato y calificar los 5 parámetros (Ritmo cardíaco, Esfuerzo respiratorio, Tono muscular, Reflejos, Color).
*   **Cálculo Automático:** Procesamiento en tiempo real del puntaje total (0-10).
*   **Clasificación Dinámica:** Categorización automática según el puntaje (Crítico, Moderado, Bien).
*   **Persistencia de Datos:** Almacenamiento seguro de cada evaluación con fecha y hora.
*   **Visualización de Historial:** Lista interactiva para revisar todas las evaluaciones anteriores.

## 🛠️ Stack Tecnológico Utilizado
### Opción Premium (Recomendada)
*   **Frontend:** React + Vite + Vanilla CSS (Glassmorphism design).
*   **Backend:** FastAPI (Python).
*   **Base de Datos:** PostgreSQL (con SQLAlchemy ORM).

### Opción Ligera (NiceGUI)
*   **Interfaz:** NiceGUI (basado en Python).
*   **Base de Datos:** SQLite.

## 🤖 Uso de Inteligencia Artificial
Para el desarrollo de este proyecto se utilizó **Antigravity** (una herramienta de IA avanzada de Google DeepMind). La IA ayudó en:
*   **Arquitectura:** Diseño de la estructura modular Backend/Frontend.
*   **Automatización:** Generación de modelos de base de datos y esquemas de validación.
*   **UI/UX:** Creación de una interfaz moderna con efectos visuales premium (transparencias y animaciones).
*   **Documentación:** Estructuración de este archivo y del manual de usuario.
