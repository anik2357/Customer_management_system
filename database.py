import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Set DATABASE_URL as an environment variable, or edit the fallback below.
# DATABASE_URL = os.getenv(
#     "DATABASE_URL",
#     "mysql+pymysql://root:root@localhost:3306/customer_db"
# )

SQLALCHEMY_DATABASE_URL = "postgresql+psycopg2://training_8cn2_user:D4JUFWusk4GVGqMXLDVMSZWFz2TEFybU@dpg-dbbfh061egvs73fsa060-a.oregon-postgres.render.com/training_8cn2"

engine = create_engine(SQLALCHEMY_DATABASE_URL) 
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine) 
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
