# --- Chat Memory Utilities ---

from sqlalchemy import Column, Integer, Text, JSON, ARRAY, Float, TIMESTAMP
from db import Base
import datetime

class AIChunk(Base):
    __tablename__ = "ai_chunks"
    id = Column(Integer, primary_key=True, index=True)
    chunk = Column(Text)
    embedding = Column(ARRAY(Float))
    meta = Column(JSON)

class ChatMemory(Base):
    __tablename__ = "chat_memory"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Text, nullable=False)
    session_id = Column(Text, nullable=False)
    scope = Column(Text)
    memory = Column(JSON, nullable=False, default=list)
    updated_at = Column(TIMESTAMP, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

async def get_chat_memory(session: AsyncSession, user_id: str, session_id: str) -> ChatMemory:
    result = await session.execute(
        select(ChatMemory).where(ChatMemory.user_id == user_id, ChatMemory.session_id == session_id)
    )
    return result.scalars().first()

async def update_chat_memory(session: AsyncSession, user_id: str, session_id: str, scope: str, new_message: dict):
    chat_mem = await get_chat_memory(session, user_id, session_id)
    if chat_mem:
        mem = chat_mem.memory or []
        mem.append(new_message)
        chat_mem.memory = mem
        chat_mem.updated_at = datetime.datetime.utcnow()
    else:
        chat_mem = ChatMemory(
            user_id=user_id,
            session_id=session_id,
            scope=scope,
            memory=[new_message],
            updated_at=datetime.datetime.utcnow()
        )
        session.add(chat_mem)
    await session.commit()
    return chat_mem
