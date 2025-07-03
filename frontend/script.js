// ===============================
// Lista de cortes disponíveis
// (No futuro, pode ser carregada do backend)
// ===============================
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

// ===============================
// Referências aos elementos do DOM
// ===============================
const galeria = document.getElementById("galeria-cortes");
const form = document.getElementById("form-agendamento");
const formElement = document.getElementById("agendar-form");

// ===============================
// Renderiza os cards dos cortes na galeria
// ===============================
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

// ===============================
// Função para abrir o formulário de agendamento
// Preenche o campo do corte e define limites de data/hora
// ===============================
function abrirFormulario(corte) {
  const inputDataHora = document.getElementById("data_hora");
  const agora = new Date();

  // Define limites de horário para agendamento (09:00 às 19:00)
  const hoje9h = new Date();
  hoje9h.setHours(9, 0, 0, 0);

  const hoje18h = new Date();
  hoje18h.setHours(18, 59, 59, 999);

  let minDate;
  if (agora > hoje18h) {
    // Se já passou das 19h, só permite agendar para o próximo dia útil
    const amanha = new Date();
    amanha.setDate(amanha.getDate() + 1);
    amanha.setHours(9, 0, 0, 0);
    minDate = amanha;
  } else if (agora < hoje9h) {
    // Antes das 9h, só permite a partir das 9h de hoje
    minDate = hoje9h;
  } else {
    // Entre 9h e 19h, permite a partir de agora
    minDate = agora;
  }

  // Define o mínimo e máximo para o input de data/hora
  const minISO = minDate.toISOString().slice(0, 16);
  inputDataHora.min = minISO;

  const maxDate = new Date(minDate);
  maxDate.setDate(maxDate.getDate() + 30);
  maxDate.setHours(18, 59, 0, 0);
  const maxISO = maxDate.toISOString().slice(0, 16);
  inputDataHora.max = maxISO;

  // Preenche o campo do corte e exibe o formulário
  formElement.corte.value = corte;
  form.style.display = "block";
  form.scrollIntoView({ behavior: "smooth" });
}

// ===============================
// Função para fechar e resetar o formulário
// ===============================
function fecharFormulario() {
  form.style.display = "none";
  formElement.reset();
}

// ===============================
// Função para exibir notificações usando Toastify
// ===============================
function mostrarToast(mensagem, tipo = "info") {
  let cor = "#3498db"; // Azul padrão

  if (tipo === "sucesso") cor = "#2ecc71"; // Verde
  if (tipo === "erro") cor = "#e74c3c";    // Vermelho
  if (tipo === "aviso") cor = "#8B0000";   // Vermelho escuro

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

// ===============================
// Envia os dados do formulário para a API FastAPI
// ===============================
formElement.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Monta o objeto com os dados do formulário
  const dados = {
    nome: formElement.nome.value,
    telefone: formElement.telefone.value,
    data_hora: formElement.data_hora.value.replace("T", " "),
    corte: formElement.corte.value,
    observacao: formElement.observacao.value,
    status: "pendente",
  };

  // Bloqueia agendamento em domingos
  const dataSelecionada = new Date(dados.data_hora);
  if (dataSelecionada.getDay() === 0) {
    mostrarToast(
      "⚠️ Domingos não estão disponíveis para agendamento.",
      "aviso"
    );
    return;
  }

  try {
    const resposta = await fetch("http://localhost:8000/agendamentos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dados),
    });

    if (resposta.ok) {
      mostrarToast(
        "✅ Agradecemos sua preferência! Agendamento realizado com sucesso.",
        "sucesso"
      );
      fecharFormulario();
    } else if (resposta.status === 400) {
      const erro = await resposta.json();

      if (erro.detail.includes("Horário fora do funcionamento")) {
        mostrarToast(
          "⏰ Estamos fora do horário de atendimento! Agende entre 09:00 e 19:00, de segunda a sábado.",
          "aviso"
        );
      } else if (erro.detail.includes("Horário indisponível")) {
        mostrarToast(
          "⚠️ Esse horário já está ocupado. Escolha outro!",
          "aviso"
        );
      } else {
        mostrarToast("⚠️ " + erro.detail, "aviso");
      }
    } else {
      mostrarToast("❌ Erro ao agendar. Tente novamente.", "erro");
    }
  } catch (err) {
    console.error(err);
    mostrarToast("❌ Erro de conexão com o servidor.", "erro");
  }
});
