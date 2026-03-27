# Design Spec: Unified Neonatal Record 🏥

This document outlines the design for upgrading the APGAR evaluation system into a professional "Unified Neonatal Record" (Expediente Neonatal Unificado).

## Goal
Transform the basic APGAR calculator into a professional clinical assessment tool capable of tracking neonatal progress, evaluating respiratory distress (Silverman-Anderson), and providing automatic risk analysis based on birth data.

## Proposed Architecture

### 1. Data Model (Backend)
We will transition from a single `Evaluacion` entity to a hierarchical structure:

#### `CasoNeonatal` (Case)
- `id` (PK)
- `nombre_neonato` (string)
- `fecha_nacimiento` (datetime)
- `sexo` (enum: Masculino, Femenino, Indeterminado)
- `peso_gramos` (int)
- `edad_gestacional_semanas` (int)
- `edad_gestacional_dias` (int)
- `tipo_parto` (enum: Vaginal, Cesárea)
- `notas` (text, optional)

#### `EvaluacionAPGAR` (Assessment)
- `caso_id` (FK -> CasoNeonatal)
- `minuto` (int: 1, 5, 10, 15, 20)
- `ritmo_cardiaco`, `esfuerzo_respiratorio`, `tono_muscular`, `reflejos`, `color` (int: 0-2)
- `puntaje_total` (int: 0-10)
- `clasificacion` (string: Bien, Moderado, Crítico)

#### `EvaluacionSilverman` (Respiratory)
- `caso_id` (FK -> CasoNeonatal)
- `disociacion_toraco_abdominal`, `tiraje_intercostal`, `retraccion_xifoidea`, `aleteo_nasal`, `quejido_espiratorio` (int: 0-2)
- `puntaje_total` (int: 0-10)
- `clasificacion` (string: Sin dificultad, Leve, Moderada, Severa)

### 2. UI/UX Flow (Frontend)
A professional stepper-based workflow using Glassmorphism design:

- **Step 1: Patient Data**: Input weight, gestational age, and birth details.
- **Step 2: Vitality (APGAR)**: 
    - Interactive timeline allowing users to add multiple assessments (1m, 5m, etc.).
    - Real-time line chart showing score trends.
- **Step 3: Respiratory Assessment (Silverman)**: 
    - Visual select for the 5 parameters.
- **Step 4: Summary & Analysis**: 
    - Final report showing calculated risks and clinical notes.

### 3. Clinical Analysis Logic
- **Vitality Trend**: Alert if APGAR drops between minute 1 and 5.
- **Risk Calculation**: 
    - Classification of Low Birth Weight (< 2500g, < 1500g).
    - Classification of Preterm (< 37 weeks).
- **Silverman Scoring**: Automatic classification of respiratory distress levels.

## Verification Plan

### Automated Tests
- Unit tests for the APGAR/Silverman calculation logic.
- Integration tests for the new database relationships.

### Manual Verification
- Walkthrough of the 3-step form.
- Verify that charts update correctly.
- Verify that risk alerts trigger based on weight/age.
