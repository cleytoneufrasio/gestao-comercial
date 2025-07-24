import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    categoria: "",
    preco_custo: "",
    preco_venda: "",
    estoque_atual: "",
    estoque_minimo: "",
  });
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    carregarProdutos();
  }, []);

  async function carregarProdutos() {
    const { data, error } = await supabase.from("produtos").select("*").order("nome");
    if (!error) setProdutos(data);
  }

  async function salvarProduto() {
    if (!form.nome || !form.preco_venda) {
      setMensagem("Nome e preço de venda são obrigatórios.");
      return;
    }

    const { error } = await supabase.from("produtos").insert([{
      ...form,
      preco_custo: parseFloat(form.preco_custo || 0),
      preco_venda: parseFloat(form.preco_venda),
      estoque_atual: parseInt(form.estoque_atual || 0),
      estoque_minimo: parseInt(form.estoque_minimo || 0),
    }]);

    if (error) {
      setMensagem("Erro ao salvar: " + error.message);
    } else {
      setMensagem("Produto salvo com sucesso!");
      setForm({
        nome: "",
        descricao: "",
        categoria: "",
        preco_custo: "",
        preco_venda: "",
        estoque_atual: "",
        estoque_minimo: "",
      });
      carregarProdutos();
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h2>Cadastro de Produtos</h2>

      <input
        type="text"
        placeholder="Nome *"
        value={form.nome}
        onChange={(e) => setForm({ ...form, nome: e.target.value })}
        style={{ width: "100%", marginBottom: 8 }}
      />
      <input
        type="text"
        placeholder="Descrição"
        value={form.descricao}
        onChange={(e) => setForm({ ...form, descricao: e.target.value })}
        style={{ width: "100%", marginBottom: 8 }}
      />
      <input
        type="text"
        placeholder="Categoria"
        value={form.categoria}
        onChange={(e) => setForm({ ...form, categoria: e.target.value })}
        style={{ width: "100%", marginBottom: 8 }}
      />
      <input
        type="number"
        placeholder="Preço de Custo"
        value={form.preco_custo}
        onChange={(e) => setForm({ ...form, preco_custo: e.target.value })}
        style={{ width: "100%", marginBottom: 8 }}
      />
      <input
        type="number"
        placeholder="Preço de Venda *"
        value={form.preco_venda}
        onChange={(e) => setForm({ ...form, preco_venda: e.target.value })}
        style={{ width: "100%", marginBottom: 8 }}
      />
      <input
        type="number"
        placeholder="Estoque Atual"
        value={form.estoque_atual}
        onChange={(e) => setForm({ ...form, estoque_atual: e.target.value })}
        style={{ width: "100%", marginBottom: 8 }}
      />
      <input
        type="number"
        placeholder="Estoque Mínimo"
        value={form.estoque_minimo}
        onChange={(e) => setForm({ ...form, estoque_minimo: e.target.value })}
        style={{ width: "100%", marginBottom: 8 }}
      />

      <button onClick={salvarProduto} style={{ width: "100%" }}>Salvar Produto</button>
      <p style={{ color: mensagem.startsWith("Erro") ? "red" : "green" }}>{mensagem}</p>

      <ul style={{ marginTop: 20 }}>
        {produtos.map((p) => (
          <li key={p.id}>
            {p.nome} - R$ {p.preco_venda.toFixed(2)} | Estoque: {p.estoque_atual}
            {p.estoque_atual <= p.estoque_minimo && (
              <strong style={{ color: "red" }}> (Estoque baixo!)</strong>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
