"""Store router: product catalog and checkout (JWT protected)."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from auth import get_current_user
from database import get_db
from models import Order, OrderItem, Product, User
from schemas import CheckoutRequest, OrderOut, ProductOut
from seed import _PRODUCTS

router = APIRouter(prefix="/api/store", tags=["store"])


@router.get("/products", response_model=list[ProductOut])
def list_products(db: Session = Depends(get_db)):
    product_names = [product["name"] for product in _PRODUCTS]
    return (
        db.query(Product)
        .filter(Product.name.in_(product_names))
        .order_by(Product.id.asc())
        .all()
    )


@router.post("/checkout", response_model=OrderOut, status_code=status.HTTP_201_CREATED)
def checkout(
    payload: CheckoutRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    total = 0.0
    line_items = []
    product_names = [product["name"] for product in _PRODUCTS]
    for item in payload.items:
        product = db.get(Product, item.product_id)
        if product is None or product.name not in product_names:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Product {item.product_id} not found",
            )
        if product.stock <= 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"'{product.name}' is out of stock",
            )
        if product.stock < item.qty:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Not enough stock for '{product.name}'",
            )
        total += product.price * item.qty
        line_items.append(
            OrderItem(product_id=product.id, product_name=product.name, qty=item.qty, unit_price=product.price)
        )
        product.stock -= item.qty

    order = Order(user_id=current_user.id, total=round(total, 2), status="confirmed")
    db.add(order)
    db.flush()
    for li in line_items:
        li.order_id = order.id
        db.add(li)
    db.commit()
    db.refresh(order)
    return order
