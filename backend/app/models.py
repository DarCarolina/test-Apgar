from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import enum
from .database import Base

class SexoEnum(str, enum.Enum):
    MASCULINO = "Masculino"
    FEMENINO = "Femenino"
    INDETERMINADO = "Indeterminado"

class TipoPartoEnum(str, enum.Enum):
    VAGINAL = "Vaginal"
    CESAREA = "Cesárea"

class CasoNeonatal(Base):
    """
    Modelo para agrupar todas las evaluaciones de un recién nacido.
    """
    __tablename__ = "casos_neonatales"

    id = Column(Integer, primary_key=True, index=True)
    nombre_neonato = Column(String, nullable=False)
    fecha_nacimiento = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    sexo = Column(Enum(SexoEnum), nullable=False)
    peso_gramos = Column(Integer, nullable=False)
    edad_gestacional_semanas = Column(Integer, nullable=False)
    edad_gestacional_dias = Column(Integer, nullable=False)
    tipo_parto = Column(Enum(TipoPartoEnum), nullable=False)
    notas = Column(String, nullable=True)
    
    # Relaciones
    evaluaciones_apgar = relationship("EvaluacionAPGAR", back_populates="caso", cascade="all, delete-orphan")
    evaluacion_silverman = relationship("EvaluacionSilverman", back_populates="caso", uselist=False, cascade="all, delete-orphan")

class EvaluacionAPGAR(Base):
    """
    Modelo para el Test APGAR en diferentes tiempos (1m, 5m, 10m...).
    """
    __tablename__ = "evaluaciones_apgar"

    id = Column(Integer, primary_key=True, index=True)
    caso_id = Column(Integer, ForeignKey("casos_neonatales.id"), nullable=False)
    minuto = Column(Integer, nullable=False) # 1, 5, 10...
    
    # Parámetros APGAR (0-2)
    ritmo_cardiaco = Column(Integer, nullable=False)
    esfuerzo_respiratorio = Column(Integer, nullable=False)
    tono_muscular = Column(Integer, nullable=False)
    reflejos = Column(Integer, nullable=False)
    color = Column(Integer, nullable=False)
    
    # Resultados calculados
    puntaje_total = Column(Integer, nullable=False)
    clasificacion = Column(String, nullable=False)
    diagnostico = Column(String, nullable=True)
    
    # Fecha de registro
    fecha_registro = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    caso = relationship("CasoNeonatal", back_populates="evaluaciones_apgar")

class EvaluacionSilverman(Base):
    """
    Modelo para el Test de Silverman-Anderson (Dificultad respiratoria).
    """
    __tablename__ = "evaluaciones_silverman"

    id = Column(Integer, primary_key=True, index=True)
    caso_id = Column(Integer, ForeignKey("casos_neonatales.id"), nullable=False)
    
    # Parámetros Silverman (0-2)
    disociacion_toraco_abdominal = Column(Integer, nullable=False)
    tiraje_intercostal = Column(Integer, nullable=False)
    retraccion_xifoidea = Column(Integer, nullable=False)
    aleteo_nasal = Column(Integer, nullable=False)
    quejido_espiratorio = Column(Integer, nullable=False)
    
    # Resultados calculados
    puntaje_total = Column(Integer, nullable=False)
    clasificacion = Column(String, nullable=False) # Sin distrés, Leve, Moderada, Severa
    fecha_registro = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    caso = relationship("CasoNeonatal", back_populates="evaluacion_silverman")
