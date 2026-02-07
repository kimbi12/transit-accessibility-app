from fastapi import APIRouter
from pydantic import BaseModel, Field

from services.assistant_service import AssistantService

router = APIRouter(prefix="/api/assistant", tags=["Assistant"])
assistant_service = AssistantService()

class AssistantQuery(BaseModel):
    text: str = Field(..., min_length=1)

@router.post("/query")
async def assistant_query(payload: AssistantQuery):
    return await assistant_service.handle(payload.text)
