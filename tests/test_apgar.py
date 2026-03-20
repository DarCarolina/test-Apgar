import pytest
from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

import app


def test_clasificar_puntaje_bajo():
    assert app.clasificar(0) == 'Crítico (0-3)'
    assert app.clasificar(3) == 'Crítico (0-3)'


def test_clasificar_puntaje_medio():
    assert app.clasificar(4) == 'Moderado (4-6)'
    assert app.clasificar(6) == 'Moderado (4-6)'


def test_clasificar_puntaje_alto():
    assert app.clasificar(7) == 'Bien (7-10)'
    assert app.clasificar(10) == 'Bien (7-10)'


def test_obtener_historial_con_session_local_monkeypatch(tmp_path, monkeypatch):
    # usar DB local en carpeta temporal para no tocar apgar.db principal
    db_path = tmp_path / 'test_apgar.db'
    db_url = f'sqlite:///{db_path}'
    engine = create_engine(db_url, connect_args={'check_same_thread': False})
    app.Base.metadata.create_all(bind=engine)

    TestSession = sessionmaker(bind=engine)
    monkeypatch.setattr(app, 'SessionLocal', TestSession)

    session = TestSession()
    evaluacion = app.Evaluacion(
        nombre='Test Bebé',
        ritmo_cardiaco=2,
        esfuerzo_respiratorio=2,
        tono_muscular=2,
        reflejos=2,
        color=2,
        puntaje_total=10,
        clasificacion='Bien (7-10)',
    )
    session.add(evaluacion)
    session.commit()
    session.close()

    historial = app.obtener_historial()
    assert len(historial) == 1
    assert historial[0]['nombre'] == 'Test Bebé'
    assert historial[0]['puntaje'] == 10


if __name__ == '__main__':
    pytest.main()