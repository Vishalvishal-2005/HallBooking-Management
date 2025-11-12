import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from main import app
from database import Base, get_db

# Use in-memory SQLite for tests
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create all tables
Base.metadata.create_all(bind=engine)

# Override dependency
def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)


# ---------- BASIC TESTS ----------

def test_root():
    res = client.get("/")
    assert res.status_code == 200
    data = res.json()
    assert data["message"] == "Welcome to Hall Booking System API"


def test_health_check():
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json()["status"] == "healthy"


# ---------- AUTH TESTS ----------

def test_signup_and_login():
    # Sign up a hall owner
    signup_res = client.post(
        "/api/v1/auth/signup",
        json={
            "username": "owner1",
            "email": "owner1@example.com",
            "password": "Owner@123",
            "full_name": "Owner One",
            "role": "OWNER"
        },
    )
    assert signup_res.status_code in [200, 201]
    assert "User registered successfully" in signup_res.text

    # Login as hall owner
    login_res = client.post(
        "/api/v1/auth/login",
        json={"username": "owner1", "password": "Owner@123"},
    )
    assert login_res.status_code == 200
    data = login_res.json()
    assert "access_token" in data
    global TOKEN
    TOKEN = data["access_token"]


# ---------- HALL TESTS ----------

def test_create_hall():
    headers = {"Authorization": f"Bearer {TOKEN}"}
    payload = {
        "name": "Royal Palace Banquet Hall",
        "location": "Chennai, Tamil Nadu",
        "capacity": 300,
        "price_per_hour": 2500,
        "description": "Spacious AC hall ideal for weddings and events.",
        "amenities": ["Parking", "Stage", "Catering"]
    }
    res = client.post("/api/v1/halls", headers=headers, json=payload)
    assert res.status_code in [200, 201]
    data = res.json()
    assert data["name"] == "Royal Palace Banquet Hall"
    global HALL_ID
    HALL_ID = data["id"]


def test_get_hall_by_id():
    res = client.get(f"/api/v1/halls/{HALL_ID}")
    assert res.status_code == 200
    assert res.json()["id"] == HALL_ID


def test_search_halls():
    res = client.get("/api/v1/halls/search?city=Chennai")
    assert res.status_code == 200
    assert isinstance(res.json(), list)


# ---------- BOOKING TESTS ----------

def test_booking_creation():
    headers = {"Authorization": f"Bearer {TOKEN}"}
    payload = {
        "hall_id": HALL_ID,
        "date": "2025-12-15",
        "start_time": "10:00",
        "end_time": "16:00"
    }
    res = client.post("/api/v1/bookings", headers=headers, json=payload)
    assert res.status_code in [200, 201]
    data = res.json()
    assert data["hall_id"] == HALL_ID
    assert data["status"] in ["PENDING", "CONFIRMED"]
