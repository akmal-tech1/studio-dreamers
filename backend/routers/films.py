"""Films router: catalog, categories, and single-film detail."""

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from database import get_db
from models import Film
from schemas import FilmOut

router = APIRouter(prefix="/api/films", tags=["films"])


@router.get("/categories")
def categories(db: Session = Depends(get_db)):
    rows = db.query(Film.category).distinct().order_by(Film.category).all()
    return {"categories": [r[0] for r in rows]}


@router.get("/", response_model=list[FilmOut])
def list_films(
    category: str | None = Query(default=None),
    featured: bool | None = Query(default=None),
    db: Session = Depends(get_db),
):
    q = db.query(Film).order_by(Film.year.desc(), Film.id.asc())
    if category:
        q = q.filter(Film.category == category)
    if featured is not None:
        q = q.filter(Film.featured == featured)
    return q.all()


@router.get("/{film_id}", response_model=FilmOut)
def get_film(film_id: int, db: Session = Depends(get_db)):
    film = db.get(Film, film_id)
    if film is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Film not found")
    return film
