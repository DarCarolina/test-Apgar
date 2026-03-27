import React, { useState, useEffect } from 'react';
import { Baby, Activity, Wind, ClipboardCheck, ChevronRight, ChevronLeft, Plus, Trash2, AlertCircle } from 'lucide-react';
import ApgarChart from './ApgarChart';

const NeonatalForm = ({ onSave, onCancel }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Paso 1: Datos de Nacimiento
  const [birthData, setBirthData] = useState({
    nombre_neonato: '',
    sexo: 'Masculino',
    peso_gramos: '',
    edad_gestacional_semanas: 40,
    edad_gestacional_dias: 0,
    tipo_parto: 'Vaginal',
    notas: ''
  });

  // Paso 2: APGAR Timeline
  const [apgarEvaluations, setApgarEvaluations] = useState([
    { minuto: 1, ritmo_cardiaco: 2, esfuerzo_respiratorio: 2, tono_muscular: 2, reflejos: 2, color: 2 }
  ]);

  // Paso 3: Silverman
  const [silverman, setSilverman] = useState({
    disociacion_toraco_abdominal: 0,
    tiraje_intercostal: 0,
    retraccion_xifoidea: 0,
    aleteo_nasal: 0,
    quejido_espiratorio: 0
  });

  const handleBirthChange = (e) => {
    const { name, value } = e.target;
    setBirthData(prev => ({ ...prev, [name]: value }));
  };

  const handleApgarChange = (index, name, value) => {
    const newEvaluations = [...apgarEvaluations];
    newEvaluations[index][name] = parseInt(value);
    setApgarEvaluations(newEvaluations);
  };

  const handleSilvermanChange = (name, value) => {
    setSilverman(prev => ({ ...prev, [name]: parseInt(value) }));
  };

  const addApgarMinute = () => {
    const lastMin = apgarEvaluations[apgarEvaluations.length - 1].minuto;
    const nextMin = lastMin === 1 ? 5 : lastMin + 5;
    if (nextMin <= 20) {
      setApgarEvaluations([...apgarEvaluations, { 
        minuto: nextMin, 
        ritmo_cardiaco: 2, esfuerzo_respiratorio: 2, tono_muscular: 2, reflejos: 2, color: 2 
      }]);
    }
  };

  const removeApgarMinute = (index) => {
    if (apgarEvaluations.length > 1) {
      setApgarEvaluations(apgarEvaluations.filter((_, i) => i !== index));
    }
  };

  const calculateTotalApgar = (evaluacion) => {
    return evaluacion.ritmo_cardiaco + evaluacion.esfuerzo_respiratorio + 
           evaluacion.tono_muscular + evaluacion.reflejos + evaluacion.color;
  };

  const calculateTotalSilverman = () => {
    return silverman.disociacion_toraco_abdominal + silverman.tiraje_intercostal + 
           silverman.retraccion_xifoidea + silverman.aleteo_nasal + silverman.quejido_espiratorio;
  };

  const getApgarClass = (score) => {
    if (score <= 3) return 'badge-critico';
    if (score <= 6) return 'badge-moderado';
    return 'badge-bien';
  };

  const handleSubmit = async () => {
    if (!birthData.nombre_neonato) {
      alert('El nombre es obligatorio');
      setStep(1);
      return;
    }
    
    setLoading(true);
    const payload = {
      ...birthData,
      peso_gramos: parseInt(birthData.peso_gramos),
      edad_gestacional_semanas: parseInt(birthData.edad_gestacional_semanas),
      edad_gestacional_dias: parseInt(birthData.edad_gestacional_dias),
      evaluaciones_apgar: apgarEvaluations,
      evaluacion_silverman: silverman
    };

    try {
      const response = await fetch('/api/casos/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        onSave();
      } else {
        alert('Error al guardar el caso clínico');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Pre-calcular datos para el gráfico
  const chartData = apgarEvaluations.map(ev => ({
    minuto: ev.minuto,
    puntaje_total: calculateTotalApgar(ev)
  }));

  return (
    <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Stepper Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', padding: '0 1rem' }}>
        {[
          { n: 1, icon: <Baby size={18} />, label: 'Nacimiento' },
          { n: 2, icon: <Activity size={18} />, label: 'APGAR' },
          { n: 3, icon: <Wind size={18} />, label: 'Silverman' },
          { n: 4, icon: <ClipboardCheck size={18} />, label: 'Resumen' }
        ].map((s) => (
          <div key={s.n} style={{ textAlign: 'center', opacity: step >= s.n ? 1 : 0.3, transition: '0.3s' }}>
            <div style={{ 
              width: '40px', height: '40px', borderRadius: '12px', background: step === s.n ? 'var(--primary)' : '#e5e7eb',
              color: step === s.n ? 'white' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 0.5rem'
            }}>
              {s.icon}
            </div>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div style={{ minHeight: '400px', animation: 'slideUp 0.3s ease-out' }}>
        
        {step === 1 && (
          <div>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Baby className="text-primary" /> Datos del Neonato
            </h2>
            <div className="input-group">
              <label>Nombre Completo</label>
              <input name="nombre_neonato" value={birthData.nombre_neonato} onChange={handleBirthChange} placeholder="Nombre del recién nacido..." />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="input-group">
                <label>Sexo</label>
                <select name="sexo" value={birthData.sexo} onChange={handleBirthChange}>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Indeterminado">Indeterminado</option>
                </select>
              </div>
              <div className="input-group">
                <label>Peso (gramos)</label>
                <input type="number" name="peso_gramos" value={birthData.peso_gramos} onChange={handleBirthChange} placeholder="Ej. 3200" />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="input-group">
                <label>Edad Gestacional (Semanas)</label>
                <input type="number" name="edad_gestacional_semanas" value={birthData.edad_gestacional_semanas} onChange={handleBirthChange} min="20" max="45" />
              </div>
              <div className="input-group">
                <label>Días extras (+)</label>
                <input type="number" name="edad_gestacional_dias" value={birthData.edad_gestacional_dias} onChange={handleBirthChange} min="0" max="6" />
              </div>
            </div>
            <div className="input-group">
              <label>Tipo de Parto</label>
              <select name="tipo_parto" value={birthData.tipo_parto} onChange={handleBirthChange}>
                <option value="Vaginal">Vaginal</option>
                <option value="Cesárea">Cesárea</option>
              </select>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Activity className="text-primary" /> Test de APGAR
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Registra las evaluaciones en los diferentes minutos de vida.
            </p>
            
            <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem', marginBottom: '1rem' }}>
              {apgarEvaluations.map((ev, idx) => (
                <div key={idx} className="card" style={{ minWidth: '280px', padding: '1rem', background: 'white', border: '1px solid #eee' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ fontWeight: 800, color: 'var(--primary)' }}>Minuto {ev.minuto}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className={`result-badge ${getApgarClass(calculateTotalApgar(ev))}`} style={{ padding: '4px 10px', fontSize: '0.7rem', margin: 0 }}>
                        Puntaje: {calculateTotalApgar(ev)}
                      </span>
                      {idx > 0 && <button onClick={() => removeApgarMinute(idx)} style={{ border: 'none', background: 'none', color: '#ff4444', cursor: 'pointer' }}><Trash2 size={16} /></button>}
                    </div>
                  </div>
                  
                  <div className="parameter-grid" style={{ gap: '0.5rem' }}>
                    {[
                      { l: '🫀 Ritmo', n: 'ritmo_cardiaco', opts: ['Ausente', '< 100 lpm', '> 100 lpm'] },
                      { l: '🫁 Esfuerzo', n: 'esfuerzo_respiratorio', opts: ['Ausente', 'Lento/Irregul.', 'Llanto fuerte'] },
                      { l: '💪 Tono', n: 'tono_muscular', opts: ['Flácido', 'Alguna flexión', 'Activo'] },
                      { l: '😵 Reflejos', n: 'reflejos', opts: ['Sin resp.', 'Muecas', 'Llanto/Tos'] },
                      { l: '🎨 Color', n: 'color', opts: ['Azul/Pálido', 'Cuerpo rosa', 'Rosa total'] }
                    ].map(p => (
                      <div key={p.n} style={{ display: 'flex', flexDirection: 'column' }}>
                        <label style={{ fontSize: '0.7rem', marginBottom: '2px' }}>{p.l}</label>
                        <select 
                          style={{ padding: '4px 8px', fontSize: '0.8rem' }}
                          value={ev[p.n]} 
                          onChange={(e) => handleApgarChange(idx, p.n, e.target.value)}
                        >
                          {p.opts.map((o, i) => <option key={i} value={i}>{i} - {o}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {apgarEvaluations.length < 4 && (
                <button 
                  onClick={addApgarMinute}
                  style={{ minWidth: '150px', border: '2px dashed #cbd5e1', borderRadius: '16px', background: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#94a3b8' }}
                >
                  <Plus size={32} />
                  <span>Añadir Minuto</span>
                </button>
              )}
            </div>
            
            <div className="card" style={{ background: 'rgba(99, 102, 241, 0.05)', border: 'none' }}>
              <h3 style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Evolución del APGAR</h3>
              <ApgarChart data={chartData} />
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Wind className="text-primary" /> Test de Silverman-Anderson
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Evalúa el distrés respiratorio (0 es ideal, 10 es severo).
            </p>
            <div className="parameter-grid">
              {[
                { l: 'Disociación toraco-abdominal', n: 'disociacion_toraco_abdominal', opts: ['Sincronizado', 'Retraso inspiratorio', 'Bamboleo'] },
                { l: 'Tiraje intercostal', n: 'tiraje_intercostal', opts: ['Ausente', 'Leve', 'Marcado'] },
                { l: 'Retracción xifoidea', n: 'retraccion_xifoidea', opts: ['Ausente', 'Leve', 'Marcada'] },
                { l: 'Aleteo nasal', n: 'aleteo_nasal', opts: ['Ausente', 'Leve', 'Marcado'] },
                { l: 'Quejido espiratorio', n: 'quejido_espiratorio', opts: ['Ausente', 'Audible con estetos.', 'Audible a distancia'] }
              ].map(p => (
                <div key={p.n} className="input-group">
                  <label>{p.l}</label>
                  <select value={silverman[p.n]} onChange={(e) => handleSilvermanChange(p.n, e.target.value)}>
                    {p.opts.map((o, i) => <option key={i} value={i}>{i} - {o}</option>)}
                  </select>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', borderRadius: '16px', background: calculateTotalSilverman() === 0 ? '#d1fae5' : '#fee2e2' }}>
              <span style={{ fontWeight: 800 }}>Puntaje Silverman: {calculateTotalSilverman()} / 10</span>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ClipboardCheck className="text-primary" /> Resumen y Análisis Clínico
            </h2>
            <div className="card" style={{ background: 'white', border: '1px solid #eee', marginBottom: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                <div><label>Nombre</label><strong>{birthData.nombre_neonato}</strong></div>
                <div><label>Sexo</label><strong>{birthData.sexo}</strong></div>
                <div><label>Peso</label><strong>{birthData.peso_gramos}g</strong></div>
                <div><label>Edad Gest.</label><strong>{birthData.edad_gestacional_semanas}w {birthData.edad_gestacional_dias}d</strong></div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {/* Análisis de Riesgo */}
                {parseInt(birthData.peso_gramos) < 2500 && (
                  <div style={{ background: '#fff7ed', border: '1px solid #fdba74', padding: '0.5rem 1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                    <AlertCircle size={16} color="#c2410c" />
                    <span style={{ color: '#c2410c', fontWeight: 600 }}>Bajo Peso al Nacer</span>
                  </div>
                )}
                {birthData.edad_gestacional_semanas < 37 && (
                  <div style={{ background: '#f0f9ff', border: '1px solid #7dd3fc', padding: '0.5rem 1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                    <AlertCircle size={16} color="#0369a1" />
                    <span style={{ color: '#0369a1', fontWeight: 600 }}>Recién Nacido Pretérmino</span>
                  </div>
                )}
                {calculateTotalSilverman() > 0 && (
                  <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', padding: '0.5rem 1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                    <AlertCircle size={16} color="#b91c1c" />
                    <span style={{ color: '#b91c1c', fontWeight: 600 }}>Dificultad Respiratoria</span>
                  </div>
                )}
              </div>
            </div>

            <div className="input-group">
                <label>Notas Clínicas Adicionales</label>
                <textarea 
                    style={{ width: '100%', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '1rem', fontFamily: 'inherit' }}
                    rows="3"
                    name="notas"
                    value={birthData.notas}
                    onChange={handleBirthChange}
                    placeholder="Escribe observaciones relevantes..."
                ></textarea>
            </div>
          </div>
        )}

      </div>

      {/* Navigation Buttons */}
      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
        {step > 1 ? (
          <button className="btn" style={{ background: '#e5e7eb', color: 'var(--text-main)' }} onClick={() => setStep(step - 1)}>
            <ChevronLeft size={20} style={{ verticalAlign: 'middle', marginRight: '5px' }} /> Anterior
          </button>
        ) : (
          <button className="btn" style={{ background: '#fef2f2', color: '#ef4444' }} onClick={onCancel}>
            Cancelar
          </button>
        )}

        {step < 4 ? (
          <button className="btn" onClick={() => setStep(step + 1)}>
            Siguiente <ChevronRight size={20} style={{ verticalAlign: 'middle', marginLeft: '5px' }} />
          </button>
        ) : (
          <button className="btn" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Guardando Expediente...' : 'Finalizar y Guardar'}
          </button>
        )}
      </div>
    </div>
  );
};

export default NeonatalForm;
