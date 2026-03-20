# test-Apgar

Sistema de Evaluación APGAR para Neonatología

## 📦 Stack Tecnológico

- Python 3.10+
- NiceGUI
- SQLAlchemy (code-first)
- SQLite (base de datos local `apgar.db`)

## ▶️ Ejecución local con NiceGUI

1. Clonar el repositorio:
   - `git clone <URL_del_repo>`
   - `cd test-Apgar`

2. Crear e ingresar al entorno virtual (recomendado):
   - Windows:
     - `python -m venv venv`
     - `venv\\Scripts\\activate`
   - Linux/macOS:
     - `python3 -m venv venv`
     - `source venv/bin/activate`

3. Instalar dependencias:
   - `pip install -r requirements.txt`

4. Ejecutar la aplicación:
   - `python app.py`

5. Abrir en el navegador:
   - `http://127.0.0.1:8080`

## 🧪 Ejecución de pruebas

- `pytest -q`

## 🗄️ Base de datos (Code-first)

- El archivo SQLite se genera automáticamente en `apgar.db`.
- Modelo `Evaluacion` en `app.py`.
- Al iniciar, se ejecuta `db.create_all()` para crear tablas automáticamente.

## 🛠️ Despliegue en otra computadora

1. Copiar el proyecto o clonar desde repositorio.
2. Instalar Python 3.10+.
3. Seguir pasos de instalación anteriores (entorno virtual + `pip install`).
4. Ejecutar `python app.py`.
5. Asegurarse de que el puerto 8080 esté disponible.

## 🧩 Funcionalidades incluidas

- Registro del nombre del bebé.
- Ingreso de los 5 parámetros APGAR (0-2).
- Validación de datos en el servidor.
- Cálculo de puntaje y clasificación automática.
- Almacenamiento de evaluaciones en SQLite.
- Visualización de historial (ruta `/historial`).

