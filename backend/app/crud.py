from sqlalchemy.orm import Session
from . import models, schemas

def calcular_clasificacion(puntaje: int) -> str:
    """
    Calcula la clasificación basada en el puntaje total.
    """
    if puntaje <= 3:
        return 'Crítico (0-3)'
    elif puntaje <= 6:
        return 'Moderado (4-6)'
    return 'Bien (7-10)'

def calcular_diagnostico(puntaje: int) -> str:
    """
    Genera un diagnóstico clínico basado en el puntaje APGAR.
    """
    if puntaje <= 3:
        return "El recién nacido presenta una depresión severa. Requiere maniobras de reanimación neonatal inmediata para salvar su vida."
    elif puntaje <= 6:
        return "El recién nacido presenta una depresión moderada. Puede requerir asistencia respiratoria, estimulación o administración de oxígeno."
    else:
        return "El recién nacido se encuentra en excelentes condiciones de salud y no requiere asistencia inmediata."

def get_evaluacion(db: Session, evaluacion_id: int):
    return db.query(models.Evaluacion).filter(models.Evaluacion.id == evaluacion_id).first()

def get_evaluaciones(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Evaluacion).order_by(models.Evaluacion.fecha_registro.desc()).offset(skip).limit(limit).all()

def crear_evaluacion(db: Session, evaluacion: schemas.EvaluacionCreate):
    """
    Crea un registro de evaluación, calculando el puntaje y la clasificación.
    """
    # Sumar todos los parámetros de la evaluación
    puntaje = (
        evaluacion.ritmo_cardiaco +
        evaluacion.esfuerzo_respiratorio +
        evaluacion.tono_muscular +
        evaluacion.reflejos +
        evaluacion.color
    )
    
    # Obtener clasificación y diagnóstico
    clasificacion = calcular_clasificacion(puntaje)
    diagnostico = calcular_diagnostico(puntaje)
    
    # Crear la instancia del modelo
    db_evaluacion = models.Evaluacion(
        nombre_neonato=evaluacion.nombre_neonato,
        ritmo_cardiaco=evaluacion.ritmo_cardiaco,
        esfuerzo_respiratorio=evaluacion.esfuerzo_respiratorio,
        tono_muscular=evaluacion.tono_muscular,
        reflejos=evaluacion.reflejos,
        color=evaluacion.color,
        puntaje_total=puntaje,
        clasificacion=clasificacion,
        diagnostico=diagnostico
    )
    
    db.add(db_evaluacion)
    db.commit()
    db.refresh(db_evaluacion)
    return db_evaluacion
