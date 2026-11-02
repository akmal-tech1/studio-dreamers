from datetime import datetime

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(120))
    email: Mapped[str] = mapped_column(String(180), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(200))
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    orders: Mapped[list["Order"]] = relationship(back_populates="user", lazy="selectin")


class Film(Base):
    __tablename__ = "films"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(200))
    category: Mapped[str] = mapped_column(String(60), index=True)
    year: Mapped[int] = mapped_column(Integer)
    duration_minutes: Mapped[int] = mapped_column(Integer)
    rating: Mapped[float] = mapped_column(Float, default=0.0)
    synopsis: Mapped[str] = mapped_column(Text)
    director: Mapped[str] = mapped_column(String(120))
    director_note: Mapped[str] = mapped_column(Text, default="")
    release_date: Mapped[str] = mapped_column(String(40), default="")
    trailer_url: Mapped[str] = mapped_column(String(500), default="")
    video_url: Mapped[str] = mapped_column(String(500), default="")
    poster_url: Mapped[str] = mapped_column(String(500), default="")
    accent: Mapped[str] = mapped_column(String(16), default="#ff0033")
    featured: Mapped[bool] = mapped_column(Boolean, default=False)
    awards: Mapped[int] = mapped_column(Integer, default=0)


class TeamMember(Base):
    __tablename__ = "team_members"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(120))
    role: Mapped[str] = mapped_column(String(120))
    department: Mapped[str] = mapped_column(String(120))
    bio: Mapped[str] = mapped_column(Text)
    photo_url: Mapped[str] = mapped_column(String(500), default="")
    sort_order: Mapped[int] = mapped_column(Integer, default=0)


class Product(Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(200))
    category: Mapped[str] = mapped_column(String(40), index=True)  # ticket | merch | access
    description: Mapped[str] = mapped_column(Text)
    price: Mapped[float] = mapped_column(Float)
    image_seed: Mapped[str] = mapped_column(String(80), default="")
    stock: Mapped[int] = mapped_column(Integer, default=0)
    badge: Mapped[str] = mapped_column(String(60), default="")


class Order(Base):
    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))
    total: Mapped[float] = mapped_column(Float)
    status: Mapped[str] = mapped_column(String(40), default="confirmed")
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    user: Mapped["User"] = relationship(back_populates="orders")
    items: Mapped[list["OrderItem"]] = relationship(back_populates="order", lazy="selectin")


class OrderItem(Base):
    __tablename__ = "order_items"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    order_id: Mapped[int] = mapped_column(Integer, ForeignKey("orders.id"))
    product_id: Mapped[int] = mapped_column(Integer, ForeignKey("products.id"))
    product_name: Mapped[str] = mapped_column(String(200))
    qty: Mapped[int] = mapped_column(Integer)
    unit_price: Mapped[float] = mapped_column(Float)

    order: Mapped["Order"] = relationship(back_populates="items")
