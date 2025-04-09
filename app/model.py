from app import db
from datetime import datetime

class ItineraryRequest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    prompt_text = db.Column(db.String(500), nullable=False)
    location = db.Column(db.String(100), nullable=False)
    travel_dates = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    itineraries = db.relationship('Itinerary', backref='request', lazy=True)

class Itinerary(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    request_id = db.Column(db.Integer, db.ForeignKey('itinerary_request.id'))
    day_number = db.Column(db.Integer)
    activities = db.Column(db.JSON)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
