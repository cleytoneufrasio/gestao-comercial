import Link from "next/link";

export default function Home() {
  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h1>Gestão Comercial</h1>
      <nav style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <Link href="/clientes"><a style={{ padding: 10, background: "#0070f3", color: "#fff", borderRadius: 5, textAlign: "center", display: "block" }}>Clientes</a></Link>
        <Link href="/produtos"><a style={{ padding: 10, background: "#0070f3", color: "#fff", borderRadius: 5, textAlign: "center", display: "block" }}>Produtos</a></Link>
        <Link href="/vendas"><a style={{ padding: 10, background: "#0070f3", color: "#fff", borderRadius: 5, textAlign: "center", display: "block" }}>Vendas</a></Link>
        <Link href="/contas-a-pagar"><a style={{ padding: 10, background: "#0070f3", color: "#fff", borderRadius: 5, textAlign: "center", display: "block" }}>Contas a Pagar</a></Link>
        <Link href="/fluxo-caixa"><a style={{ padding: 10, background: "#0070f3", color: "#fff", borderRadius: 5, textAlign: "center", display: "block" }}>Fluxo de Caixa</a></Link>
      </nav>
    </div>
  );
}
