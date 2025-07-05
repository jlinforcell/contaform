import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import "./MainLayout.css";

export default function MainLayout() {
  const [nome, setNome] = useState('ContaForm');
  const [logo, setLogo] = useState('');
  useEffect(() => {
    setNome(localStorage.getItem('sistema_nome') || 'ContaForm');
    setLogo(localStorage.getItem('sistema_logo') || '');
    const onStorage = () => {
      setNome(localStorage.getItem('sistema_nome') || 'ContaForm');
      setLogo(localStorage.getItem('sistema_logo') || '');
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);
  return (
    <div className="main-layout">
      <nav className="main-nav">
        <div className="main-logo">
          {logo ? <img src={logo} alt="Logo" style={{height:32, marginRight:10, verticalAlign:'middle', borderRadius:6}} /> : null}
          {nome}
        </div>
        <input type="checkbox" id="menu-toggle" className="menu-toggle" />
        <label htmlFor="menu-toggle" className="menu-icon">
          <span></span>
          <span></span>
          <span></span>
        </label>
        <ul className="main-menu">
          <li><Link to="/">Dashboard</Link></li>
          <li><Link to="/editar">Editar Sistema</Link></li>
          <li><Link to="/gastos">Gastos</Link></li>
        </ul>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
