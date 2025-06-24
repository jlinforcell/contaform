import React, { useState } from 'react';
import './App.css';

function App() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ material: '', quantidade: '', valor: '', data: '' });
  const [editIndex, setEditIndex] = useState(null);
  
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    if (!form.material || !form.quantidade || !form.valor || !form.data) return;
    if (isNaN(form.quantidade) || isNaN(form.valor) || form.quantidade <= 0 || form.valor <= 0) return;
    setItems([...items, { ...form }]);
    setForm({ material: '', quantidade: '', valor: '', data: '' });
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setForm(items[index]);
  };

  const handleSave = () => {
    if (!form.material || !form.quantidade || !form.valor || !form.data) return;
    if (isNaN(form.quantidade) || isNaN(form.valor) || form.quantidade <= 0 || form.valor <= 0) return;
    const updated = [...items];
    updated[editIndex] = { ...form };
    setItems(updated);
    setEditIndex(null);
    setForm({ material: '', quantidade: '', valor: '', data: '' });
  };

  const handleDelete = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const total = items.reduce((sum, item) => sum + parseFloat(item.valor) * parseFloat(item.quantidade), 0);

  return (
    <div className="App">
      <h1>Controle de Gastos - Projeto/Reforma</h1>
      <div className="form-container">
        <input name="material" placeholder="Material" value={form.material} onChange={handleChange} />
        <input name="quantidade" type="number" placeholder="Quantidade" value={form.quantidade} onChange={handleChange} />
        <input name="valor" type="number" placeholder="Valor (R$)" value={form.valor} onChange={handleChange} />
        <input name="data" type="date" value={form.data} onChange={handleChange} />
        {editIndex === null ? (
          <button className="add-btn" onClick={handleAdd}>Adicionar</button>
        ) : (
          <>
            <button className="save-btn" onClick={handleSave}>Salvar</button>
            <button className="cancel-btn" onClick={() => { setEditIndex(null); setForm({ material: '', quantidade: '', valor: '', data: '' }); }}>Cancelar</button>
          </>
        )}
      </div>
      <table className="gastos-table">
        <thead>
          <tr>
            <th>Material</th>
            <th>Quantidade</th>
            <th>Valor (R$)</th>
            <th>Data</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={idx}>
              <td>{item.material}</td>
              <td>{item.quantidade}</td>
              <td>{parseFloat(item.valor).toFixed(2)}</td>
              <td>{item.data}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(idx)}>Editar</button>
                <button className="delete-btn" onClick={() => handleDelete(idx)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="total-gasto">Total gasto: <strong>R$ {total.toFixed(2)}</strong></div>
    </div>
  );
}

export default App;
