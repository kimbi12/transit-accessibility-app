# backend/main.py
# FastAPI Application Entry Point for Transit Accessibility App

# Purpose: Provides REST API endpoints for:
#   - Route planning with accessibility considerations
#   - Eco-friendly transit impact tracking
#   - Accessibility alerts and information
#   - User engagement through gamification (points/badges)
#   - AI-powered vision analysis for accessibility hazards
#   - Speech-to-text interpretation and chat synthesis

import os
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional

# Load environment variables from .env file
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass  # dotenv is optional

# Import routers from route modules
from routes import health, climate, accessibility, routing, users, carbon_intensity, hazards, education, maps, assistant

# Import services for controller logic
from services.chat_service import ChatService
from services.transit_service import TransitService
from services.vision_service import VisionService
from services.climate_service import ClimateEngine



# FastAPI Application Initialization

app = FastAPI(
    title="Inclusive Transit API",
    description="Accessibility-first transit API supporting wheelchair users, visually impaired, and hearing impaired individuals",
    version="1.0.0"
)

# Initialize service instances (available globally for controller logic)
chat_service = ChatService()
transit_service = TransitService()
vision_service = VisionService()
climate_engine = ClimateEngine()

# Configure CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # TODO: Restrict to frontend domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Register Routers

# Health check endpoints
app.include_router(health.router)

# Climate impact and gamification endpoints
app.include_router(climate.router)

# Accessibility information endpoints
app.include_router(accessibility.router)

# Route planning endpoints
app.include_router(routing.router)

# User engagement endpoints
app.include_router(users.router)

app.include_router(carbon_intensity.router)

app.include_router(hazards.router)

app.include_router(education.router)

app.include_router(maps.router)

app.include_router(assistant.router)

# ============================================================
# AI-Powered Endpoints (Vision & Chat Services)
# ============================================================

# Pydantic models for AI endpoints
class ImageAnalysisResponse(BaseModel):
    """Response from image analysis"""
    description: Optional[str] = None
    hazards: Optional[list] = None
    safe_for_wheelchair: Optional[bool] = None
    accessibility_score: Optional[int] = None
    raw_analysis: Optional[str] = None
    error: Optional[str] = None


class SpeechInterpretRequest(BaseModel):
    """Request model for speech interpretation"""
    text: str = Field(..., min_length=1, description="Messy speech-to-text input")


class SpeechInterpretResponse(BaseModel):
    """Response model for speech interpretation"""
    corrected_destination: str
    original_text: str


class ChatSynthesisRequest(BaseModel):
    """Request model for chat synthesis"""
    transit: str = Field(..., description="Transit information (e.g., 'Bus 504, 15 mins')")
    climate: str = Field(..., description="Climate impact info (e.g., '0.4kg CO2 saved')")
    vision: str = Field(..., description="Vision/safety info (e.g., 'Ramp Detected: True')")


class ChatSynthesisResponse(BaseModel):
    """Response model for chat synthesis"""
    message: str


@app.post("/api/vision/analyze", response_model=ImageAnalysisResponse, tags=["AI Services"])
async def analyze_transit_image(file: UploadFile = File(...)):
    """
    Analyze an image of a transit station for accessibility hazards
    
    **Functionality:**
    - Uses Gemini Vision AI to analyze uploaded images
    - Identifies hazards like snow, broken elevators, uneven pavement
    - Provides wheelchair accessibility assessment
    - Returns accessibility score (1-10)
    
    **Parameters:**
    - file: Image file (JPEG, PNG) of transit station or bus stop
    
    **Returns:**
    - description: One sentence summary of the image
    - hazards: List of identified accessibility issues
    - safe_for_wheelchair: Boolean indicating wheelchair accessibility
    - accessibility_score: Rating from 1-10
    
    **Note:** Requires GEMINI_API_KEY in environment
    """
    try:
        # Read image bytes
        image_bytes = await file.read()
        
        # Validate file is not empty
        if not image_bytes:
            raise HTTPException(status_code=400, detail="Uploaded file is empty")
        
        # Analyze using Vision Service
        result = vision_service.analyze_image(image_bytes)
        
        return result
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to analyze image: {str(e)}"
        )


@app.post("/api/chat/interpret-speech", response_model=SpeechInterpretResponse, tags=["AI Services"])
async def interpret_speech_to_destination(request: SpeechInterpretRequest):
    """
    Interpret messy speech-to-text input into a clean destination name
    
    **Functionality:**
    - Uses Gemini AI to correct speech recognition errors
    - Converts "Onion Station" → "Union Station"
    - Handles stutters, mispronunciations, and unclear audio
    
    **Parameters:**
    - text: Raw speech-to-text output that needs correction
    
    **Returns:**
    - corrected_destination: Clean, properly formatted destination name
    - original_text: The original messy input for reference
    
    **Example:**
    ```json
    {
        "text": "I want to go to... un... un... onion station"
    }
    ```
    
    **Note:** Requires GEMINI_API_KEY in environment
    """
    try:
        corrected = chat_service.interpret_destination(request.text)
        
        return SpeechInterpretResponse(
            corrected_destination=corrected,
            original_text=request.text
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to interpret speech: {str(e)}"
        )


@app.post("/api/chat/synthesize", response_model=ChatSynthesisResponse, tags=["AI Services"])
async def synthesize_trip_message(request: ChatSynthesisRequest):
    """
    Synthesize a user-friendly message from transit, climate, and vision data
    
    **Functionality:**
    - Uses Gemini AI to create natural, friendly trip summaries
    - Combines route info, environmental impact, and safety data
    - Enthusiastically mentions CO2 savings
    - Gently warns about accessibility hazards if detected
    
    **Parameters:**
    - transit: Transit information (e.g., "Bus 504, 15 mins away")
    - climate: Climate impact data (e.g., "0.4kg CO2 saved")
    - vision: Vision/accessibility data (e.g., "Ramp Detected: True")
    
    **Returns:**
    - message: A friendly, synthesized sentence for the user
    
    **Example:**
    ```json
    {
        "transit": "Bus 504, 15 mins away",
        "climate": "0.4kg CO2 saved",
        "vision": "Ramp Detected: True"
    }
    ```
    
    **Note:** Requires GEMINI_API_KEY in environment
    """
    try:
        message = chat_service.synthesize(
            request.transit,
            request.climate,
            request.vision
        )
        
        return ChatSynthesisResponse(message=message)
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to synthesize message: {str(e)}"
        )


# ============================================================
# Main Entry Point
# ============================================================

if __name__ == "__main__":
    import uvicorn
    
    # Run the application with: uvicorn main:app --reload
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        reload=True
    )
