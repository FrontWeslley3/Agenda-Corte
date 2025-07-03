from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.agendamento_routes import router as agendamento_router

# Função para criar a aplicação FastAPI (boa prática para testes e deploy)
def create_app() -> FastAPI:
    # Cria a instância principal da aplicação FastAPI
    app = FastAPI(
        title="AgendaCorte API",  # Título da API (aparece na documentação automática)
        description="API para gerenciamento de agendamentos de barbearia",  # Descrição da API
        version="1.0.0"  # Versão da API
    )

    # Configuração do CORS (Cross-Origin Resource Sharing)
    # Permite que o frontend (em outro domínio/porta) acesse a API
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # Em produção, substitua "*" pelo domínio real (ex: "https://seusite.com")
        allow_credentials=True,
        allow_methods=["*"],  # Permite todos os métodos HTTP (GET, POST, etc)
        allow_headers=["*"],  # Permite todos os headers
    )

    # Inclui as rotas de agendamento (importadas do módulo routes/agendamento_routes.py)
    app.include_router(agendamento_router)

    # Rota raiz ("/") para teste rápido da API
    @app.get("/")
    async def read_root():
        return {"mensagem": "API do AgendaCorte funcionando!"}

    return app

# Cria a aplicação usando a função acima
app = create_app()
