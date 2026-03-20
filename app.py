from nicegui import ui
from sqlalchemy import create_engine, Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

DATABASE_URL = 'sqlite:///apgar.db'
engine = create_engine(DATABASE_URL, connect_args={'check_same_thread': False})
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

class Evaluacion(Base):
    __tablename__ = 'evaluaciones'
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(120), nullable=False)
    ritmo_cardiaco = Column(Integer, nullable=False)
    esfuerzo_respiratorio = Column(Integer, nullable=False)
    tono_muscular = Column(Integer, nullable=False)
    reflejos = Column(Integer, nullable=False)
    color = Column(Integer, nullable=False)
    puntaje_total = Column(Integer, nullable=False)
    clasificacion = Column(String(64), nullable=False)
    fecha = Column(DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<Evaluacion {self.nombre} {self.puntaje_total}>"


def clasificar(puntaje):
    if puntaje <= 3:
        return 'Crítico (0-3)'
    elif puntaje <= 6:
        return 'Moderado (4-6)'
    return 'Bien (7-10)'


def init_db():
    Base.metadata.create_all(bind=engine)


def obtener_historial():
    session = SessionLocal()
    try:
        registros = session.query(Evaluacion).order_by(Evaluacion.fecha.desc()).all()
        return [
            {
                'fecha': r.fecha.strftime('%Y-%m-%d %H:%M:%S'),
                'nombre': r.nombre,
                'ritmo': r.ritmo_cardiaco,
                'respiracion': r.esfuerzo_respiratorio,
                'tono': r.tono_muscular,
                'reflejos': r.reflejos,
                'color': r.color,
                'puntaje': r.puntaje_total,
                'clasificacion': r.clasificacion,
            }
            for r in registros
        ]
    finally:
        session.close()

init_db()

with ui.page('/'):
    ui.markdown('# Sistema de Evaluación APGAR para Neonatología')

    with ui.card().classes('q-pa-md'):
        nombre_input = ui.input('Nombre del recién nacido').props('outlined').bind_value('')

        ritmo_input = ui.number('Ritmo Cardíaco (0-2)').props('outlined').bind_value(0).props('min=0 max=2')
        esfuerzo_input = ui.number('Esfuerzo Respiratorio (0-2)').props('outlined').bind_value(0).props('min=0 max=2')
        tono_input = ui.number('Tono Muscular (0-2)').props('outlined').bind_value(0).props('min=0 max=2')
        reflejos_input = ui.number('Reflejos (0-2)').props('outlined').bind_value(0).props('min=0 max=2')
        color_input = ui.number('Color (0-2)').props('outlined').bind_value(0).props('min=0 max=2')

        resultado = ui.label('')

        def guardar():
            nombre = nombre_input.value.strip()
            if not nombre:
                ui.notify('Ingrese el nombre del recién nacido.', color='negative')
                return

            try:
                valores = [
                    int(ritmo_input.value),
                    int(esfuerzo_input.value),
                    int(tono_input.value),
                    int(reflejos_input.value),
                    int(color_input.value),
                ]
            except (TypeError, ValueError):
                ui.notify('Los valores deben ser enteros entre 0 y 2.', color='negative')
                return

            if any(v not in [0, 1, 2] for v in valores):
                ui.notify('Cada parámetro APGAR debe estar entre 0 y 2.', color='negative')
                return

            puntaje_total = sum(valores)
            status = clasificar(puntaje_total)

            evaluacion = Evaluacion(
                nombre=nombre,
                ritmo_cardiaco=valores[0],
                esfuerzo_respiratorio=valores[1],
                tono_muscular=valores[2],
                reflejos=valores[3],
                color=valores[4],
                puntaje_total=puntaje_total,
                clasificacion=status,
            )

            session = SessionLocal()
            try:
                session.add(evaluacion)
                session.commit()
            finally:
                session.close()

            resultado.set_text(f'Evaluación guardada: {puntaje_total} puntos - {status}')
            ui.notify('Evaluación guardada correctamente.', color='positive')
            tabla.update(rows=obtener_historial())

        ui.button('Calcular y Guardar', on_click=guardar).props('unelevated')

    ui.separator()

    ui.markdown('## Historial de evaluaciones')

    tabla = ui.table(
        columns=[
            {'name': 'fecha', 'label': 'Fecha'},
            {'name': 'nombre', 'label': 'Nombre'},
            {'name': 'ritmo', 'label': 'Ritmo'},
            {'name': 'respiracion', 'label': 'Respiración'},
            {'name': 'tono', 'label': 'Tono'},
            {'name': 'reflejos', 'label': 'Reflejos'},
            {'name': 'color', 'label': 'Color'},
            {'name': 'puntaje', 'label': 'Puntaje'},
            {'name': 'clasificacion', 'label': 'Clasificación'},
        ],
        rows=obtener_historial(),
        row_key='fecha',
        dense=True,
    )


if __name__ == '__main__':
    ui.run(title='APGAR Neonatología', reload=True, dark=False)
