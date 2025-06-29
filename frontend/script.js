// Lista de cortes (pode carregar do back futuramente)
const cortes = [
  {
    titulo: "Fade Clássico",
    descricao: "Degradê limpo e tradicional",
    imagem: "assets/cortes/fade.jpeg",
  },
  {
    titulo: "Social",
    descricao: "Estilo discreto e elegante",
    imagem: "assets/cortes/social.jpeg",
  },
  {
    titulo: "Afro",
    descricao: "Corte com desenho personalizado",
    imagem: "assets/cortes/afro.jpeg",
  },
];

// Referências ao DOM
const galeria = document.getElementById("galeria-cortes");
const form = document.getElementById("form-agendamento");
const formElement = document.getElementById("agendar-form");

// Renderiza os cards dos cortes
cortes.forEach((corte) => {
  const card = document.createElement("div");
  card.classList.add("corte");
  card.innerHTML = `
        <img src="${corte.imagem}" alt="${corte.titulo}">
        <div class="corte-info">
            <h3>${corte.titulo}</h3>
            <p>${corte.descricao}</p>
            <button onclick="abrirFormulario('${corte.titulo}')">Agendar este corte</button>
        </div>
    `;
  galeria.appendChild(card);
});

// Abre o formulário com o corte já preenchido
function abrirFormulario(corte) {
  form.style.display = "block";
  form.scrollIntoView({ behavior: "smooth" });
  formElement.corte.value = corte;
}

// Fecha e reseta o formulário
function fecharFormulario() {
  form.style.display = "none";
  formElement.reset();
}

// Exibe notificações com Toastify
function mostrarToast(mensagem, tipo = "info") {
  let cor = "#3498db"; // Azul padrão

  if (tipo === "sucesso") cor = "#2ecc71"; // Verde
  if (tipo === "erro") cor = "#e74c3c"; // Vermelho
  if (tipo === "aviso") cor = "#f39c12"; // Amarelo

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

// Envia os dados do formulário para a API
formElement.addEventListener("submit", async (e) => {
  e.preventDefault();

  const dados = {
    nome: formElement.nome.value,
    telefone: formElement.telefone.value,
    data_hora: formElement.data_hora.value,
    corte: formElement.corte.value,
    observacao: formElement.observacao.value,
    status: "pendente",
  };

  try {
    const resposta = await fetch("http://localhost:8000/agendamentos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dados),
    });

    if (resposta.ok) {
      mostrarToast("✅ Agendamento realizado com sucesso!", "sucesso");
      fecharFormulario();
    } else if (resposta.status === 400) {
      const erro = await resposta.json();
      mostrarToast("⚠️ " + erro.detail, "aviso");
    } else {
      mostrarToast("❌ Erro ao agendar. Tente novamente.", "erro");
    }
  } catch (err) {
    console.error(err);
    mostrarToast("❌ Erro de conexão com o servidor.", "erro");
  }
});
