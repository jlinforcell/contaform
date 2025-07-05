import React, { useState, useEffect } from 'react';
import './App.css';
import { db } from './firebase';
import { auth } from './firebaseAuth';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';

function getToday() {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

function App() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ material: '', quantidade: '', valor: '', data: getToday() });
  const [editIndex, setEditIndex] = useState(null);
  const [user, setUser] = useState(null);

  // Carregar dados do Firebase ao iniciar
  useEffect(() => {
    const fetchItems = async () => {
      const querySnapshot = await getDocs(collection(db, 'gastos'));
      const gastosData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setItems(gastosData);
    };
    fetchItems();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    if (!form.material || !form.quantidade || !form.valor || !form.data) return;
    if (isNaN(form.valor) || form.valor <= 0) return;
    
    try {
      const docRef = await addDoc(collection(db, 'gastos'), form);
      setItems([...items, { ...form, id: docRef.id }]);
      setForm({ material: '', quantidade: '', valor: '', data: getToday() });
    } catch (error) {
      console.error("Erro ao adicionar item: ", error);
    }
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setForm(items[index]);
  };

  const handleSave = async () => {
    if (!form.material || !form.quantidade || !form.valor || !form.data) return;
    if (isNaN(form.valor) || form.valor <= 0) return;

    try {
      const item = items[editIndex];
      await updateDoc(doc(db, 'gastos', item.id), form);
      
      const updated = [...items];
      updated[editIndex] = { ...form, id: item.id };
      setItems(updated);
      setEditIndex(null);
      setForm({ material: '', quantidade: '', valor: '', data: getToday() });
    } catch (error) {
      console.error("Erro ao atualizar item: ", error);
    }
  };

  const handleDelete = async (index) => {
    try {
      const item = items[index];
      await deleteDoc(doc(db, 'gastos', item.id));
      setItems(items.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Erro ao deletar item: ", error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  // Corrigido: soma apenas os valores, não multiplica pela quantidade
  const total = items.reduce((sum, item) => sum + parseFloat(item.valor), 0);

  return (
    <div className="App">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Controle de Gastos - Projeto/Reforma</h1>
        {user && (
          <button onClick={handleLogout} style={{ padding: 8, background: '#e74c3c', color: '#fff', border: 'none', borderRadius: 4 }}>
            Sair
          </button>
        )}
      </header>
      <div className="form-container modern-form">
        <input name="material" placeholder="Material" value={form.material} onChange={handleChange} />
        <input
          name="quantidade"
          type="text"
          placeholder="Quantidade"
          value={form.quantidade}
          onChange={handleChange}
        />
        <input name="valor" type="number" placeholder="Valor (R$)" value={form.valor} onChange={handleChange} />
        <input
          name="data"
          type="text"
          placeholder="Data (dd/mm/aaaa)"
          value={(() => {
            if (!form.data) return '';
            if (typeof form.data === 'object' && form.data.seconds) {
              const d = new Date(form.data.seconds * 1000);
              return d.toLocaleDateString('pt-BR');
            }
            if (typeof form.data === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(form.data)) {
              const [y, m, d] = form.data.split('-');
              return `${d}/${m}/${y}`;
            }
            if (typeof form.data === 'string') return form.data;
            return '';
          })()}
          onChange={e => {
            // Aceita formato dd/mm/aaaa
            const val = e.target.value;
            const match = val.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
            if (match) {
              setForm({ ...form, data: `${match[3]}-${match[2]}-${match[1]}` });
            } else {
              setForm({ ...form, data: val }); 
            }
          }}
          className="date-input"
        />
        {editIndex === null ? (
          <button className="add-btn" onClick={handleAdd}>Adicionar</button>
        ) : (
          <>
            <button className="save-btn" onClick={handleSave}>Salvar</button>
            <button className="cancel-btn" onClick={() => { setEditIndex(null); setForm({ material: '', quantidade: '', valor: '', data: getToday() }); }}>Cancelar</button>
          </>
        )}
      </div>
      <div className="table-wrapper">
        <table className="gastos-table modern-table">
          <thead>
            <tr>
              <th>Material</th>
              <th>Quantidade</th>
              <th>Data</th>
              <th>Valor (R$)</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={idx}>
                <td>{item.material}</td>
                <td>{item.quantidade}</td>
                <td>{(() => {
                  if (!item.data) return '';
                  if (typeof item.data === 'object' && item.data.seconds) {
                    const d = new Date(item.data.seconds * 1000);
                    return d.toLocaleDateString('pt-BR');
                  }
                  if (typeof item.data === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(item.data)) {
                    const [y, m, d] = item.data.split('-');
                    return `${d}/${m}/${y}`;
                  }
                  if (typeof item.data === 'string') return item.data;
                  return '';
                })()}</td>
                <td>{parseFloat(item.valor).toFixed(2)}</td>
                <td>
                  <button className="edit-btn" title="Editar" onClick={() => {
                    if(window.confirm('Deseja realmente editar este item?')) handleEdit(idx);
                  }}>
                    Editar
                  </button>
                  <button className="delete-btn" title="Excluir" onClick={() => {
                    if(window.confirm('Deseja realmente excluir este item?')) handleDelete(idx);
                  }}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="total-gasto">Total gasto: <strong>R$ {total.toFixed(2)}</strong></div>
    </div>
  );
}

export default App;
