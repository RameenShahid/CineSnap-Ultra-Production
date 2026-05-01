from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware
from rembg import remove
import uvicorn
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="CineSnap AI Service",
    description="Ultra-advanced background removal using U²-Net",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "status": "healthy",
        "service": "CineSnap AI",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/health")
async def health():
    return {"status": "ok", "timestamp": datetime.now().isoformat()}

@app.post("/remove")
async def remove_background(file: UploadFile = File(...)):
    """
    Remove background from uploaded image using U²-Net AI model
    """
    try:
        # Validate file type
        if not file.content_type or not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read file
        input_bytes = await file.read()
        
        # Check file size
        if len(input_bytes) > 12 * 1024 * 1024:  # 12MB limit
            raise HTTPException(status_code=400, detail="File too large (max 12MB)")
        
        logger.info(f"Processing image: {file.filename}, size: {len(input_bytes)} bytes")
        
        # Remove background using rembg
        output_bytes = remove(input_bytes)
        
        logger.info(f"Successfully processed image: {file.filename}")
        
        # Return as PNG
        return Response(
            content=output_bytes,
            media_type="image/png",
            headers={
                "Content-Disposition": f"attachment; filename=no_bg_{file.filename}.png",
                "X-Processed-By": "CineSnap-AI",
                "X-Processing-Time": str(datetime.now().timestamp())
            }
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing image: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")

@app.post("/remove-batch")
async def remove_background_batch(files: list[UploadFile] = File(...)):
    """
    Batch background removal (max 5 images)
    """
    if len(files) > 5:
        raise HTTPException(status_code=400, detail="Maximum 5 images per batch")
    
    results = []
    for file in files:
        try:
            input_bytes = await file.read()
            output_bytes = remove(input_bytes)
            import base64
            encoded = base64.b64encode(output_bytes).decode('utf-8')
            results.append({
                "filename": file.filename,
                "image": f"data:image/png;base64,{encoded}",
                "success": True
            })
        except Exception as e:
            results.append({
                "filename": file.filename,
                "success": False,
                "error": str(e)
            })
    
    return {"results": results}

if __name__ == "__main__":
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )