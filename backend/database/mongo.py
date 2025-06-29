from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Carregar variáveis do arquivo .env
load_dotenv()

# Usar a variável de ambiente MONGO_URI
MONGO_URI = os.getenv("MONGO_URI")

# Criar o cliente MongoDB
client = MongoClient(MONGO_URI)

# Selecionar o banco de dados
db = client["agenda-corte"]

# Coleções
cortes_collection = db["cortes"]
agendamentos_collection = db["agendamentos"]

# Fechar conexão
def close_client():
    client.close()
