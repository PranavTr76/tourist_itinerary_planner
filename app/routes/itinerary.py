from flask import Blueprint, request, jsonify
from app.model import ItineraryRequest, Itinerary
from app import db
from datetime import datetime
from app.utils import generate_itinerary

itinerary_bp = Blueprint('itinerary', __name__)

# Export the blueprint
itinerary_blueprint = itinerary_bp

@itinerary_bp.route('/test', methods=['GET'])
def test_route():
    return jsonify({"status": "success", "message": "API is working"})

@itinerary_bp.route('/suggest', methods=['POST'])
def suggest_itinerary():
    data = request.get_json()
    
    # Create new itinerary request
    new_request = ItineraryRequest(
        prompt_text=data.get('prompt'),
        location=data.get('location'),
        travel_dates=data.get('dates')
    )
    db.session.add(new_request)
    db.session.commit()
    
    try:
        # Generate itinerary
        itinerary = generate_itinerary(
            prompt=data.get('prompt'),
            location=data.get('location'),
            days=3  # Default - implement date parsing later
        )
        
        # Save itinerary to database
        for day, activities in itinerary.items():
            db.session.add(Itinerary(
                request_id=new_request.id,
                day_number=int(day[3:]),  # Convert 'day1' to 1
                activities=activities
            ))
        db.session.commit()
        
        return jsonify({
            "status": "success",
            "itinerary": itinerary,
            "request_id": new_request.id
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500
