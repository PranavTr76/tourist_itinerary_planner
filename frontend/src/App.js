import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';
import ItineraryDay from './components/ItineraryDay';
import LocationGallery from './components/LocationGallery';
import ItineraryForm from './components/ItineraryForm';

function App() {
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [activeDay, setActiveDay] = useState(0);

  const generateItinerary = async (data) => {
    setLoading(true);
    try {
      const response = await fetch(process.env.REACT_APP_API_URL || 'http://localhost:5000/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate itinerary');
      }
      
      const result = await response.json();
      
      // Transform API response to match frontend expectations
      const transformed = {
        days: Object.entries(result.itinerary).map(([day, activities]) => ({
          activities,
          locations: activities.map(a => a.location).filter(Boolean),
          total_hours: activities.reduce((sum, a) => sum + (a.duration || 0), 0)
        }))
      };
      
      setItinerary(transformed);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate itinerary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`app ${darkMode ? 'dark' : 'light'}`}>
      <header>
        <h1>Travel Itinerary Planner</h1>
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </header>
      
      <main>
        {!itinerary ? (
          <ItineraryForm onSubmit={generateItinerary} loading={loading} />
        ) : (
          <div className="itinerary-container">
            <div className="map-view">
              <MapContainer center={[51.505, -0.09]} zoom={13}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {/* Markers will be added dynamically */}
              </MapContainer>
            </div>
            
            <div className="itinerary-details">
              <div className="day-selector">
                {Array.from({ length: itinerary.days }).map((_, i) => (
                  <button 
                    key={i} 
                    className={i === activeDay ? 'active' : ''}
                    onClick={() => setActiveDay(i)}
                  >
                    Day {i + 1}
                  </button>
                ))}
              </div>
              
              <ItineraryDay 
                day={itinerary.days[activeDay]} 
                dayNumber={activeDay + 1} 
              />
              
              <LocationGallery locations={itinerary.days[activeDay].locations} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
