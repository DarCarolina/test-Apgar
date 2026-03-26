import React, { useState, useEffect } from 'react';
import { Plus, History, Baby, ChevronRight, Activity, Wind, FileText } from 'lucide-react';
import NeonatalForm from './components/NeonatalForm';

function App() {
  const [casos, setCasos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedCaso, setSelectedCaso] = useState(null);

  useEffect(() => {
    fetchCasos();
  }, []);

  const fetchCasos = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/casos/');
      if (response.ok) {
        const data = await response.json();
        setCasos(data);
      }
    } catch (error) {
      console.error('Error al cargar casos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    setShowForm(false);
    fetchCasos();
  };

  return (
    <div className="app-container" style={{ display: 'block' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ marginBottom: '0.2rem' }}>🏥 Expeditente Neonatal</h1>
          <p style={{ color: 'var(--text-muted)' }}>Panel de Control y Evaluación Profesional</p>
        </div>
        {!showForm && (
          <button className="btn" style={{ width: 'auto', padding: '0.75rem 2rem' }} onClick={() => setShowForm(true)}>
            <Plus size={20} style={{ verticalAlign: 'middle', marginRight: '8px' }} /> Nuevo Expediente
          </button>
        )}
      </header>

      {showForm ? (
        <NeonatalForm onSave={handleSave} onCancel={() => setShowForm(false)} />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem' }}>
          {/* Listado de Casos */}
          <section>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <History size={24} className="text-primary" /> Historial de Nacimientos
            </h2>
            {loading && <p>Cargando expedientes...</p>}
            {!loading && casos.length === 0 && (
              <div className="card" style={{ textAlign: 'center', padding: '4rem' }}>
                <Baby size={48} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
                <p style={{ color: 'var(--text-muted)' }}>No hay expedientes registrados aún.</p>
              </div>
            )}
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {casos.map(caso => (
                <div key={caso.id} className="case-card" onClick={() => setSelectedCaso(caso)}>
                  <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                    <h3 style={{ margin: 0 }}>{caso.nombre_neonato}</h3>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {new Date(caso.fecha_nacimiento).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="grid-cols-2">
                    <div style={{ fontSize: '0.85rem' }}>
                      <p><strong>Peso:</strong> {caso.peso_gramos}g</p>
                      <p><strong>Edad Gest.:</strong> {caso.edad_gestacional_semanas}s {caso.edad_gestacional_dias}d</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        {caso.evaluaciones_apgar.length > 0 && (
                          <span className="result-badge badge-bien" style={{ padding: '4px 8px', margin: 0, fontSize: '0.7rem' }}>
                            APGAR 5m: {caso.evaluaciones_apgar.find(a => a.minuto === 5)?.puntaje_total || caso.evaluaciones_apgar[0].puntaje_total}
                          </span>
                        )}
                        {caso.evaluacion_silverman && (
                          <span className="result-badge badge-moderado" style={{ padding: '4px 8px', margin: 0, fontSize: '0.7rem' }}>
                            Silverman: {caso.evaluacion_silverman.puntaje_total}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Panel Detallado */}
          <aside>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={24} className="text-primary" /> Detalle del Paciente
            </h2>
            {selectedCaso ? (
              <div className="card" style={{ background: 'white' }}>
                <div style={{ borderBottom: '1px solid #eee', paddingBottom: '1rem', marginBottom: '1rem' }}>
                  <h3 style={{ marginBottom: '0.2rem' }}>{selectedCaso.nombre_neonato}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>ID Caso: #NEO-{selectedCaso.id}</p>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <section>
                    <label style={{ fontSize: '0.65rem', textTransform: 'uppercase' }}>Signos Vitale (APGAR)</label>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                      {selectedCaso.evaluaciones_apgar.map(a => (
                        <div key={a.id} style={{ textAlign: 'center' }}>
                          <div style={{ fontWeight: 800, fontSize: '1.2rem' }}>{a.puntaje_total}</div>
                          <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>Min {a.minuto}</div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {selectedCaso.evaluacion_silverman && (
                    <section>
                      <label style={{ fontSize: '0.65rem', textTransform: 'uppercase' }}>Dificultad Respiratoria</label>
                      <div style={{ marginTop: '0.5rem', fontWeight: 700, color: selectedCaso.evaluacion_silverman.puntaje_total > 0 ? 'var(--error)' : 'var(--success)' }}>
                         {selectedCaso.evaluacion_silverman.clasificacion} ({selectedCaso.evaluacion_silverman.puntaje_total}/10)
                      </div>
                    </section>
                  )}

                  <section>
                    <label style={{ fontSize: '0.65rem', textTransform: 'uppercase' }}>Análisis de Riesgo</label>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                      {selectedCaso.peso_gramos < 2500 && (
                        <span className="result-badge badge-moderado" style={{ padding: '4px 8px', margin: 0, fontSize: '0.7rem' }}>
                          ⚠️ Bajo Peso
                        </span>
                      )}
                      {selectedCaso.edad_gestacional_semanas < 37 && (
                        <span className="result-badge badge-moderado" style={{ padding: '4px 8px', margin: 0, fontSize: '0.7rem' }}>
                          ⏰ Pretérmino
                        </span>
                      )}
                      {selectedCaso.evaluacion_silverman && selectedCaso.evaluacion_silverman.puntaje_total > 0 && (
                        <span className="result-badge badge-critico" style={{ padding: '4px 8px', margin: 0, fontSize: '0.7rem' }}>
                          🫁 Dificultad Resp.
                        </span>
                      )}
                      {!(selectedCaso.peso_gramos < 2500) && !(selectedCaso.edad_gestacional_semanas < 37) && (!selectedCaso.evaluacion_silverman || selectedCaso.evaluacion_silverman.puntaje_total === 0) && (
                        <span className="result-badge badge-bien" style={{ padding: '4px 8px', margin: 0, fontSize: '0.7rem' }}>
                          ✅ Sin Riesgos Aparentes
                        </span>
                      )}
                    </div>
                  </section>

                  {selectedCaso.notas && (
                    <section>
                      <label style={{ fontSize: '0.65rem', textTransform: 'uppercase' }}>Notas Clínicas</label>
                      <p style={{ fontSize: '0.85rem', marginTop: '0.5rem', fontStyle: 'italic' }}>"{selectedCaso.notas}"</p>
                    </section>
                  )}

                  <div style={{ marginTop: '2rem', padding: '1rem', borderRadius: '12px', background: '#f8fafc', fontSize: '0.8rem' }}>
                    <p style={{ color: '#64748b' }}><strong>Tipo de Parto:</strong> {selectedCaso.tipo_parto}</p>
                    <p style={{ color: '#64748b' }}><strong>Sexo:</strong> {selectedCaso.sexo}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card" style={{ borderStyle: 'dashed', textAlign: 'center', opacity: 0.6 }}>
                <p>Selecciona un expediente para ver los detalles.</p>
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}

export default App;
