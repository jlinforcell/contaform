

import React, { useEffect, useState, useRef } from "react";
import "./Dashboard.css";
import { db } from "./firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";
import { Chart, registerables } from "chart.js";
import { useNavigate } from "react-router-dom";
Chart.register(...registerables);

export default function Dashboard() {
  const [sistema, setSistema] = useState({ nome: "ContaForm", corPrincipal: "#4285F4" });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [total, setTotal] = useState(0);
  const [porData, setPorData] = useState([]);
  const [porMaterial, setPorMaterial] = useState([]);
  const [maiorGasto, setMaiorGasto] = useState(0);
  const [gastoMedio, setGastoMedio] = useState(0);
  const chartRef = useRef(null);
  const pieRef = useRef(null);
  const chartInstance = useRef(null);
  const pieInstance = useRef(null);

  useEffect(() => {
    // Verifica autenticação
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (!user) {
        navigate("/login");
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    // Busca configurações do sistema
    async function fetchConfig() {
      try {
        const docRef = doc(db, "configuracao", "sistema");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSistema(docSnap.data());
        }
      } catch (e) {
        // fallback para padrão
      }
    }
    fetchConfig();
    async function fetchData() {
      const querySnapshot = await getDocs(collection(db, "gastos"));
      let soma = 0;
      const porDataTemp = {};
      const porMaterialTemp = {};
      let maior = 0;
      let valores = [];
      querySnapshot.forEach(doc => {
        const d = doc.data();
        const valor = parseFloat(d.valor) || 0;
        soma += valor;
        valores.push(valor);
        if (valor > maior) maior = valor;
        let dataStr = d.data;
        if (typeof dataStr === 'object' && dataStr.seconds) {
          const dt = new Date(dataStr.seconds * 1000);
          dataStr = dt.toLocaleDateString('pt-BR');
        }
        if (typeof dataStr === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dataStr)) {
          const [y, m, d2] = dataStr.split('-');
          dataStr = `${d2}/${m}/${y}`;
        }
        porDataTemp[dataStr] = (porDataTemp[dataStr] || 0) + valor;
        if (d.material) porMaterialTemp[d.material] = (porMaterialTemp[d.material] || 0) + valor;
      });
      setTotal(soma);
      setPorData(Object.entries(porDataTemp));
      setPorMaterial(Object.entries(porMaterialTemp));
      setMaiorGasto(maior);
      setGastoMedio(valores.length ? soma / valores.length : 0);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (!chartRef.current) return;
    if (chartInstance.current) chartInstance.current.destroy();
    if (porData.length === 0) return;
    const ctx = chartRef.current.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 220);
    gradient.addColorStop(0, 'rgba(66,133,244,0.25)');
    gradient.addColorStop(1, 'rgba(255,255,255,0.05)');
    chartInstance.current = new Chart(chartRef.current, {
      type: "line",
      data: {
        labels: porData.map(([data]) => data),
        datasets: [
          {
            label: "Gastos por Data",
            data: porData.map(([_, valor]) => valor),
            backgroundColor: gradient,
            borderColor: "#4285F4",
            borderWidth: 3,
            tension: 0.4,
            pointRadius: 5,
            pointBackgroundColor: "#4285F4",
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#222',
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: '#4285F4',
            borderWidth: 1,
            padding: 12,
            caretSize: 8,
            callbacks: {
              label: ctx => ` R$ ${ctx.parsed.y.toFixed(2)}`
            }
          }
        },
        animation: { duration: 900, easing: 'easeOutQuart' },
        scales: {
          x: { title: { display: true, text: "Data" } },
          y: { title: { display: true, text: "Valor (R$)" } },
        },
      },
    });
  }, [porData]);

  useEffect(() => {
    if (!pieRef.current) return;
    if (pieInstance.current) pieInstance.current.destroy();
    if (porMaterial.length === 0) return;
    pieInstance.current = new Chart(pieRef.current, {
      type: "doughnut",
      data: {
        labels: porMaterial.map(([mat]) => mat),
        datasets: [
          {
            label: "Gasto por Material",
            data: porMaterial.map(([_, valor]) => valor),
            backgroundColor: [
              "#4285F4", "#34A853", "#FBBC05", "#EA4335", "#A142F4", "#00B8D9", "#FF7043", "#F4B400"
            ],
            borderWidth: 2,
            borderColor: "#fff",
          },
        ],
      },
      options: {
        cutout: '70%',
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: { color: '#222', font: { size: 14 } }
          },
          tooltip: {
            backgroundColor: '#222',
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: '#34A853',
            borderWidth: 1,
            padding: 12,
            caretSize: 8,
            callbacks: {
              label: ctx => ` ${ctx.label}: R$ ${ctx.parsed.toFixed(2)}`
            }
          }
        },
        animation: { duration: 900, easing: 'easeOutQuart' },
      },
    });
  }, [porMaterial]);

  // Função de logout
  function handleLogout() {
    const auth = getAuth();
    signOut(auth).then(() => {
      navigate("/login");
    });
  }

  if (loading) return null;
  return (
    <div className="dashboard-page" style={{ '--cor-principal': sistema.corPrincipal }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="dashboard-title" style={{ color: sistema.corPrincipal }}>{sistema.nome || 'Resumo Geral'}</h2>
        <button onClick={handleLogout} style={{ background: sistema.corPrincipal, color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600, cursor: 'pointer' }}>Sair</button>
      </div>
      <div className="dashboard-cards">
        <div className="dashboard-card animate-fadein">
          <span className="dashboard-label">Total gasto</span>
          <span className="dashboard-value">R$ {total.toFixed(2)}</span>
        </div>
        <div className="dashboard-card animate-fadein" style={{animationDelay:'0.1s'}}>
          <span className="dashboard-label">Maior gasto</span>
          <span className="dashboard-value">R$ {maiorGasto.toFixed(2)}</span>
        </div>
        <div className="dashboard-card animate-fadein" style={{animationDelay:'0.2s'}}>
          <span className="dashboard-label">Gasto médio</span>
          <span className="dashboard-value">R$ {gastoMedio.toFixed(2)}</span>
        </div>
        <div className="dashboard-card animate-fadein" style={{animationDelay:'0.3s'}}>
          <span className="dashboard-label">Dias registrados</span>
          <span className="dashboard-value">{porData.length}</span>
        </div>
        <div className="dashboard-card animate-fadein" style={{animationDelay:'0.4s'}}>
          <span className="dashboard-label">Materiais diferentes</span>
          <span className="dashboard-value">{porMaterial.length}</span>
        </div>
      </div>
      <div className="dashboard-charts">
        <div className="dashboard-chart-block animate-fadein" style={{animationDelay:'0.5s'}}>
          <h3>Gastos por Data</h3>
          <canvas ref={chartRef} height={220} />
        </div>
        <div className="dashboard-chart-block animate-fadein" style={{animationDelay:'0.6s'}}>
          <h3>Gasto por Material</h3>
          <canvas ref={pieRef} height={220} />
        </div>
      </div>
    </div>
  );
}