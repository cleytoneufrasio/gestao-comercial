import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

export default function FluxoCaixa() {
  const [receitas, setReceitas] = useState([]);
  const [despesas, setDespesas] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    buscarDados();
  }, []);

  async function buscarDados() {
    try {
      setLoading(true);
      const { data: receitasData, error: errorReceitas } = await supabase.from("receitas").select("*");
      const { data: despesasData, error: errorDespesas } = await supabase.from("contas_a_pagar").select("*");

      if (errorReceitas) throw errorReceitas;
      if (errorDespesas) throw errorDespesas;

      setReceitas(receitasData || []);
      setDespesas(despesasData || []);
      setMensagem("");
    } catch (e) {
      setMensagem("Erro ao carregar dados: " + e.message);
    } finally {
      setLoading(false);
    }
  }

  function agruparPorMes(dados) {
    const mapa = {};
    dados.forEach((item) => {
      const dataStr = item.data || item.data_vencimento;
      if (!dataStr) return;

      const data = new Date(dataStr);
      if (isNaN(data)) return;

      const mes = `${data.getFullYear()}-${(data.getMonth() + 1).toString().padStart(2, "0")}`;
      const valorNum = parseFloat(item.valor);
      if (isNaN(valorNum)) return;

      mapa[mes] = (mapa[mes] || 0) + valorNum;
    });
    return mapa;
  }

  const receitasMensais = agruparPorMes(receitas);
  const despesasMensais = agruparPorMes(despesas);

  const meses = Array.from(new Set([...Object.keys(receitasMensais), ...Object.keys(despesasMensais)])).sort();

  const barData = {
    labels: meses,
    datasets: [
      {
        label: "Receitas",
        data: meses.map((m) => receitasMensais[m] || 0),
        backgroundColor: "rgba(54, 162, 235, 0.7)",
      },
      {
        label: "Despesas",
        data: meses.map((m) => despesasMensais[m] || 0),
        backgroundColor: "rgba(255, 99, 132, 0.7)",
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Receitas x Despesas por Mês" },
    },
  };

  const totalReceitas = receitas.reduce((acc, r) => {
    const val = parseFloat(r.valor);
    return acc + (isNaN(val) ? 0 : val);
  }, 0);
  const totalDespesas = despesas.reduce((acc, d) => {
    const val = parseFloat(d.valor);
    return acc + (isNaN(val) ? 0 : val);
  }, 0);
  const saldoAtual = totalReceitas - totalDespesas;

  const agruparPorCategoria = (dados) => {
    return dados.reduce((acc, item) => {
      const cat = item.categoria || "Outros";
      const val = parseFloat(item.valor);
      if (isNaN(val)) return acc;
      acc[cat] = (acc[cat] || 0) + val;
      return acc;
    }, {});
  };

  const receitasPorCategoria = agruparPorCategoria(receitas);
  const despesasPorCategoria = agruparPorCategoria(despesas);

  // Função para gerar cores dinâmicas se categorias > 4
  const gerarCores = (qtd) => {
    const cores = [
      "#4caf50", "#2196f3", "#ff9800", "#9c27b0",
      "#f44336", "#3f51b5", "#ff5722", "#009688",
      "#795548", "#607d8b"
    ];
    return Array.from({ length: qtd }, (_, i) => cores[i % cores.length]);
  };

  const pieReceitasData = {
    labels: Object.keys(receitasPorCategoria),
    datasets: [
      {
        data: Object.values(receitasPorCategoria),
        backgroundColor: gerarCores(Object.keys(receitasPorCategoria).length),
      },
    ],
  };

  const pieDespesasData = {
    labels: Object.keys(despesasPorCategoria),
    datasets: [
      {
        data: Object.values(despesasPorCategoria),
        backgroundColor: gerarCores(Object.keys(despesasPorCategoria).length),
      },
    ],
  };

  return (
    <div style={{ maxWidth: 900, margin: "auto", padding: 20 }}>
      <h2>Fluxo de Caixa</h2>
      {mensagem && <p style={{ color: "red" }}>{mensagem}</p>}
      {loading ? (
        <p>Carregando dados...</p>
      ) : (
        <>
          <p>
            <strong>Saldo atual:</strong> R$ {saldoAtual.toFixed(2)}
          </p>

          <div style={{ height: 350 }}>
            <Bar data={barData} options={barOptions} />
          </div>

          <div style={{ display: "flex", justifyContent: "space-around", marginTop: 40 }}>
            <div style={{ width: 300 }}>
              <h4>Receitas por Categoria</h4>
              <Pie data={pieReceitasData} />
            </div>
            <div style={{ width: 300 }}>
              <h4>Despesas por Categoria</h4>
              <Pie data={pieDespesasData} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
