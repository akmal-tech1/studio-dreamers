from contextlib import asynccontextmanager
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine
from routers import auth as auth_router
from routers import films as films_router
from routers import stats as stats_router
from routers import store as store_router
from routers import team as team_router
from seed import _FILMS, _PRODUCTS, _TEAM
from models import Film, OrderItem, Product, TeamMember


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    seed_if_empty()
    yield


def seed_if_empty():
    from database import SessionLocal

    db = SessionLocal()
    try:
        if db.query(Film).count() == 0:
            db.add_all(Film(**f) for f in _FILMS)
        else:
            film_titles = [film["title"] for film in _FILMS]
            db.query(Film).filter(~Film.title.in_(film_titles)).delete(
                synchronize_session=False
            )
            kadhal_rapido = db.query(Film).filter(Film.title == "Kadhal Rapido").first()
            if kadhal_rapido:
                kadhal_rapido.year = _FILMS[3]["year"]
            else:
                fourth_film = db.query(Film).order_by(Film.year.desc(), Film.id.asc()).offset(3).first()
                if fourth_film:
                    for field, value in _FILMS[3].items():
                        setattr(fourth_film, field, value)
                else:
                    db.add(Film(**_FILMS[3]))
        for member_data in _TEAM:
            member = (
                db.query(TeamMember)
                .filter(TeamMember.sort_order == member_data["sort_order"])
                .first()
            )
            if member is None:
                db.add(TeamMember(**member_data))
            else:
                for field, value in member_data.items():
                    setattr(member, field, value)
        db.query(TeamMember).filter(TeamMember.sort_order > len(_TEAM)).delete(
            synchronize_session=False
        )
        product_names = [product["name"] for product in _PRODUCTS]
        ordered_product_ids = db.query(OrderItem.product_id)
        db.query(Product).filter(
            ~Product.name.in_(product_names),
            ~Product.id.in_(ordered_product_ids),
        ).delete(synchronize_session=False)
        existing_product_names = {
            name for (name,) in db.query(Product.name).filter(Product.name.in_(product_names)).all()
        }
        db.add_all(
            Product(**product)
            for product in _PRODUCTS
            if product["name"] not in existing_product_names
        )
        db.commit()
    finally:
        db.close()


app = FastAPI(
    title="Studio Dreamers Pictures API",
    description="Backend for the Studio Dreamers Pictures cinematic website: films, team, store, and JWT auth.",
    version="1.0.0",
    lifespan=lifespan,
)

origins = [o.strip() for o in os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router.router)
app.include_router(films_router.router)
app.include_router(team_router.router)
app.include_router(store_router.router)
app.include_router(stats_router.router)


@app.get("/")
def root():
    return {
        "service": "Studio Dreamers Pictures API",
        "docs": "/docs",
        "endpoints": ["/api/films", "/api/team", "/api/store/products", "/api/auth/login"],
    }
