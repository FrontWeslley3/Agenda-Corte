from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

# Modelo principal de Agendamento
class Agendamento(BaseModel):
    nome: str = Field(..., example="João da Silva")  # Nome do cliente
    telefone: str = Field(..., example="11999999999")  # Telefone para contato
    data_hora: str = Field(..., example="2025-06-30 15:30")  # Data e hora do agendamento
    corte: str = Field(..., example="Fade com risca")  # Tipo de corte escolhido
    observacao: Optional[str] = Field(None, example="Cliente quer o corte mais baixo")  # Observações extras
    status: Optional[str] = Field("pendente", example="pendente")  # Status do agendamento: "pendente", "concluído", "cancelado"
    criado_em: Optional[datetime] = Field(default_factory=datetime.utcnow)  # Data/hora de criação do registro

    class Config:
        # Exemplo de schema para documentação automática
        schema_extra = {
            "example": {
                "nome": "João da Silva",
                "telefone": "11978827562",
                "data_hora": "2025-06-30 15:30",
                "corte": "Fade com risca",
                "observacao": "Cliente quer o corte mais baixo",
                "status": "pendente"
            }
        }

# Modelo para atualização de status do agendamento
class AtualizarStatus(BaseModel):
    status: str  # Novo status a ser definido ("pendente", "concluído", "cancelado")
