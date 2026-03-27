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

@app.get("/casos/", response_model=List[schemas.CasoNeonatalResponse])
def leer_casos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_casos(db, skip=skip, limit=limit)

@app.get("/casos/{caso_id}", response_model=schemas.CasoNeonatalResponse)
def leer_caso(caso_id: int, db: Session = Depends(get_db)):
    db_caso = crud.get_caso(db, caso_id=caso_id)
    if db_caso is None:
        raise HTTPException(status_code=404, detail="Caso no encontrado")
    return db_caso

@app.post("/casos/", response_model=schemas.CasoNeonatalResponse)
def crear_caso(caso: schemas.CasoNeonatalCreate, db: Session = Depends(get_db)):
    return crud.crear_caso(db=db, caso=caso)

@app.post("/casos/{caso_id}/apgar/", response_model=schemas.EvaluacionAPGARResponse)
def agregar_apgar_a_caso(caso_id: int, apgar: schemas.EvaluacionAPGARCreate, db: Session = Depends(get_db)):
    return crud.agregar_apgar(db=db, caso_id=caso_id, apgar_in=apgar)
