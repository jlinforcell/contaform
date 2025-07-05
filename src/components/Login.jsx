
import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { app } from "../firebase";
import "./Login.css";

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // Customização do nome e logo
  const nome = localStorage.getItem('sistema_nome') || 'ContaForm';
  const logo = localStorage.getItem('sistema_logo') || '';

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      setError("Usuário ou senha inválidos.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      setError("Erro ao criar conta. Verifique os dados.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    setLoading(true);
    try {
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (err) {
      setError("Erro ao autenticar com Google.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-bg">
      <div className="login-container">
        <div className="login-card">
          <div className="login-logo" style={{marginBottom: 10}}>
            {logo ? (
              <img src={logo} alt="Logo" style={{height:48,marginRight:10,borderRadius:8}} />
            ) : (
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="48" height="48" rx="12" fill="#4285F4"/>
                <text x="50%" y="55%" textAnchor="middle" fill="#fff" fontSize="22" fontWeight="bold" dy=".3em">CF</text>
              </svg>
            )}
          </div>
          <h2 style={{margin:0, marginBottom: 12}}>{nome}</h2>
          <form onSubmit={handleLogin} className="login-form">
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="username"
              className="login-input"
              disabled={loading}
            />
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="login-input"
              disabled={loading}
            />
            <button type="submit" className="login-btn primary" disabled={loading}>{loading ? "Entrando..." : "Entrar"}</button>
          </form>
          <button onClick={handleRegister} className="login-btn secondary" disabled={loading}>Criar conta</button>
          <button onClick={handleGoogle} className="login-btn google" disabled={loading}>
            <span className="google-icon" /> Entrar com Google
          </button>
          {error && <div className="login-error">{error}</div>}
        </div>
        {/* Estilo agora está em Login.css */}
      </div>
    </div>
  );
}
