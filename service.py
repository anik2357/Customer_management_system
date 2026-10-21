import repository
from sqlalchemy.orm import Session
from schema import CustomerCreate, CustomerUpdate


def get_all_customers(db: Session):
    return repository.get_all_customers(db)


def create_customer(db: Session, data: CustomerCreate):
    existing = repository.get_customer_by_email(db, str(data.email))
    if existing:
        raise ValueError("A customer with this email already exists")
    return repository.create_customer(db, data)


def update_customer(db: Session, customer_id: int, data: CustomerUpdate):
    customer = repository.get_customer(db, customer_id)
    if not customer:
        raise LookupError("Customer not found")

    existing = repository.get_customer_by_email(db, str(data.email))
    if existing and existing.id != customer_id:
        raise ValueError("A customer with this email already exists")

    return repository.update_customer(db, customer, data)


def delete_customer(db: Session, customer_id: int):
    customer = repository.get_customer(db, customer_id)
    if not customer:
        raise LookupError("Customer not found")
    repository.delete_customer(db, customer)
