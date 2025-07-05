import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

// Página de edição do sistema: nome, logo, cor, etc. (agora salva no Firestore)
export default function EditarSistema() {
  const [nome, setNome] = useState('ContaForm');
  const [cor, setCor] = useState('#4285F4');
  const [logo, setLogo] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);

  // Carregar config do Firestore ao abrir
  useEffect(() => {
    async function fetchConfig() {
      setLoading(true);
      const ref = doc(db, 'configuracao', 'sistema');
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setNome(data.nome || 'ContaForm');
        setCor(data.cor || '#4285F4');
        setLogo(data.logo || '');
      }
      setLoading(false);
    }
    fetchConfig();
  }, []);

  function handleLogoChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setLogo(ev.target.result);
    };
    reader.readAsDataURL(file);
  }

  async function handleSave(e) {
    e.preventDefault();
    // Salva no Firestore
    await setDoc(doc(db, 'configuracao', 'sistema'), {
      nome,
      cor,
      logo
    });
    setMsg('Configurações salvas!');
    setTimeout(() => setMsg(''), 2000);
    // Também salva no localStorage para refletir no menu/login sem reload
    localStorage.setItem('sistema_nome', nome);
    localStorage.setItem('sistema_cor', cor);
    if (logo) localStorage.setItem('sistema_logo', logo);
  }

  return (
    <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px #4285f41a', padding: 32, maxWidth: 600, margin: '0 auto', marginTop: 32 }}>
      <h2 style={{ marginBottom: 24 }}>Editar Sistema</h2>
      {loading ? <div style={{color:'#888'}}>Carregando...</div> : (
      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <label>
          Nome do sistema:
          <input type="text" value={nome} onChange={e => setNome(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ddd', marginTop: 4 }} />
        </label>
        <label>
          Cor principal:
          <input type="color" value={cor} onChange={e => setCor(e.target.value)} style={{ width: 60, height: 32, border: 'none', marginLeft: 8, verticalAlign: 'middle' }} />
        </label>
        <label>
          Logo (PNG/JPG):
          <input type="file" accept="image/*" onChange={handleLogoChange} style={{ marginTop: 4 }} />
        </label>
        {logo && <img src={logo} alt="Logo" style={{ maxWidth: 120, maxHeight: 120, margin: '12px 0', borderRadius: 8, border: '1px solid #eee' }} />}
        <button type="submit" style={{ background: cor, color: '#fff', border: 'none', borderRadius: 6, padding: '10px 0', fontWeight: 600, fontSize: 16, marginTop: 12, cursor: 'pointer', transition: 'background 0.2s' }}>Salvar</button>
        {msg && <div style={{ color: cor, fontWeight: 500, marginTop: 8 }}>{msg}</div>}
      </form>
      )}
      <div style={{ marginTop: 32, color: '#888', fontSize: 14 }}>
        <b>Dica:</b> As configurações agora são salvas no Firestore (coleção <b>configuracao</b>, doc <b>sistema</b>).
      </div>
    </div>
  );
}
