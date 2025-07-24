import Link from "next/link";

export default function Home() {
  const linkStyle = {
    padding: 10,
    background: "#0070f3",
    color: "#fff",
    borderRadius: 5,
    textAlign: "center",
    textDecoration: "none",
    display: "block",
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h1>Gestão Comercial</h1>
      <nav style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <Link href="/clientes" legacyBehavior><a style={linkStyle}>Clientes</a></Link>
        <Link href="/produtos" legacyBehavior><a style={linkStyle}>Produtos</a></Link>
        <Link href="/vendas" legacyBehavior><a style={linkStyle}>Vendas</a></Link>
        <Link href="/contas-a-pagar" legacyBehavior><a style={linkStyle}>Contas a Pagar</a></Link>
        <Link href="/fluxo-caixa" legacyBehavior><a style={linkStyle}>Fluxo de Caixa</a></Link>
      </nav>
    </div>
  );
}
