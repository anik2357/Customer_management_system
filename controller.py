from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import service
from database import get_db
from schema import CustomerCreate, CustomerUpdate, CustomerResponse

router = APIRouter(prefix="/customers", tags=["Customers"])


@router.get("/", response_model=list[CustomerResponse])
def list_customers(db: Session = Depends(get_db)):
    return service.get_all_customers(db)


@router.get("/{customer_id}", response_model=CustomerResponse)
def get_customer(customer_id: int, db: Session = Depends(get_db)):
    customer = service.repository.get_customer(db, customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer


@router.post("/", response_model=CustomerResponse, status_code=201)
def create_customer(data: CustomerCreate, db: Session = Depends(get_db)):
    try:
        return service.create_customer(db, data)
    except ValueError as exc:
        raise HTTPException(status_code=409, detail=str(exc))


@router.put("/{customer_id}", response_model=CustomerResponse)
def update_customer(
    customer_id: int,
    data: CustomerUpdate,
    db: Session = Depends(get_db)
):
    try:
        return service.update_customer(db, customer_id, data)
    except LookupError as exc:
        raise HTTPException(status_code=404, detail=str(exc))
    except ValueError as exc:
        raise HTTPException(status_code=409, detail=str(exc))


@router.delete("/{customer_id}")
def delete_customer(customer_id: int, db: Session = Depends(get_db)):
    try:
        service.delete_customer(db, customer_id)
        return {"message": "Customer deleted successfully"}
    except LookupError as exc:
        raise HTTPException(status_code=404, detail=str(exc))
