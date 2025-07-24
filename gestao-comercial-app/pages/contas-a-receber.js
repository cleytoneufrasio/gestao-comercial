import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function ContasAReceber() {
  const [contas, setContas] = useState([]);
  const [filtroPago, setFiltroPago] = useState("todos");
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    buscarContas();
  }, [filtroPago]);

  async function buscarContas() {
    let query = supabase.from("contas_a_receber").select(`
      id,
      data_vencimento,
      valor,
      pago,
      cliente:clientes(nome)
    `).order("data_vencimento", { ascending: true });

    if (filtroPago === "sim") {
      query = query.eq("pago", true);
    } else if (filtroPago === "nao") {
      query = query.eq("pago", false);
    }

    const { data, error } = await query;
    if (error) {
      setMensagem("Erro ao buscar contas: " + error.message);
    } else {
      setContas(data || []);
    }
  }

  async function marcarComoPago(id) {
    const { error } = await supabase.from("contas_a_receber").update({ pago: true }).eq("id", id);
    if (!error) buscarContas();
  }

  return (
    <div style={{ maxWidth: 700, margin: "auto", padding: 20 }}>
      <h2>Contas a Receber</h2>

      <div style={{ marginBottom: 16 }}>
        <label>Filtrar por status: </label>
        <select value={filtroPago} onChange={(e) => setFiltroPago(e.target.value)} style={{ marginLeft: 10 }}>
          <option value="todos">Todos</option>
          <option value="nao">Não pagas</option>
          <option value="sim">Pagas</option>
        </select>
      </div>

      {mensagem && <p style={{ color: "red" }}>{mensagem}</p>}

      <ul>
        {contas.map((c) => (
          <li key={c.id} style={{ marginBottom: 10 }}>
            {c.data_vencimento} - {c.cliente?.nome || "Cliente"} | R$ {c.valor.toFixed(2)} -
            {c.pago ? " Pago" : (
              <button onClick={() => marcarComoPago(c.id)} style={{ marginLeft: 10 }}>Marcar como pago</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
