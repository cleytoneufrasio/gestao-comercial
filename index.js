import Link from "next/link";

export default function Home() {
  const linkStyle = {
    padding: 10,
    background: "#0070f3",
    color: "#fff",
    borderRadius: 5,
    textAlign: "center",
    textDecoration: "none",
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h1>Gestão Comercial</h1>
      <nav style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <Link href="/clientes" style={linkStyle}>Clientes</Link>
        <Link href="/produtos" style={linkStyle}>Produtos</Link>
        <Link href="/vendas" style={linkStyle}>Vendas</Link>
        <Link href="/contas-a-pagar" style={linkStyle}>Contas a Pagar</Link>
        <Link href="/fluxo-caixa" style={linkStyle}>Fluxo de Caixa</Link>
      </nav>
    </div>
  );
}
