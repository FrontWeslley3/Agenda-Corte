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

// Renderizar galeria
const galeria = document.getElementById("galeria-cortes");
const form = document.getElementById("form-agendamento");
const formElement = document.getElementById("agendar-form");

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

// Abrir formulário com corte selecionado
function abrirFormulario(corte) {
  form.style.display = "block";
  form.scrollIntoView({ behavior: "smooth" });
  formElement.corte.value = corte;
}

// Fechar formulário
function fecharFormulario() {
  form.style.display = "none";
  formElement.reset();
}

// Enviar agendamento para API
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

    const resultado = await resposta.json();
    alert("✅ Agendamento realizado com sucesso!");
    fecharFormulario();
  } catch (err) {
    console.error(err);
    alert("❌ Erro ao agendar. Tente novamente.");
  }
});
