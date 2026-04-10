import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with Webpack/Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const BirthdayMap: React.FC = () => {
  const guangzhou: [number, number] = [23.1291, 113.2644];
  const shantou: [number, number] = [23.3540, 116.6631];
  const center: [number, number] = [23.2415, 114.9637]; // Midpoint approx

  return (
    <div className="h-64 w-full rounded-2xl overflow-hidden shadow-inner border border-pink-100">
      <MapContainer 
        center={center} 
        zoom={6} 
        scrollWheelZoom={false} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={guangzhou}>
          <Popup>
            <div className="text-center">
              <span className="font-bold text-pink-600">广州</span>
              <br />
              学习工作的地方 🎓
            </div>
          </Popup>
        </Marker>
        <Marker position={shantou}>
          <Popup>
            <div className="text-center">
              <span className="font-bold text-pink-600">汕头</span>
              <br />
              琦琦出生的地方 🏠
            </div>
          </Popup>
        </Marker>
        <Polyline 
          positions={[guangzhou, shantou]} 
          color="#ec4899" 
          dashArray="5, 10"
          weight={2}
        />
      </MapContainer>
    </div>
  );
};

export default BirthdayMap;
