const tabela = document.getElementById("tabela-agendamentos");

async function carregarAgendamentos() {
  const res = await fetch("http://localhost:8000/agendamentos");
  const dados = await res.json();
  tabela.innerHTML = "";

  dados.forEach((ag) => {
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
  const res = await fetch(`http://localhost:8000/agendamentos/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: novoStatus }),
  });

  if (res.ok) {
    carregarAgendamentos();
  } else {
    alert("Erro ao atualizar status.");
  }
}

async function excluirAgendamento(id) {
  const confirmar = confirm("Tem certeza que deseja excluir este agendamento?");
  if (!confirmar) return;

  const res = await fetch(`http://localhost:8000/agendamentos/${id}`, {
    method: "DELETE",
  });

  if (res.ok) {
    carregarAgendamentos();
  } else {
    alert("Erro ao excluir agendamento.");
  }
}

carregarAgendamentos();
