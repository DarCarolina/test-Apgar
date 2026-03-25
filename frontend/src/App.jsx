import React, { useState, useEffect } from 'react';

function App() {
  const [nombre, setNombre] = useState('');
  const [parametros, setParametros] = useState({
    ritmo_cardiaco: 0,
    esfuerzo_respiratorio: 0,
    tono_muscular: 0,
    reflejos: 0,
    color: 0
  });
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(false);
  const [resultadoActual, setResultadoActual] = useState(null);

  // Cargar historial al iniciar
  useEffect(() => {
    fetchHistorial();
  }, []);

  const fetchHistorial = async () => {
    try {
      const response = await fetch('/api/evaluaciones/');
      if (response.ok) {
        const data = await response.json();
        setHistorial(data);
      }
    } catch (error) {
      console.error('Error al cargar historial:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setParametros(prev => ({
      ...prev,
      [name]: parseInt(value)
    }));
  };

  const calcularPuntaje = () => {
    return Object.values(parametros).reduce((a, b) => a + b, 0);
  };

  const getBadgesClass = (puntaje) => {
    if (puntaje <= 3) return 'badge-critico';
    if (puntaje <= 6) return 'badge-moderado';
    return 'badge-bien';
  };

  const guardarEvaluacion = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) {
      alert('Por favor, ingrese el nombre del neonato.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/evaluaciones/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre_neonato: nombre,
          ...parametros
        })
      });

      if (response.ok) {
        const data = await response.json();
        setResultadoActual(data);
        setNombre('');
        setParametros({
          ritmo_cardiaco: 0,
          esfuerzo_respiratorio: 0,
          tono_muscular: 0,
          reflejos: 0,
          color: 0
        });
        fetchHistorial();
      } else {
        alert('Error al guardar la evaluación');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const puntajeTotal = calcularPuntaje();

  return (
    <div className="app-container">
      {/* Columna de Formulario */}
      <div className="card">
        <h1>🏥 Test APGAR</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Evaluación rápida del estado de salud del recién nacido.
        </p>

        <form onSubmit={guardarEvaluacion}>
          <div className="input-group">
            <label>Nombre del Neonato</label>
            <input 
              type="text" 
              value={nombre} 
              onChange={(e) => setNombre(e.target.value)} 
              placeholder="Ej. Juan Pérez"
              autoFocus
            />
          </div>

          <div className="parameter-grid">
            <div className="input-group">
              <label>🫀 Ritmo Cardíaco</label>
              <select name="ritmo_cardiaco" value={parametros.ritmo_cardiaco} onChange={handleChange}>
                <option value="0">0 - Ausente</option>
                <option value="1">1 - Menos de 100 lpm</option>
                <option value="2">2 - Más de 100 lpm</option>
              </select>
            </div>

            <div className="input-group">
              <label>🫁 Esfuerzo Respiratorio</label>
              <select name="esfuerzo_respiratorio" value={parametros.esfuerzo_respiratorio} onChange={handleChange}>
                <option value="0">0 - Ausente</option>
                <option value="1">1 - Lento, irregular</option>
                <option value="2">2 - Llanto fuerte</option>
              </select>
            </div>

            <div className="input-group">
              <label>💪 Tono Muscular</label>
              <select name="tono_muscular" value={parametros.tono_muscular} onChange={handleChange}>
                <option value="0">0 - Flácido</option>
                <option value="1">1 - Alguna flexión de extremidades</option>
                <option value="2">2 - Movimiento activo</option>
              </select>
            </div>

            <div className="input-group">
              <label>😵 Reflejos (Irritabilidad)</label>
              <select name="reflejos" value={parametros.reflejos} onChange={handleChange}>
                <option value="0">0 - Sin respuesta</option>
                <option value="1">1 - Muecas</option>
                <option value="2">2 - Llanto, tos o estornudo</option>
              </select>
            </div>

            <div className="input-group">
              <label>🎨 Color de Piel</label>
              <select name="color" value={parametros.color} onChange={handleChange}>
                <option value="0">0 - Azul pálido</option>
                <option value="1">1 - Cuerpo rosado, extremidades azules</option>
                <option value="2">2 - Completamente rosado</option>
              </select>
            </div>
          </div>

          <div style={{ margin: '1rem 0', textAlign: 'center' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>Puntaje: {puntajeTotal} / 10</span>
          </div>

          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar Evaluación'}
          </button>
        </form>

        {resultadoActual && (
          <div className={`result-badge ${getBadgesClass(resultadoActual.puntaje_total)}`}>
            Último resultado: {resultadoActual.puntaje_total} - {resultadoActual.clasificacion}
          </div>
        )}
      </div>

      {/* Columna de Historial */}
      <div className="card history-card">
        <h2>📋 Historial Reciente</h2>
        <div style={{ overflowX: 'auto' }}>
          <table className="history-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Nombre</th>
                <th>Puntaje</th>
                <th>Clasificación</th>
              </tr>
            </thead>
            <tbody>
              {historial.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                    No hay registros aún.
                  </td>
                </tr>
              ) : (
                historial.map((item) => (
                  <tr key={item.id}>
                    <td>{new Date(item.fecha_registro).toLocaleString()}</td>
                    <td><strong>{item.nombre_neonato}</strong></td>
                    <td style={{ fontWeight: 600 }}>{item.puntaje_total}</td>
                    <td>
                      <span className={`result-badge ${getBadgesClass(item.puntaje_total)}`} 
                            style={{ padding: '4px 12px', marginTop: 0, fontSize: '0.75rem', display: 'inline-block' }}>
                        {item.clasificacion}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
