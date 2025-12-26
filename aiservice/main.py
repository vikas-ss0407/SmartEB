from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import JSONResponse
from utils.ocr import extract_meter_reading
from utils.classifier import validate_image
import io

app = FastAPI(title="EB Meter AI Validation Service")

@app.post("/validate-meter")
async def validate_meter(
    image: UploadFile = File(...),
    user_reading: str = Form(...)
):
    image_bytes = await image.read()
    image_stream = io.BytesIO(image_bytes)

    ocr_reading = extract_meter_reading(image_stream)

    image_stream.seek(0)
    is_valid_image = validate_image(image_stream)

    if not ocr_reading:
        return JSONResponse(
            status_code=400,
            content={"status": "INVALID", "reason": "OCR failed"}
        )

    if ocr_reading != user_reading:
        return JSONResponse(
            status_code=400,
            content={
                "status": "INVALID",
                "reason": "Meter reading mismatch",
                "ocr_value": ocr_reading
            }
        )

    if not is_valid_image:
        return JSONResponse(
            status_code=400,
            content={"status": "INVALID", "reason": "Image validation failed"}
        )

    return {
        "status": "VALID",
        "meter_reading": ocr_reading
    }
