from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime, timezone
from .database import Base

class Evaluacion(Base):
    """
    Modelo representativo de una evaluación APGAR en la base de datos.
    Almacena los 5 parámetros, el puntaje total, la clasificación y los datos del neonato.
    """
    __tablename__ = "evaluaciones"

    id = Column(Integer, primary_key=True, index=True)
    nombre_neonato = Column(String, nullable=False)
    
    # Parámetros APGAR (0-2)
    ritmo_cardiaco = Column(Integer, nullable=False)
    esfuerzo_respiratorio = Column(Integer, nullable=False)
    tono_muscular = Column(Integer, nullable=False)
    reflejos = Column(Integer, nullable=False)
    color = Column(Integer, nullable=False)
    
    # Resultados calculados
    puntaje_total = Column(Integer, nullable=False)
    clasificacion = Column(String, nullable=False)
    
    # Fecha de registro
    fecha_registro = Column(DateTime, default=lambda: datetime.now(timezone.utc))
