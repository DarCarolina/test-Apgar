from datetime import datetime, timezone
from sqlalchemy.orm import Session
from . import models, schemas

def calcular_clasificacion_apgar(puntaje: int) -> str:
    if puntaje <= 3:
        return 'Crítico (0-3)'
    elif puntaje <= 6:
        return 'Moderado (4-6)'
    return 'Bien (7-10)'

def calcular_clasificacion_silverman(puntaje: int) -> str:
    if puntaje == 0:
        return 'Sin dificultad'
    elif puntaje <= 3:
        return 'Leve'
    elif puntaje <= 6:
        return 'Moderada'
    return 'Severa'

# --- CASOS ---
def get_casos(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.CasoNeonatal).order_by(models.CasoNeonatal.fecha_nacimiento.desc()).offset(skip).limit(limit).all()

def get_caso(db: Session, caso_id: int):
    return db.query(models.CasoNeonatal).filter(models.CasoNeonatal.id == caso_id).first()

def crear_caso(db: Session, caso: schemas.CasoNeonatalCreate):
    # 1. Crear el caso base
    db_caso = models.CasoNeonatal(
        nombre_neonato=caso.nombre_neonato,
        sexo=caso.sexo,
        peso_gramos=caso.peso_gramos,
        edad_gestacional_semanas=caso.edad_gestacional_semanas,
        edad_gestacional_dias=caso.edad_gestacional_dias,
        tipo_parto=caso.tipo_parto,
        notas=caso.notas,
        fecha_nacimiento=datetime.now(timezone.utc)
    )
    db.add(db_caso)
    db.flush() # Para obtener el ID

    # 2. Agregar evaluaciones APGAR iniciales
    for apgar_in in caso.evaluaciones_apgar:
        puntaje = (
            apgar_in.ritmo_cardiaco + apgar_in.esfuerzo_respiratorio +
            apgar_in.tono_muscular + apgar_in.reflejos + apgar_in.color
        )
        data = apgar_in.model_dump() # dict() is deprecated in Pydantic v2
        db_apgar = models.EvaluacionAPGAR(
            **data,
            caso_id=db_caso.id,
            puntaje_total=puntaje,
            clasificacion=calcular_clasificacion_apgar(puntaje)
        )
        db.add(db_apgar)

    # 3. Agregar evaluación Silverman si existe
    if caso.evaluacion_silverman:
        sil_in = caso.evaluacion_silverman
        puntaje = (
            sil_in.disociacion_toraco_abdominal + sil_in.tiraje_intercostal +
            sil_in.retraccion_xifoidea + sil_in.aleteo_nasal + sil_in.quejido_espiratorio
        )
        data_sil = sil_in.model_dump()
        db_sil = models.EvaluacionSilverman(
            **data_sil,
            caso_id=db_caso.id,
            puntaje_total=puntaje,
            clasificacion=calcular_clasificacion_silverman(puntaje)
        )
        db.add(db_sil)

    db.commit()
    db.refresh(db_caso)
    return db_caso

# --- AGREGAR EVALUACIONES A CASO EXISTENTE ---
def agregar_apgar(db: Session, caso_id: int, apgar_in: schemas.EvaluacionAPGARCreate):
    puntaje = (
        apgar_in.ritmo_cardiaco + apgar_in.esfuerzo_respiratorio +
        apgar_in.tono_muscular + apgar_in.reflejos + apgar_in.color
    )
    db_apgar = models.EvaluacionAPGAR(
        **apgar_in.dict(),
        caso_id=caso_id,
        puntaje_total=puntaje,
        clasificacion=calcular_clasificacion_apgar(puntaje)
    )
    db.add(db_apgar)
    db.commit()
    return db_apgar
