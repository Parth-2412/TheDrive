from sqlalchemy import Column, Integer, Text, JSON, ARRAY, Float
from db import Base

class AIChunk(Base):
    __tablename__ = "ai_chunks"
    id = Column(Integer, primary_key=True, index=True)
    chunk = Column(Text)
    embedding = Column(ARRAY(Float))
    meta = Column(JSON)
