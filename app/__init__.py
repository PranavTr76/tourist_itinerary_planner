from flask import Flask, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from config import Config
import os

db = SQLAlchemy()

def create_app(config_class=Config):
    app = Flask(__name__, static_folder='../../frontend/build')
    app.config.from_object(config_class)
    CORS(app)
    
    db.init_app(app)
    
    from app.routes.itinerary import itinerary_blueprint
    app.register_blueprint(itinerary_blueprint, url_prefix='/api')

    # Serve React App
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve(path):
        if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
            return send_from_directory(app.static_folder, path)
        else:
            return send_from_directory(app.static_folder, 'index.html')
    
    return app
