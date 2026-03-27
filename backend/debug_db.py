from sqlalchemy import create_engine
from app.database import SessionLocal
from app import models
import enum

try:
    db = SessionLocal()
    # Test a simple query
    print("Testing CasoNeonatal query...")
    count = db.query(models.CasoNeonatal).count()
    print(f"Current cases: {count}")
    
    # Test a simple insert
    print("Testing insert...")
    test_caso = models.CasoNeonatal(
        nombre_neonato="Test Bug",
        sexo=models.SexoEnum.MASCULINO,
        peso_gramos=3000,
        edad_gestacional_semanas=40,
        edad_gestacional_dias=0,
        tipo_parto=models.TipoPartoEnum.VAGINAL,
        notas="Test"
    )
    db.add(test_caso)
    db.commit()
    print("Insert success!")
    db.delete(test_caso)
    db.commit()
    print("Cleanup success!")
except Exception as e:
    import traceback
    print("ERROR DETECTED:")
    print(traceback.format_exc())
finally:
    db.close()
