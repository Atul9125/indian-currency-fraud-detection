import os
import shutil
import numpy as np
from fastapi import FastAPI, Request, File, UploadFile
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse, JSONResponse
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image

app = FastAPI(title="Satya - Fake Currency Verifier")

# ---- Static & templates ----
UPLOAD_FOLDER = os.path.join("static", "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

# ---- Load the trained model once at startup ----
MODEL_PATH = "fake_currency_model.h5"
model = load_model(MODEL_PATH)

# Class order used during training: ['fake', 'real'] (alphabetical, from image_dataset_from_directory)
CLASS_NAMES = ["fake", "real"]
IMG_SIZE = (224, 224)
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg"}


def allowed_file(filename: str) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def prepare_image(img_path: str) -> np.ndarray:
    img = image.load_img(img_path, target_size=IMG_SIZE)
    arr = image.img_to_array(img)
    arr = np.expand_dims(arr, axis=0)  # model has its own Rescaling(1./255) layer built in
    return arr


@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if not file.filename:
        return JSONResponse({"error": "No file selected"}, status_code=400)

    if not allowed_file(file.filename):
        return JSONResponse({"error": "Only png, jpg, jpeg files are allowed"}, status_code=400)

    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        img_array = prepare_image(filepath)
        prediction = model.predict(img_array)[0][0]  # sigmoid output, 0=fake, 1=real

        label = CLASS_NAMES[1] if prediction >= 0.5 else CLASS_NAMES[0]
        confidence = float(prediction) if prediction >= 0.5 else float(1 - prediction)

        return {
            "label": label,
            "confidence": round(confidence * 100, 2),
            "image_url": "/" + filepath.replace("\\", "/")
        }
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)
