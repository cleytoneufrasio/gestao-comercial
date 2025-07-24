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

  useEffect(() => {
    buscarDados();
  }, []);

  async function buscarDados() {
    try {
      const { data: receitasData } = await supabase.from("receitas").select("*");
      const { data: despesasData } = await supabase.from("contas_a_pagar").select("*");
      setReceitas(receitasData || []);
      setDespesas(despesasData || []);
    } catch (e) {
      setMensagem("Erro ao carregar dados.");
    }
  }

  function agruparPorMes(dados, tipo) {
    const mapa = {};
    dados.forEach((item) => {
      const data = new Date(item.data || item.data_vencimento);
      const mes = `${data.getFullYear()}-${(data.getMonth() + 1).toString().padStart(2, "0")}`;
      mapa[mes] = (mapa[mes] || 0) + parseFloat(item.valor);
    });
    return mapa;
  }

  const receitasMensais = agruparPorMes(receitas, "receita");
  const despesasMensais = agruparPorMes(despesas, "despesa");

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

  const totalReceitas = receitas.reduce((acc, r) => acc + parseFloat(r.valor), 0);
  const totalDespesas = despesas.reduce((acc, d) => acc + parseFloat(d.valor), 0);
  const saldoAtual = totalReceitas - totalDespesas;

  const agruparPorCategoria = (dados) => {
    return dados.reduce((acc, item) => {
      const cat = item.categoria || "Outros";
      acc[cat] = (acc[cat] || 0) + parseFloat(item.valor);
      return acc;
    }, {});
  };

  const receitasPorCategoria = agruparPorCategoria(receitas);
  const despesasPorCategoria = agruparPorCategoria(despesas);

  const pieReceitasData = {
    labels: Object.keys(receitasPorCategoria),
    datasets: [
      {
        data: Object.values(receitasPorCategoria),
        backgroundColor: ["#4caf50", "#2196f3", "#ff9800", "#9c27b0"],
      },
    ],
  };

  const pieDespesasData = {
    labels: Object.keys(despesasPorCategoria),
    datasets: [
      {
        data: Object.values(despesasPorCategoria),
        backgroundColor: ["#f44336", "#3f51b5", "#ff5722", "#009688"],
      },
    ],
  };

  return (
    <div style={{ maxWidth: 900, margin: "auto", padding: 20 }}>
      <h2>Fluxo de Caixa</h2>
      {mensagem && <p style={{ color: "red" }}>{mensagem}</p>}
      <p><strong>Saldo atual:</strong> R$ {saldoAtual.toFixed(2)}</p>

      <div>
        <h3>Receitas x Despesas por Mês</h3>
        <Bar data={barData} />
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
    </div>
  );
}
