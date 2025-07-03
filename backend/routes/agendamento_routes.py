from fastapi import APIRouter, HTTPException
from models.agendamento import Agendamento, AtualizarStatus
from database.mongo import agendamentos_collection
from bson import ObjectId
from datetime import datetime

# Cria o roteador para as rotas de agendamento
router = APIRouter()

# 📌 Rota para criar um novo agendamento
@router.post("/agendamentos", status_code=201)
def criar_agendamento(agendamento: Agendamento):
    """
    Cria um novo agendamento.
    Valida:
    - Horário de funcionamento (09h às 19h)
    - Se já existe agendamento no mesmo horário
    """
    # ✅ Validar horário de funcionamento
    try:
        horario = datetime.strptime(agendamento.data_hora, "%Y-%m-%d %H:%M")
        hora = horario.hour
        if hora < 9 or hora >= 19:
            raise HTTPException(
                status_code=400,
                detail="Horário fora do funcionamento. Escolha entre 09:00 e 19:00."
            )
    except ValueError:
        raise HTTPException(status_code=400, detail="Formato de data/hora inválido.")

    # ✅ Verificar se já existe um agendamento no mesmo horário
    horario_ocupado = agendamentos_collection.find_one({
        "data_hora": agendamento.data_hora,
        "status": {"$in": ["pendente", "concluido"]}
    })

    if horario_ocupado:
        raise HTTPException(
            status_code=400,
            detail="Horário indisponível. Já existe um agendamento para esse horário."
        )

    # ✅ Inserir novo agendamento no banco
    novo_agendamento = agendamento.dict()
    resultado = agendamentos_collection.insert_one(novo_agendamento)

    if not resultado.acknowledged:
        raise HTTPException(status_code=500, detail="Erro ao salvar agendamento")

    return {"mensagem": "Agendamento criado com sucesso", "id": str(resultado.inserted_id)}


# 📌 Rota para listar todos os agendamentos
@router.get("/agendamentos")
def listar_agendamentos():
    """
    Retorna todos os agendamentos cadastrados.
    Converte o ObjectId para string para facilitar o uso no frontend.
    """
    agendamentos = []
    for doc in agendamentos_collection.find():
        doc["_id"] = str(doc["_id"])  # Converte ObjectId para string
        agendamentos.append(doc)
    return agendamentos


# 📌 Rota para atualizar um agendamento completo
@router.put("/agendamentos/{agendamento_id}")
def atualizar_agendamento(agendamento_id: str, agendamento: Agendamento):
    """
    Atualiza todos os campos de um agendamento.
    Ignora a sobrescrita do campo 'criado_em'.
    """
    dados = agendamento.dict()
    dados.pop("criado_em", None)  # Não permite sobrescrever data de criação

    resultado = agendamentos_collection.update_one(
        {"_id": ObjectId(agendamento_id)},
        {"$set": dados}
    )

    if resultado.matched_count == 0:
        raise HTTPException(status_code=404, detail="Agendamento não encontrado")

    return {"mensagem": "Agendamento atualizado com sucesso"}


# 📌 Rota para atualizar apenas o status do agendamento
@router.patch("/agendamentos/{agendamento_id}/status")
def atualizar_status_agendamento(agendamento_id: str, status_update: AtualizarStatus):
    """
    Atualiza somente o campo 'status' de um agendamento (ex: concluído ou cancelado).
    """
    resultado = agendamentos_collection.update_one(
        {"_id": ObjectId(agendamento_id)},
        {"$set": {"status": status_update.status}}
    )

    if resultado.matched_count == 0:
        raise HTTPException(status_code=404, detail="Agendamento não encontrado")

    return {"mensagem": "Status atualizado com sucesso"}


# 📌 Rota para excluir um agendamento
@router.delete("/agendamentos/{agendamento_id}")
def excluir_agendamento(agendamento_id: str):  
    """
    Exclui um agendamento pelo seu ID.
    """
    resultado = agendamentos_collection.delete_one({"_id": ObjectId(agendamento_id)})

    if resultado.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Agendamento não encontrado")

    return {"mensagem": "Agendamento excluído com sucesso"}
