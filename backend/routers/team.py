"""Team router: studio members."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models import TeamMember
from schemas import TeamOut

router = APIRouter(prefix="/api/team", tags=["team"])


@router.get("/", response_model=list[TeamOut])
def list_team(db: Session = Depends(get_db)):
    return db.query(TeamMember).order_by(TeamMember.sort_order.asc()).all()
