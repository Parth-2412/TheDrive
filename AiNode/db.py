import ssl
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base

# Base URL without sslmode/channel_binding
DATABASE_URL = (
    "postgresql+asyncpg://neondb_owner:npg_fFjh2dV3PXCy"
    "@ep-bitter-dawn-a15w4tct-pooler.ap-southeast-1.aws.neon.tech/neondb"
)

# Create SSL context for Neon
ssl_context = ssl.create_default_context()
ssl_context.check_hostname = False  # optional: disable if Neon certs don’t match hostname
ssl_context.verify_mode = ssl.CERT_REQUIRED

# Async engine with SSL passed via connect_args
engine = create_async_engine(
    DATABASE_URL,
    echo=True,
    connect_args={"ssl": ssl_context},
)

SessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
Base = declarative_base()
