# --- Chat Memory Utilities ---

from sqlalchemy import Column, Integer, Text, JSON, ARRAY, Float, TIMESTAMP, String, DateTime
from db import Base
from utils import utc_now


class ChatMessageDB(Base):
    __tablename__ = "chat_messages"
    
    id = Column(String, primary_key=True)
    session_id = Column(String, nullable=False)
    public_key = Column(String, nullable=False)
    role = Column(String, nullable=False)  # 'user' or 'assistant'
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, nullable=False)
    
class ChatSessionDB(Base):
    __tablename__ = "chat_sessions"
    
    session_id = Column(String, primary_key=True)
    public_key = Column(String, nullable=False)
    vector_db_path = Column(String, nullable=False)
    created_at = Column(DateTime, nullable=False)
    updated_at = Column(DateTime, nullable=False)



