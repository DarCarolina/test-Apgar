# Documentación de Requerimientos - Expediente Neonatal Unificado

## 📌 Datos del Proyecto
* **Nombre del Proyecto:** Expediente Neonatal Unificado (Unified Neonatal Record)
* **Status:** Implementado (Versión Profesional)

## ❓ Problemática Identificada
En el entorno de neonatología, la rapidez y precisión en la evaluación del recién nacido son críticas. El Test APGAR es el estándar, pero una evaluación aislada no es suficiente para un seguimiento clínico de calidad. Se identificó la necesidad de un sistema que permita:
1.  **Seguimiento Longitudinal**: Registrar múltiples evaluaciones APGAR en el tiempo (1m, 5m, 10m).
2.  **Evaluación Respiratoria**: Integrar el Test de Silverman-Anderson para detectar distrés respiratorio.
3.  **Análisis de Riesgo**: Identificar automáticamente neonatos con bajo peso o prematuridad.
4.  **Consolidación**: Mantener un expediente clínico único por paciente.

## 🚀 Funcionalidades Implementadas (Versión Actual)
*   **Expediente Neonatal Unificado**: Modelo de datos relacional que agrupa todas las evaluaciones de un mismo neonato.
*   **Stepper Interactivo de 4 Pasos**:
    1.  **Datos de Nacimiento**: Registro de nombre, peso, edad gestacional, sexo y tipo de parto.
    2.  **Línea de Tiempo APGAR**: Evaluación de ritmo, esfuerzo, tono, reflejos y color con gráfico de tendencia en tiempo real.
    3.  **Test de Silverman-Anderson**: Evaluación de disociación, tiraje, retracción, aleteo y quejido.
    4.  **Análisis y Resumen**: Consolidado clínico con cálculos automáticos y notas.
*   **Motor de Reglas Clínicas**: Generación automática de alertas:
    *   ⚠️ **Bajo Peso**: < 2500g.
    *   ⏰ **Pretérmino**: < 37 semanas.
    *   🫁 **Dificultad Respiratoria**: Score Silverman > 0.
*   **Visualización de Datos**: Gráficos dinámicos con `recharts` para observar la recuperación neonatal.
*   **Historial Clínico**: Panel lateral para búsqueda y revisión de expedientes guardados.

## 🛠️ Stack Tecnológico Utilizado
*   **Frontend**: React + Vite + Vanilla CSS (Glassmorphism design).
*   **Backend**: FastAPI (Python 3.10+).
*   **Base de Datos**: PostgreSQL (SQLAlchemy v2).
*   **Visualización**: Lucide React (Iconos) + Recharts (Gráficos).

## 🤖 Desarrollo con IA
Este proyecto fue desarrollado y potenciado por **Antigravity** (Google DeepMind). La IA permitió transformar un calculador simple en una herramienta clínica de nivel hospitalario en tiempo récord, asegurando:
- Arquitectura robusta y escalable.
- UX fluida y estética premium.
- Lógica médica validada mediante reglas de negocio.
