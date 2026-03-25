from pydantic import BaseModel, Field, validator
from datetime import datetime
from typing import Optional

class EvaluacionBase(BaseModel):
    """
    Esquema base para la evaluación APGAR.
    """
    nombre_neonato: str = Field(..., min_length=1, description="Nombre del recién nacido")
    ritmo_cardiaco: int = Field(..., ge=0, le=2)
    esfuerzo_respiratorio: int = Field(..., ge=0, le=2)
    tono_muscular: int = Field(..., ge=0, le=2)
    reflejos: int = Field(..., ge=0, le=2)
    color: int = Field(..., ge=0, le=2)

class EvaluacionCreate(EvaluacionBase):
    """
    Esquema para la creación de una evaluación.
    El puntaje y la clasificación se calculan en el servidor o se validan.
    """
    pass

class EvaluacionResponse(EvaluacionBase):
    """
    Esquema para la respuesta de la API.
    """
    id: int
    puntaje_total: int
    clasificacion: str
    fecha_registro: datetime

    class Config:
        from_attributes = True
