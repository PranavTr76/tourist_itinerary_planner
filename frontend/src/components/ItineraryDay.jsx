import React from 'react';
import { FaMapMarkerAlt, FaClock, FaUtensils, FaHotel, FaCamera } from 'react-icons/fa';
import './ItineraryDay.css';

const ItineraryDay = ({ day, dayNumber }) => {
  return (
    <div className="itinerary-day fade-in">
      <div className="day-header">
        <h2>Day {dayNumber}</h2>
        <div className="day-summary">
          <span><FaClock /> {day.total_hours} hours</span>
          <span><FaMapMarkerAlt /> {day.locations.length} locations</span>
        </div>
      </div>

      <div className="timeline">
        {day.activities.map((activity, index) => (
          <div key={index} className="timeline-item">
            <div className="timeline-marker">
              <div className="marker-icon">
                {activity.type === 'meal' ? <FaUtensils /> : 
                 activity.type === 'hotel' ? <FaHotel /> : <FaCamera />}
              </div>
              <div className="timeline-line"></div>
            </div>
            <div className="timeline-content">
              <div className="activity-time">
                {activity.start_time} - {activity.end_time}
              </div>
              <h3>{activity.name}</h3>
              <p>{activity.description}</p>
              {activity.location && (
                <div className="activity-location">
                  <FaMapMarkerAlt /> {activity.location}
                </div>
              )}
              {activity.travel_time && (
                <div className="travel-time">
                  <FaClock /> {activity.travel_time} travel
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItineraryDay;
