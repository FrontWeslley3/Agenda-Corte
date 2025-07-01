const tabela = document.getElementById("tabela-agendamentos");

async function carregarAgendamentos() {
  const res = await fetch("http://localhost:8000/agendamentos");
  const dados = await res.json();
  const filtro = document.getElementById("filtro-status").value;

  tabela.innerHTML = "";

  let filtrados = dados;

  // ✅ Aplica o filtro, se não for "todos"
  if (filtro !== "todos") {
    filtrados = dados.filter((ag) => ag.status === filtro);
  }

  if (filtrados.length === 0) {
    mostrarToast("Nenhum agendamento encontrado para esse filtro.", "aviso");
    return;
  }

  filtrados.forEach((ag) => {
    const linha = document.createElement("tr");

    linha.innerHTML = `
      <td>${ag.nome}</td>
      <td>${ag.telefone}</td>
      <td>${ag.data_hora}</td>
      <td>${ag.corte}</td>
      <td><span class="status ${ag.status}">${ag.status}</span></td>
      <td>
        ${
          ag.status === "pendente"
            ? `
              <button class="btn-concluir" onclick="atualizarStatus('${ag._id}', 'concluido')">Concluir</button>
              <button class="btn-cancelar" onclick="atualizarStatus('${ag._id}', 'cancelado')">Cancelar</button>
            `
            : `
              <button class="btn-excluir" onclick="excluirAgendamento('${ag._id}')">🗑️ Excluir</button>
            `
        }
      </td>
    `;

    tabela.appendChild(linha);
  });
}

async function atualizarStatus(id, novoStatus) {
  // ⏰ Bloqueia alterações fora do horário permitido
  const agora = new Date();
  const hora = agora.getHours();

  if (hora < 9 || hora >= 19) {
    mostrarToast(
      "⏰ Só é possível atualizar status entre 09:00 e 19:00.",
      "aviso"
    );
    return;
  }

  const res = await fetch(`http://localhost:8000/agendamentos/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: novoStatus }),
  });

  if (res.ok) {
    mostrarToast("✅ Status atualizado com sucesso!", "sucesso");
    carregarAgendamentos();
  } else {
    mostrarToast("❌ Erro ao atualizar status.", "erro");
  }
}

async function excluirAgendamento(id) {
  const confirmar = confirm("Tem certeza que deseja excluir este agendamento?");
  if (!confirmar) return;

  const res = await fetch(`http://localhost:8000/agendamentos/${id}`, {
    method: "DELETE",
  });

  if (res.ok) {
    mostrarToast("🗑️ Agendamento excluído com sucesso!", "sucesso");
    carregarAgendamentos();
  } else {
    mostrarToast("❌ Erro ao excluir agendamento.", "erro");
  }
}

// ✅ Toastify para alertas visuais
function mostrarToast(mensagem, tipo = "info") {
  let cor = "#3498db";

  if (tipo === "sucesso") cor = "#2ecc71";
  if (tipo === "erro") cor = "#e74c3c";
  if (tipo === "aviso") cor = "#8B0000";

  Toastify({
    text: mensagem,
    duration: 4000,
    gravity: "top",
    position: "right",
    style: {
      background: cor,
      color: "#fff",
      borderRadius: "8px",
      fontWeight: "bold",
    },
  }).showToast();
}

carregarAgendamentos();

document
  .getElementById("filtro-status")
  .addEventListener("change", carregarAgendamentos);
