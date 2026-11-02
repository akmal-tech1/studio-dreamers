"""Stats router: real aggregate counts for the landing page."""

from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from database import get_db
from models import Film, TeamMember
from schemas import StatsOut

router = APIRouter(prefix="/api/stats", tags=["stats"])


@router.get("/", response_model=StatsOut)
def stats(db: Session = Depends(get_db)):
    total_films = db.query(func.count(Film.id)).scalar() or 0
    total_minutes = db.query(func.coalesce(func.sum(Film.duration_minutes), 0)).scalar() or 0
    total_awards = db.query(func.coalesce(func.sum(Film.awards), 0)).scalar() or 0
    team_count = db.query(func.count(TeamMember.id)).scalar() or 0
    categories = [r[0] for r in db.query(Film.category).distinct().order_by(Film.category).all()]
    return StatsOut(
        total_films=total_films,
        total_minutes=int(total_minutes),
        total_awards=int(total_awards),
        team_count=team_count,
        categories=categories,
    )
