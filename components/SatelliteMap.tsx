'use client';

import { useEffect, useState } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

interface SatelliteMapProps {
  address: string;
  apiKey: string;
}

const mapContainerStyle = {
  width: '100%',
  height: '500px',
};

const mapOptions = {
  mapTypeId: 'satellite' as google.maps.MapTypeId,
  zoom: 18,
  tilt: 0,
  mapTypeControl: true,
  streetViewControl: false,
  fullscreenControl: true,
};

export default function SatelliteMap({ address, apiKey }: SatelliteMapProps) {
  const [center, setCenter] = useState<google.maps.LatLngLiteral>({ lat: 0, lng: 0 });
  const [error, setError] = useState<string | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
  });

  useEffect(() => {
    if (!isLoaded) return;

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const location = results[0].geometry.location;
        setCenter({
          lat: location.lat(),
          lng: location.lng(),
        });
      } else {
        setError('Unable to locate address on map');
      }
    });
  }, [address, isLoaded]);

  if (loadError) {
    return (
      <div className="bg-[#F5F5F5] rounded-lg p-8 text-center">
        <p className="text-[#9FA38F]">Error loading maps</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="bg-[#F5F5F5] rounded-lg p-8 text-center animate-pulse">
        <p className="text-[#9FA38F]">Loading map...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#F5F5F5] rounded-lg p-8 text-center">
        <p className="text-[#9FA38F]">{error}</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg overflow-hidden shadow-lg" data-satellite-map>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        options={mapOptions}
      >
        {/* Marker at center */}
      </GoogleMap>
    </div>
  );
}
