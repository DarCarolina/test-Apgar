from sqlalchemy import create_engine, text
from app.database import SQLALCHEMY_DATABASE_URL

engine = create_engine(SQLALCHEMY_DATABASE_URL)

def migrate():
    with engine.connect() as conn:
        print("Eliminando tablas antiguas (si existen)...")
        # Eliminar en orden inverso a las llaves foráneas
        conn.execute(text("DROP TABLE IF EXISTS evaluaciones_apgar CASCADE;"))
        conn.execute(text("DROP TABLE IF EXISTS evaluaciones_silverman CASCADE;"))
        conn.execute(text("DROP TABLE IF EXISTS casos_neonatales CASCADE;"))
        conn.execute(text("DROP TABLE IF EXISTS evaluaciones CASCADE;"))
        conn.commit()
        print("Tablas eliminadas exitosamente.")

if __name__ == "__main__":
    migrate()
