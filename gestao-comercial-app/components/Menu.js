import Link from "next/link";

export default function Menu() {
  return (
    <nav style={{
      padding: 12,
      backgroundColor: "#004080",
      color: "white",
      display: "flex",
      gap: 15,
      justifyContent: "center",
      flexWrap: "wrap"
    }}>
      <Link href="/"><a style={{ color: "white" }}>Início</a></Link>
      <Link href="/clientes"><a style={{ color: "white" }}>Clientes</a></Link>
      <Link href="/produtos"><a style={{ color: "white" }}>Produtos</a></Link>
      <Link href="/vendas"><a style={{ color: "white" }}>Vendas</a></Link>
      <Link href="/contas-a-pagar"><a style={{ color: "white" }}>Contas a Pagar</a></Link>
      <Link href="/contas-a-receber"><a style={{ color: "white" }}>Contas a Receber</a></Link>
      <Link href="/fluxo-caixa"><a style={{ color: "white" }}>Fluxo de Caixa</a></Link>
    </nav>
  );
}
