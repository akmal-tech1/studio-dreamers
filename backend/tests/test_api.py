"""Smoke tests for the Studio Dreamers Pictures API."""

import pytest
from fastapi.testclient import TestClient

from database import SessionLocal
from main import app, seed_if_empty
from models import Film, Product


@pytest.fixture(scope="module")
def client():
    # Entering the context manager runs the app lifespan,
    # which creates the schema and seeds the demo catalog.
    with TestClient(app) as c:
        yield c


def test_root(client):
    r = client.get("/")
    assert r.status_code == 200
    assert r.json()["service"] == "Studio Dreamers Pictures API"


def test_films_listed_and_categories(client):
    films = client.get("/api/films").json()
    assert len(films) == 4
    assert films[3]["title"] == "Kadhal Rapido"
    assert films[3]["duration_minutes"] == 122
    assert films[3]["director"] == "Thanasurya"
    cats = client.get("/api/films/categories").json()["categories"]
    assert "Drama" in cats
    filtered = client.get("/api/films", params={"category": "Drama"}).json()
    assert all(f["category"] == "Drama" for f in filtered)
    assert all(f["featured"] for f in client.get("/api/films", params={"featured": True}).json())


def test_legacy_films_are_removed(client):
    db = SessionLocal()
    try:
        db.add(
            Film(
                title="Crimson Horizon",
                category="Drama",
                year=2025,
                duration_minutes=90,
                rating=4.0,
                synopsis="Legacy catalog entry.",
                director="Demo Director",
            )
        )
        db.commit()
    finally:
        db.close()

    seed_if_empty()

    films = client.get("/api/films").json()
    assert len(films) == 4
    assert all(film["title"] != "Crimson Horizon" for film in films)


def test_film_detail_404(client):
    assert client.get("/api/films/9999").status_code == 404


def test_team_and_products(client):
    team = client.get("/api/team").json()
    assert [(member["name"], member["role"]) for member in team] == [
        ("thanasurya", "Director & Writer"),
        ("purushoth", "Director of Photography"),
        ("mohamed akmal", "Editing and VFX"),
        ("selvaganapathy", "Actor 1"),
        ("jeeva", "Actor 2"),
        ("ebi", "SFX & Music"),
        ("sanju", "Actor 3"),
        ("Studio Dreamers", "Producing"),
    ]
    products = client.get("/api/store/products").json()
    assert {p["name"] for p in products} == {
        "Behind-the-Scenes Art Book",
        "Director's Commentary Bundle",
    }


def test_legacy_products_are_removed_from_catalog(client):
    db = SessionLocal()
    try:
        db.add(
            Product(
                name="Opening Night Digital Pass",
                category="ticket",
                description="Legacy catalog entry.",
                price=12.0,
                stock=10,
            )
        )
        db.commit()
    finally:
        db.close()

    seed_if_empty()

    products = client.get("/api/store/products").json()
    assert {product["name"] for product in products} == {
        "Behind-the-Scenes Art Book",
        "Director's Commentary Bundle",
    }
    db = SessionLocal()
    try:
        assert db.query(Product).filter(Product.name == "Opening Night Digital Pass").count() == 0
    finally:
        db.close()


def test_stats(client):
    stats = client.get("/api/stats").json()
    assert stats["total_films"] >= 3
    assert stats["total_minutes"] > 0
    assert stats["team_count"] >= 8


def test_auth_flow(client):
    r = client.post("/api/auth/register", json={"name": "Test Viewer", "email": "test@studio.example", "password": "secret123"})
    assert r.status_code == 201
    token = r.json()["access_token"]
    me = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me.status_code == 200 and me.json()["email"] == "test@studio.example"
    dup = client.post("/api/auth/register", json={"name": "Dup", "email": "test@studio.example", "password": "secret123"})
    assert dup.status_code == 400
    bad = client.post("/api/auth/login", json={"email": "test@studio.example", "password": "wrong"})
    assert bad.status_code == 401


def test_checkout_requires_auth(client):
    r = client.post("/api/store/checkout", json={"items": [{"product_id": 1, "qty": 1}]})
    assert r.status_code == 401


def test_checkout_flow(client):
    r = client.post("/api/auth/register", json={"name": "Buyer", "email": "buyer@studio.example", "password": "secret123"})
    token = r.json()["access_token"]
    products = client.get("/api/store/products").json()
    art_book = next(p for p in products if p["name"] == "Behind-the-Scenes Art Book")
    r = client.post(
        "/api/store/checkout",
        json={"items": [{"product_id": art_book["id"], "qty": 2}]},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert r.status_code == 201
    order = r.json()
    assert order["total"] == 64.0
    assert len(order["items"]) == 1


def test_checkout_rejects_out_of_stock_items(client):
    r = client.post("/api/auth/register", json={"name": "Stock Tester", "email": "stock@studio.example", "password": "secret123"})
    token = r.json()["access_token"]
    products = client.get("/api/store/products").json()
    commentary = next(p for p in products if p["name"] == "Director's Commentary Bundle")
    r = client.post(
        "/api/store/checkout",
        json={"items": [{"product_id": commentary["id"], "qty": 1}]},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert r.status_code == 400
    assert "out of stock" in r.json()["detail"].lower()
