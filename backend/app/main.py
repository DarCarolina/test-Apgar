from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

from . import crud, models, schemas
from .database import engine, get_db

# Crear las tablas en la base de datos
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="API de Evaluación APGAR", description="API para el registro y cálculo del test APGAR")

# Configurar CORS para permitir peticiones desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especificar los orígenes permitidos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Bienvenido a la API del Test APGAR"}

@app.post("/evaluaciones/", response_model=schemas.EvaluacionResponse)
def crear_evaluacion(evaluacion: schemas.EvaluacionCreate, db: Session = Depends(get_db)):
    """
    Crea una nueva evaluación APGAR.
    """
    return crud.crear_evaluacion(db=db, evaluacion=evaluacion)

@app.get("/evaluaciones/", response_model=List[schemas.EvaluacionResponse])
def leer_evaluaciones(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Obtiene el historial de evaluaciones.
    """
    evaluaciones = crud.get_evaluaciones(db, skip=skip, limit=limit)
    return evaluaciones
