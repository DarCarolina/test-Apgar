from sqlalchemy import create_engine
from app.database import SessionLocal
from app import models, crud, schemas
from datetime import datetime, timezone

try:
    db = SessionLocal()
    print("Testing crud.crear_caso...")
    
    # Simular datos de entrada
    apgar_list = [
        schemas.EvaluacionAPGARCreate(
            minuto=1, ritmo_cardiaco=2, esfuerzo_respiratorio=2, 
            tono_muscular=2, reflejos=2, color=2
        ),
        schemas.EvaluacionAPGARCreate(
            minuto=5, ritmo_cardiaco=2, esfuerzo_respiratorio=2, 
            tono_muscular=2, reflejos=2, color=2
        )
    ]
    silverman = schemas.EvaluacionSilvermanCreate(
        disociacion_toraco_abdominal=0, tiraje_intercostal=0,
        retraccion_xifoidea=0, aleteo_nasal=0, quejido_espiratorio=0
    )
    
    caso_in = schemas.CasoNeonatalCreate(
        nombre_neonato="Ana Sofia Test",
        sexo=models.SexoEnum.FEMENINO,
        peso_gramos=3100,
        edad_gestacional_semanas=39,
        edad_gestacional_dias=3,
        tipo_parto=models.TipoPartoEnum.VAGINAL,
        notas="Test Final Logic",
        evaluaciones_apgar=apgar_list,
        evaluacion_silverman=silverman
    )
    
    db_caso = crud.crear_caso(db, caso_in)
    print(f"Insert success! ID: {db_caso.id}")
    print(f"APGAR count: {len(db_caso.evaluaciones_apgar)}")
    print(f"Silverman clasif: {db_caso.evaluacion_silverman.clasificacion}")
    
    db.delete(db_caso)
    db.commit()
    print("Cleanup success!")
except Exception as e:
    import traceback
    print("ERROR DETECTED:")
    print(traceback.format_exc())
finally:
    db.close()
