import React, { createContext, useState, useContext, useEffect } from 'react';
import './MapModal.css';

const MapModalContext = createContext();

export const useMapModal = () => useContext(MapModalContext);

export const MapModalProvider = ({ children }) => {
  const [place, setPlace] = useState(null);
  const [wikiData, setWikiData] = useState({ description: '', image: '' });
  const [loading, setLoading] = useState(false);

  const showMap = (placeName) => {
    setPlace(placeName);
    setLoading(true);
    
    // Extract search term (e.g., "Taj Mahal, Agra" -> "Taj Mahal")
    const searchTerm = placeName.split(',')[0].trim();
    
    fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(searchTerm)}`)
      .then(res => res.json())
      .then(data => {
        setWikiData({
          description: data.extract || '',
          image: data.thumbnail ? data.thumbnail.source : ''
        });
        setLoading(false);
      })
      .catch(err => {
        console.error('Wiki fetch error', err);
        setWikiData({ description: 'Detailed information is not available for this location.', image: '' });
        setLoading(false);
      });
  };

  const closeModal = () => {
    setPlace(null);
    setWikiData({ description: '', image: '' });
  };

  return (
    <MapModalContext.Provider value={{ showMap }}>
      {children}
      
      {place && (
        <div className="global-map-overlay animate-fadeIn" onClick={closeModal}>
          <div className="global-map-modal animate-fadeInUp" onClick={(e) => e.stopPropagation()}>
            <button className="global-close-modal" onClick={closeModal}>×</button>
            <div className="global-modal-header">
              <h2>{place}</h2>
            </div>
            
            <div className="global-modal-body">
              {loading ? (
                <div className="global-map-loading"><span className="spinner" /></div>
              ) : (
                <div className="global-wiki-content">
                  {wikiData.image && <img src={wikiData.image} alt={place} className="global-wiki-image" />}
                  <p>{wikiData.description || 'Explore this beautiful location.'}</p>
                </div>
              )}
              
              <div className="global-iframe-container">
                <iframe
                  title={`${place} Map`}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(place)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      )}
    </MapModalContext.Provider>
  );
};
