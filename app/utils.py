import http.client
import json
import os
from typing import Dict, Union

def generate_itinerary(prompt: str, location: str, days: int) -> Dict[str, Union[dict, str]]:
    """
    Generates an itinerary using the AI Trip Planner API
    Args:
        prompt: User's interests/description
        location: Destination location
        days: Number of days for itinerary
    Returns:
        Dictionary containing the generated itinerary or error message
    """
    conn = http.client.HTTPSConnection("ai-trip-planner.p.rapidapi.com")
    
    payload = json.dumps({
        "days": days,
        "destination": location,
        "interests": prompt.split(","),
        "budget": "medium",
        "travelMode": "public transport"
    })
    
    headers = {
        'x-rapidapi-key': os.getenv('RAPIDAPI_KEY'),
        'x-rapidapi-host': "ai-trip-planner.p.rapidapi.com",
        'Content-Type': "application/json"
    }
    
    try:
        conn.request("POST", "/detailed-plan", payload, headers)
        res = conn.getresponse()
        if res.status != 200:
            return {"error": f"API request failed with status {res.status}"}
        data = json.loads(res.read().decode("utf-8"))
        return data
    except json.JSONDecodeError as e:
        return {"error": f"Invalid API response: {str(e)}"}
    except http.client.HTTPException as e:
        return {"error": f"HTTP error occurred: {str(e)}"}
    except Exception as e:
        return {"error": f"Unexpected error: {str(e)}"}
