import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Vendas() {
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [clienteId, setClienteId] = useState("");
  const [itens, setItens] = useState([]);
  const [produtoId, setProdutoId] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const [formaPagamento, setFormaPagamento] = useState("avista");
  const [mensagem, setMensagem] = useState("");
  const [vendas, setVendas] = useState([]);

  useEffect(() => {
    carregarClientes();
    carregarProdutos();
    carregarVendas();
  }, []);

  async function carregarClientes() {
    const { data } = await supabase.from("clientes").select("*").order("nome");
    setClientes(data || []);
  }

  async function carregarProdutos() {
    const { data } = await supabase.from("produtos").select("*").order("nome");
    setProdutos(data || []);
  }

  async function carregarVendas() {
    const { data } = await supabase.from("vendas").select("*").order("data", { ascending: false });
    setVendas(data || []);
  }

  function adicionarItem() {
    if (!produtoId || quantidade <= 0) return;
    const produto = produtos.find((p) => p.id === parseInt(produtoId));
    const item = {
      produto_id: produto.id,
      nome: produto.nome,
      preco_unitario: produto.preco_venda,
      quantidade: parseInt(quantidade),
    };
    setItens([...itens, item]);
    setProdutoId("");
    setQuantidade(1);
  }

  async function registrarVenda() {
    if (!clienteId || itens.length === 0) {
      setMensagem("Selecione o cliente e adicione pelo menos um item.");
      return;
    }

    const total = itens.reduce((acc, item) => acc + item.preco_unitario * item.quantidade, 0);
    const { data, error } = await supabase.from("vendas").insert([{
      cliente_id: clienteId,
      data: new Date().toISOString(),
      forma_pagamento: formaPagamento,
      total,
      itens,
    }]);

    if (error) {
      setMensagem("Erro ao registrar venda.");
    } else {
      // Atualiza estoque
      for (const item of itens) {
        await supabase.rpc("atualizar_estoque", {
          produto_id_input: item.produto_id,
          quantidade_input: item.quantidade,
        });
      }

      // Se for a prazo, registrar contas a receber
      if (formaPagamento === "prazo") {
        await supabase.from("contas_a_receber").insert([{
          cliente_id: clienteId,
          data_vencimento: new Date(),
          valor: total,
          pago: false
        }]);
      }

      setMensagem("Venda registrada com sucesso!");
      setItens([]);
      setClienteId("");
      setFormaPagamento("avista");
      carregarVendas();
      carregarProdutos();
    }
  }

  const totalAtual = itens.reduce((acc, item) => acc + item.preco_unitario * item.quantidade, 0);

  const produtosVendidos = vendas.reduce((acc, venda) => {
    venda.itens?.forEach((item) => {
      const nome = item.nome;
      acc[nome] = (acc[nome] || 0) + item.quantidade;
    });
    return acc;
  }, {});

  return (
    <div style={{ maxWidth: 800, margin: "auto", padding: 20 }}>
      <h2>Registrar Venda</h2>

      <select value={clienteId} onChange={(e) => setClienteId(e.target.value)} style={{ width: "100%", marginBottom: 8 }}>
        <option value="">Selecione um cliente</option>
        {clientes.map((c) => (
          <option key={c.id} value={c.id}>{c.nome}</option>
        ))}
      </select>

      <div style={{ display: "flex", gap: 8 }}>
        <select value={produtoId} onChange={(e) => setProdutoId(e.target.value)} style={{ flex: 2 }}>
          <option value="">Produto</option>
          {produtos.map((p) => (
            <option key={p.id} value={p.id}>{p.nome} - R$ {p.preco_venda}</option>
          ))}
        </select>
        <input
          type="number"
          min={1}
          value={quantidade}
          onChange={(e) => setQuantidade(e.target.value)}
          style={{ width: 80 }}
        />
        <button onClick={adicionarItem}>Adicionar</button>
      </div>

      <ul>
        {itens.map((item, idx) => (
          <li key={idx}>
            {item.nome} - {item.quantidade} x R$ {item.preco_unitario.toFixed(2)}
          </li>
        ))}
      </ul>

      <p><strong>Total:</strong> R$ {totalAtual.toFixed(2)}</p>

      <label>Forma de Pagamento:</label>
      <select value={formaPagamento} onChange={(e) => setFormaPagamento(e.target.value)} style={{ width: "100%", marginBottom: 8 }}>
        <option value="avista">À vista</option>
        <option value="prazo">A prazo</option>
        <option value="pix">PIX</option>
        <option value="debito">Débito</option>
        <option value="credito">Crédito</option>
      </select>

      <button onClick={registrarVenda} style={{ width: "100%", marginTop: 10 }}>Salvar Venda</button>
      <p style={{ color: mensagem.startsWith("Erro") ? "red" : "green" }}>{mensagem}</p>

      <h3 style={{ marginTop: 40 }}>📋 Histórico de Vendas</h3>
      <ul>
        {vendas.map((v) => (
          <li key={v.id}>
            {new Date(v.data).toLocaleString()} - R$ {v.total.toFixed(2)} ({v.forma_pagamento})
          </li>
        ))}
      </ul>

      <h3 style={{ marginTop: 40 }}>📊 Produtos Mais Vendidos</h3>
      <ul>
        {Object.entries(produtosVendidos)
          .sort((a, b) => b[1] - a[1])
          .map(([nome, qtd]) => (
            <li key={nome}>
              {nome}: {qtd} unidade{qtd > 1 ? "s" : ""}
            </li>
          ))}
      </ul>
    </div>
  );
}
