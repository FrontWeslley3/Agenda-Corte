from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.agendamento_routes import router as agendamento_router

app = FastAPI()

# Configuração de CORS para permitir requisições do front-end
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, substitua "*" pelo domínio real (ex: "https://seusite.com")
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir rotas do agendamento
app.include_router(agendamento_router)

@app.get("/")
def read_root():
    return {"mensagem": "API do AgendaCorte funcionando!"}
