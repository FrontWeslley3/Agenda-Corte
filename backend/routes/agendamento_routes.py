from fastapi import APIRouter, HTTPException
from models.agendamento import Agendamento, AtualizarStatus
from database.mongo import agendamentos_collection
from bson import ObjectId
from typing import List

router = APIRouter()

# Rota para criar um novo agendamento
@router.post("/agendamentos", status_code=201)
def criar_agendamento(agendamento: Agendamento):
    novo_agendamento = agendamento.dict()
    resultado = agendamentos_collection.insert_one(novo_agendamento)
    if not resultado.acknowledged:
        raise HTTPException(status_code=500, detail="Erro ao salvar agendamento")
    return {"mensagem": "Agendamento criado com sucesso", "id": str(resultado.inserted_id)}

# Rota para listar todos os agendamentos
@router.get("/agendamentos")
def listar_agendamentos():
    agendamentos = []
    for doc in agendamentos_collection.find():
        doc["_id"] = str(doc["_id"])  # Convertendo ObjectId para string
        agendamentos.append(doc)
    return agendamentos

# Rota para atualizar um agendamento completo
@router.put("/agendamentos/{agendamento_id}")
def atualizar_agendamento(agendamento_id: str, agendamento: Agendamento):
    dados = agendamento.dict()
    dados.pop("criado_em", None)  # evita sobrescrever timestamp
    resultado = agendamentos_collection.update_one(
        {"_id": ObjectId(agendamento_id)},
        {"$set": dados}
    )
    if resultado.matched_count == 0:
        raise HTTPException(status_code=404, detail="Agendamento não encontrado")
    return {"mensagem": "Agendamento atualizado com sucesso"}

# ✅ NOVA ROTA para atualizar somente o status
@router.patch("/agendamentos/{agendamento_id}/status")
def atualizar_status_agendamento(agendamento_id: str, status_update: AtualizarStatus):
    resultado = agendamentos_collection.update_one(
        {"_id": ObjectId(agendamento_id)},
        {"$set": {"status": status_update.status}}
    )
    if resultado.matched_count == 0:
        raise HTTPException(status_code=404, detail="Agendamento não encontrado")
    return {"mensagem": "Status atualizado com sucesso"}

# Rota para excluir um agendamento
@router.delete("/agendamentos/{agendamento_id}")
def excluir_agendamento(agendamento_id: str):  
    resultado = agendamentos_collection.delete_one({"_id": ObjectId(agendamento_id)})
    if resultado.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Agendamento não encontrado")
    return {"mensagem": "Agendamento excluído com sucesso"}
