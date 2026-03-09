import uuid
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from Models.tenants_model import TenantsDB
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def seed_data():
    db: Session = SessionLocal()
    
    db.query(TenantsDB).delete()

    users_to_create = [
        {"username": "admin", "password": "admin_password", "role": "admin", "quota": 10000},

        {"username": "tenant1", "password": "password123", "role": "tenant", "quota": 1000},
        {"username": "tenant2", "password": "password123", "role": "tenant", "quota": 1000},
        {"username": "tenant3", "password": "password123", "role": "tenant", "quota": 2000},
        {"username": "tenant4", "password": "password123", "role": "tenant", "quota": 500},
        {"username": "tenant5", "password": "password123", "role": "tenant", "quota": 1000},
    ]

    for user_data in users_to_create:
      password=user_data["password"].strip()

      if not isinstance(password, str):
        print(f"Warning: password for {user_data['username']} is not a string!")
        password = str(password_to_hash)

      hashed = pwd_context.hash(password)

      new_user = TenantsDB(
          tenant_id=uuid.uuid4(),
          username=user_data["username"],
          password_hash=hashed,
          role=user_data["role"],
          monthly_quota=user_data["quota"]
      )
      db.add(new_user)

    db.commit()
    print(f"Successfully seeded {len(users_to_create)} users!")
    db.close()

if __name__ == "__main__":
    seed_data()