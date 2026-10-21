from sqlalchemy.orm import Session
from models import Customer
from schema import CustomerCreate, CustomerUpdate


def get_all_customers(db: Session):
    return db.query(Customer).order_by(Customer.id.desc()).all()


def get_customer(db: Session, customer_id: int):
    return db.query(Customer).filter(Customer.id == customer_id).first()


def get_customer_by_email(db: Session, email: str):
    return db.query(Customer).filter(Customer.email == email).first()


def create_customer(db: Session, data: CustomerCreate):
    customer = Customer(**data.model_dump())
    db.add(customer)
    db.commit()
    db.refresh(customer)
    return customer


def update_customer(db: Session, customer: Customer, data: CustomerUpdate):
    for key, value in data.model_dump().items():
        setattr(customer, key, value)
    db.commit()
    db.refresh(customer)
    return customer


def delete_customer(db: Session, customer: Customer):
    db.delete(customer)
    db.commit()
