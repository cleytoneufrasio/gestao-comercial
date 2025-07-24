import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState({ nome: "", email: "", telefone: "", endereco: "" });
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    carregarClientes();
  }, []);

  async function carregarClientes() {
    const { data, error } = await supabase.from("clientes").select("*").order("nome");
    if (!error) setClientes(data);
  }

  async function salvarCliente() {
    if (!form.nome) {
      setMensagem("O nome é obrigatório.");
      return;
    }

    const { error } = await supabase.from("clientes").insert([form]);
    if (error) {
      setMensagem("Erro ao salvar: " + error.message);
    } else {
      setMensagem("Cliente salvo com sucesso!");
      setForm({ nome: "", email: "", telefone: "", endereco: "" });
      carregarClientes();
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h2>Cadastro de Clientes</h2>

      <input
        type="text"
        placeholder="Nome *"
        value={form.nome}
        onChange={(e) => setForm({ ...form, nome: e.target.value })}
        style={{ width: "100%", marginBottom: 8 }}
      />
      <input
        type="email"
        placeholder="E-mail"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        style={{ width: "100%", marginBottom: 8 }}
      />
      <input
        type="text"
        placeholder="Telefone"
        value={form.telefone}
        onChange={(e) => setForm({ ...form, telefone: e.target.value })}
        style={{ width: "100%", marginBottom: 8 }}
      />
      <input
        type="text"
        placeholder="Endereço"
        value={form.endereco}
        onChange={(e) => setForm({ ...form, endereco: e.target.value })}
        style={{ width: "100%", marginBottom: 8 }}
      />

      <button onClick={salvarCliente} style={{ width: "100%" }}>Salvar Cliente</button>
      <p style={{ color: mensagem.startsWith("Erro") ? "red" : "green" }}>{mensagem}</p>

      <ul style={{ marginTop: 20 }}>
        {clientes.map((c) => (
          <li key={c.id}>{c.nome} {c.email && `- ${c.email}`}</li>
        ))}
      </ul>
    </div>
  );
}
