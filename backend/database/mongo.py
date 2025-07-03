from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Carrega variáveis do arquivo .env para proteger credenciais sensíveis
load_dotenv()

# Obtém a URI do MongoDB da variável de ambiente
MONGO_URI = os.getenv("MONGO_URI")

# Cria o cliente MongoDB (conexão com o banco)
client = MongoClient(MONGO_URI)

# Seleciona o banco de dados principal do projeto
db = client["agenda-corte"]

# Define as coleções usadas no projeto
cortes_collection = db["cortes"]  # Coleção para cortes disponíveis
agendamentos_collection = db["agendamentos"]  # Coleção para agendamentos

# Função para fechar a conexão com o banco (boa prática para testes ou scripts)
def close_client():
    client.close()
