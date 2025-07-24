import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function ContasAPagar() {
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("");
  const [dataVencimento, setDataVencimento] = useState("");
  const [valor, setValor] = useState("");
  const [filtroPago, setFiltroPago] = useState("todos");
  const [contas, setContas] = useState([]);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    buscarContas();
  }, [filtroPago]);

  async function buscarContas() {
    let query = supabase.from("contas_a_pagar").select("*").order("data_vencimento", { ascending: true });

    if (filtroPago === "sim") {
      query = query.eq("pago", true);
    } else if (filtroPago === "nao") {
      query = query.eq("pago", false);
    }

    const { data, error } = await query;

    if (error) {
      setMensagem("Erro ao buscar contas: " + error.message);
    } else {
      setContas(data);
    }
  }

  async function cadastrarConta() {
    if (!descricao || !categoria || !dataVencimento || !valor) {
      setMensagem("Preencha todos os campos.");
      return;
    }

    const { error } = await supabase.from("contas_a_pagar").insert([{
      descricao,
      categoria,
      data_vencimento: dataVencimento,
      valor: parseFloat(valor),
      pago: false
    }]);

    if (error) {
      setMensagem("Erro ao salvar: " + error.message);
    } else {
      setMensagem("Conta registrada!");
      setDescricao("");
      setCategoria("");
      setDataVencimento("");
      setValor("");
      buscarContas();
    }
  }

  async function marcarComoPago(id) {
    const { error } = await supabase.from("contas_a_pagar").update({ pago: true }).eq("id", id);
    if (!error) buscarContas();
  }

  return (
    <div style={{ maxWidth: 700, margin: "auto", padding: 20 }}>
      <h2>Contas a Pagar</h2>

      <input type="text" placeholder="Descrição *" value={descricao} onChange={(e) => setDescricao(e.target.value)} style={{ width: "100%", marginBottom: 8 }} />
      <input type="text" placeholder="Categoria *" value={categoria} onChange={(e) => setCategoria(e.target.value)} style={{ width: "100%", marginBottom: 8 }} />
      <input type="date" value={dataVencimento} onChange={(e) => setDataVencimento(e.target.value)} style={{ width: "100%", marginBottom: 8 }} />
      <input type="number" placeholder="Valor *" value={valor} onChange={(e) => setValor(e.target.value)} style={{ width: "100%", marginBottom: 8 }} />

      <button onClick={cadastrarConta} style={{ width: "100%", marginBottom: 10 }}>Salvar Conta</button>

      <p style={{ color: mensagem.startsWith("Erro") ? "red" : "green" }}>{mensagem}</p>

      <div style={{ marginTop: 20 }}>
        <label>Filtrar por status: </label>
        <select value={filtroPago} onChange={(e) => setFiltroPago(e.target.value)} style={{ marginLeft: 10 }}>
          <option value="todos">Todos</option>
          <option value="nao">Não pagas</option>
          <option value="sim">Pagas</option>
        </select>
      </div>

      <ul style={{ marginTop: 20 }}>
        {contas.map((c) => (
          <li key={c.id} style={{ marginBottom: 10 }}>
            {c.data_vencimento} - {c.descricao} | R$ {c.valor.toFixed(2)} | {c.categoria} -
            {c.pago ? " Pago" : (
              <button onClick={() => marcarComoPago(c.id)} style={{ marginLeft: 10 }}>Marcar como pago</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
