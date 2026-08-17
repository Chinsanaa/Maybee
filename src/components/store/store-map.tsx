"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Landmark, LandmarkCategory } from "@/lib/business-info";

const LANDMARK_LABELS: Record<LandmarkCategory, { mn: string; en: string }> = {
  mall: { mn: "Худалдааны төв", en: "Mall" },
  shop: { mn: "Дэлгүүр", en: "Shop" },
  landmark: { mn: "Ориентир", en: "Landmark" },
  transit: { mn: "Тээврийн зогсоол", en: "Transit" },
};

function pinIcon(color: string, size: number) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size * 1.3}" viewBox="0 0 24 32">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 20 12 20s12-11 12-20c0-6.627-5.373-12-12-12z" fill="${color}"/>
      <circle cx="12" cy="12" r="5" fill="white"/>
    </svg>`;
  return L.divIcon({
    html: svg,
    className: "",
    iconSize: [size, size * 1.3],
    iconAnchor: [size / 2, size * 1.3],
    popupAnchor: [0, -size],
  });
}

const storeIcon = pinIcon("#f40009", 36);
const landmarkIcon = pinIcon("#171717", 26);

function FitBounds({ points }: { points: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length > 1) {
      map.fitBounds(points, { padding: [40, 40] });
    } else if (points.length === 1) {
      map.setView(points[0], 16);
    }
  }, [map, points]);
  return null;
}

export function StoreMap({
  storeLat,
  storeLng,
  storeName,
  landmarks,
  locale,
}: {
  storeLat: number;
  storeLng: number;
  storeName: string;
  landmarks: Landmark[];
  locale: string;
}) {
  const points: [number, number][] = [
    [storeLat, storeLng],
    ...landmarks.map((l): [number, number] => [l.latitude, l.longitude]),
  ];

  return (
    <MapContainer
      center={[storeLat, storeLng]}
      zoom={16}
      scrollWheelZoom={false}
      className="h-full min-h-64 w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds points={points} />
      <Marker position={[storeLat, storeLng]} icon={storeIcon}>
        <Popup>{storeName}</Popup>
      </Marker>
      {landmarks.map((l, i) => {
        const name = locale === "en" && l.name_en ? l.name_en : l.name_mn;
        const category = locale === "en" ? LANDMARK_LABELS[l.category].en : LANDMARK_LABELS[l.category].mn;
        return (
          <Marker key={i} position={[l.latitude, l.longitude]} icon={landmarkIcon}>
            <Popup>
              <span className="font-semibold">{name}</span>
              <br />
              <span className="text-xs text-brand-gray">{category}</span>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
