import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { app } from "../firebase";

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
          <div className="login-logo">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="48" height="48" rx="12" fill="#4285F4"/>
              <text x="50%" y="55%" textAnchor="middle" fill="#fff" fontSize="22" fontWeight="bold" dy=".3em">CF</text>
            </svg>
          </div>
          <h2>Bem-vindo ao ContaForm</h2>
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
        <style>{`
          .login-bg {
            min-height: 100vh;
            background: linear-gradient(120deg, #4285F4 0%, #6dd5ed 100%);
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .login-container {
            width: 100vw;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .login-card {
            background: #fff;
            border-radius: 16px;
            box-shadow: 0 8px 32px rgba(66,133,244,0.15);
            padding: 40px 32px 32px 32px;
            max-width: 350px;
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            animation: fadeIn 0.7s;
          }
          .login-logo {
            margin-bottom: 16px;
          }
          .login-form {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-bottom: 12px;
          }
          .login-input {
            padding: 10px 14px;
            border: 1px solid #dbeafe;
            border-radius: 8px;
            font-size: 1rem;
            outline: none;
            transition: border 0.2s;
          }
          .login-input:focus {
            border: 1.5px solid #4285F4;
          }
          .login-btn {
            width: 100%;
            padding: 10px 0;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            margin-bottom: 8px;
            cursor: pointer;
            transition: background 0.2s, color 0.2s;
          }
          .login-btn.primary {
            background: #4285F4;
            color: #fff;
          }
          .login-btn.primary:hover {
            background: #3367d6;
          }
          .login-btn.secondary {
            background: #f1f3f4;
            color: #222;
          }
          .login-btn.secondary:hover {
            background: #e0e0e0;
          }
          .login-btn.google {
            background: #fff;
            color: #222;
            border: 1px solid #dbeafe;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
          }
          .login-btn.google:hover {
            background: #f5f5f5;
          }
          .google-icon {
            display: inline-block;
            width: 18px;
            height: 18px;
            background: url('https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg') no-repeat center/contain;
            margin-right: 6px;
          }
          .login-error {
            color: #e74c3c;
            margin-top: 10px;
            font-size: 0.98rem;
            text-align: center;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    </div>
  );
}
