import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabaseClient";

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [userLogado, setUserLogado] = useState(null);
  const router = useRouter();

  useEffect(() => {
    verificarPermissao();
  }, []);

  async function verificarPermissao() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    const { data, error } = await supabase
      .from("usuarios")
      .select("id, email, perfil")
      .eq("id", user.id)
      .single();

    if (error || data.perfil !== "admin") {
      alert("Acesso negado!");
      router.push("/");
    } else {
      setUserLogado(data);
      carregarUsuarios();
    }
  }

  async function carregarUsuarios() {
    const { data, error } = await supabase
      .from("usuarios")
      .select("id, email, perfil")
      .order("email");

    if (!error) setUsuarios(data);
  }

  async function alterarPerfil(id, novoPerfil) {
    const { error } = await supabase
      .from("usuarios")
      .update({ perfil: novoPerfil })
      .eq("id", id);

    if (!error) carregarUsuarios();
  }

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h2>Painel de Administração de Usuários</h2>
      <ul>
        {usuarios.map((u) => (
          <li key={u.id} style={{ marginBottom: 10 }}>
            <strong>{u.email}</strong> — Perfil: <em>{u.perfil}</em>
            {u.id !== userLogado?.id && (
              <>
                {" "}
                |{" "}
                <button
                  onClick={() =>
                    alterarPerfil(u.id, u.perfil === "admin" ? "vendedor" : "admin")
                  }
                >
                  Tornar {u.perfil === "admin" ? "Vendedor" : "Admin"}
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}