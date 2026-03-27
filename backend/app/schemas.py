from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Optional
from .models import SexoEnum, TipoPartoEnum

# --- APGAR ---
class EvaluacionAPGARBase(BaseModel):
    minuto: int = Field(..., ge=1, le=20)
    ritmo_cardiaco: int = Field(..., ge=0, le=2)
    esfuerzo_respiratorio: int = Field(..., ge=0, le=2)
    tono_muscular: int = Field(..., ge=0, le=2)
    reflejos: int = Field(..., ge=0, le=2)
    color: int = Field(..., ge=0, le=2)

class EvaluacionAPGARCreate(EvaluacionAPGARBase):
    pass

class EvaluacionAPGARResponse(EvaluacionAPGARBase):
    id: int
    puntaje_total: int
    clasificacion: str
    fecha_registro: datetime

    class Config:
        from_attributes = True

# --- SILVERMAN ---
class EvaluacionSilvermanBase(BaseModel):
    disociacion_toraco_abdominal: int = Field(..., ge=0, le=2)
    tiraje_intercostal: int = Field(..., ge=0, le=2)
    retraccion_xifoidea: int = Field(..., ge=0, le=2)
    aleteo_nasal: int = Field(..., ge=0, le=2)
    quejido_espiratorio: int = Field(..., ge=0, le=2)

class EvaluacionSilvermanCreate(EvaluacionSilvermanBase):
    pass

class EvaluacionSilvermanResponse(EvaluacionSilvermanBase):
    id: int
    puntaje_total: int
    clasificacion: str
    fecha_registro: datetime

    class Config:
        from_attributes = True

# --- CASO NEONATAL ---
class CasoNeonatalBase(BaseModel):
    nombre_neonato: str = Field(..., min_length=1)
    sexo: SexoEnum
    peso_gramos: int = Field(..., gt=0)
    edad_gestacional_semanas: int = Field(..., ge=20, le=45)
    edad_gestacional_dias: int = Field(..., ge=0, le=6)
    tipo_parto: TipoPartoEnum
    notas: Optional[str] = None

class CasoNeonatalCreate(CasoNeonatalBase):
    evaluaciones_apgar: List[EvaluacionAPGARCreate]
    evaluacion_silverman: Optional[EvaluacionSilvermanCreate] = None

class CasoNeonatalResponse(CasoNeonatalBase):
    id: int
    fecha_nacimiento: datetime
    evaluaciones_apgar: List[EvaluacionAPGARResponse]
    evaluacion_silverman: Optional[EvaluacionSilvermanResponse]

    class Config:
        from_attributes = True
