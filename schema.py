from pydantic import BaseModel, EmailStr, ConfigDict, Field


class CustomerCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    phone: str = Field(min_length=1, max_length=20)
    address: str | None = Field(default=None, max_length=255)
    is_active: bool = True


class CustomerUpdate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    phone: str = Field(min_length=1, max_length=20)
    address: str | None = Field(default=None, max_length=255)
    is_active: bool = True


class CustomerResponse(CustomerCreate):
    id: int
    model_config = ConfigDict(from_attributes=True)
