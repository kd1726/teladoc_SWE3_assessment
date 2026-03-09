from pydantic import BaseModel, Field

class AuthRequest(BaseModel):
    username: str = Field(min_length=1, max_length=20)
    password: str = Field(min_length=5)

class AuthTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"