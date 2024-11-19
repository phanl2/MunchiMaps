import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; // Import Leaflet's CSS
import './styles/MapStyles.css'; // Optional custom styles for the map

const MapComponent = () => {
  const mapContainerRef = useRef(null); // Ref to the map container
  const currentMarker = useRef(null); // To store the current marker

  useEffect(() => {
    // Initialize the map after component mounts
    const map = L.map(mapContainerRef.current).setView([42.72941085967446, -73.6792590320996], 17);

    // Tile layer for the map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      detectRetina: true,
      maxZoom: 50,
    }).addTo(map);

    // Custom location dot icon
    const locationDot = L.divIcon({
      className: 'custom-icon',
      html: '<div class="location-circle"></div><div class="location-dot"></div>',
      iconSize: [40, 40],
      iconAnchor: [1, 3],
    });

    // Handle location found
    const onLocationFound = (e) => {
      if (currentMarker.current) {
        map.removeLayer(currentMarker.current); // Remove the old marker
      }

      // Add new marker for the location
      currentMarker.current = L.marker(e.latlng, { icon: locationDot })
        .addTo(map)
        .bindPopup('<div class="location-text">You are here</div>')
        .openPopup();
      map.setView(e.latlng, 18); // Center the map on user's location
    };

    // Handle location error
    const onLocationError = (e) => {
      alert(e.message); // Show error message if location can't be found
    };

    // Start locating user's position
    map.locate({ setView: true, maxZoom: 18 }).on('locationfound', onLocationFound).on('locationerror', onLocationError);

    // Cleanup when the component unmounts
    return () => {
      map.remove(); // Clean up the map instance
    };
  }, []); // Empty dependency array means this effect runs only once (on mount)

  return <div id="map" ref={mapContainerRef} style={{ height: '100vh' }}></div>;
};

export default MapComponent;
