from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


# ---------- Auth ----------
class UserCreate(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    password: str = Field(min_length=6, max_length=100)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    name: str
    email: str
    model_config = ConfigDict(from_attributes=True)


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


# ---------- Films ----------
class FilmOut(BaseModel):
    id: int
    title: str
    category: str
    year: int
    duration_minutes: int
    rating: float
    synopsis: str
    director: str
    director_note: str
    release_date: str
    trailer_url: str
    video_url: str
    poster_url: str
    accent: str
    featured: bool
    awards: int
    model_config = ConfigDict(from_attributes=True)


# ---------- Team ----------
class TeamOut(BaseModel):
    id: int
    name: str
    role: str
    department: str
    bio: str
    photo_url: str
    model_config = ConfigDict(from_attributes=True)


# ---------- Store ----------
class ProductOut(BaseModel):
    id: int
    name: str
    category: str
    description: str
    price: float
    image_seed: str
    stock: int
    badge: str
    model_config = ConfigDict(from_attributes=True)


class CheckoutItem(BaseModel):
    product_id: int
    qty: int = Field(ge=1, le=50)


class CheckoutRequest(BaseModel):
    items: list[CheckoutItem] = Field(min_length=1)


class OrderItemOut(BaseModel):
    product_id: int
    product_name: str
    qty: int
    unit_price: float
    model_config = ConfigDict(from_attributes=True)


class OrderOut(BaseModel):
    id: int
    total: float
    status: str
    created_at: datetime
    items: list[OrderItemOut]
    model_config = ConfigDict(from_attributes=True)


# ---------- Stats ----------
class StatsOut(BaseModel):
    total_films: int
    total_minutes: int
    total_awards: int
    team_count: int
    categories: list[str]
