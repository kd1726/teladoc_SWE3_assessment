from fastapi import FastAPI


router = FastAPI()

@app.get("/health")
def health():
  pass