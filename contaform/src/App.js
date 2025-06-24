import React, { useState } from 'react';
import './App.css';

function getToday() {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

function App() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ material: '', quantidade: '', valor: '', data: getToday() });
  const [editIndex, setEditIndex] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    if (!form.material || !form.quantidade || !form.valor || !form.data) return;
    if (isNaN(form.valor) || form.valor <= 0) return;
    setItems([...items, { ...form }]);
    setForm({ material: '', quantidade: '', valor: '', data: getToday() });
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setForm(items[index]);
  };

  const handleSave = () => {
    if (!form.material || !form.quantidade || !form.valor || !form.data) return;
    if (isNaN(form.valor) || form.valor <= 0) return;
    const updated = [...items];
    updated[editIndex] = { ...form };
    setItems(updated);
    setEditIndex(null);
    setForm({ material: '', quantidade: '', valor: '', data: getToday() });
  };

  const handleDelete = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  // Corrigido: soma apenas os valores, não multiplica pela quantidade
  const total = items.reduce((sum, item) => sum + parseFloat(item.valor), 0);

  return (
    <div className="App">
      <h1>Controle de Gastos - Projeto/Reforma</h1>
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
          value={form.data ? `${form.data.split('-')[2]}/${form.data.split('-')[1]}/${form.data.split('-')[0]}` : ''}
          onChange={e => {
            // Aceita formato dd/mm/aaaa
            const val = e.target.value;
            const match = val.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
            if (match) {
              setForm({ ...form, data: `${match[3]}-${match[2]}-${match[1]}` });
            } else {
              setForm({ ...form, data: '' });
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
                <td>{item.data ? `${item.data.split('-')[2]}/${item.data.split('-')[1]}/${item.data.split('-')[0]}` : ''}</td>
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
