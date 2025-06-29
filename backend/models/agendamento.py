from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class Agendamento(BaseModel):
    nome: str = Field(..., example="João da Silva")
    telefone: str = Field(..., example="11999999999")
    data_hora: str = Field(..., example="2025-06-30 15:30")
    corte: str = Field(..., example="Fade com risca")
    observacao: Optional[str] = Field(None, example="Cliente quer o corte mais baixo")
    status: Optional[str] = Field("pendente", example="pendente")  # "pendente", "concluído", "cancelado"
    criado_em: Optional[datetime] = Field(default_factory=datetime.utcnow)

    class Config:
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

# ✅ Novo modelo para atualização de status
class AtualizarStatus(BaseModel):
    status: str
