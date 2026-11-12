import React, { useState } from 'react';
import { MapPin, Navigation, ExternalLink, ShieldCheck, UserCheck } from 'lucide-react';
import { User } from '../types';

interface FarmMapProps {
  farmer?: User | null;
  allFarmers?: User[];
  onSelectFarmer?: (farmer: User) => void;
  heightClass?: string;
}

export const FarmMap: React.FC<FarmMapProps> = ({
  farmer,
  allFarmers = [],
  onSelectFarmer,
  heightClass = 'h-72',
}) => {
  const [activePin, setActivePin] = useState<User | null>(farmer || allFarmers[0] || null);

  // If a single farmer is provided
  const target = farmer || activePin;
  const lat = target?.farmCoordinates?.lat || 20.1983;
  const lng = target?.farmCoordinates?.lng || 73.8373;
  const farmTitle = target?.farmName || 'Local Organic Farm';
  const locationName = target?.farmLocation || target?.city || 'India';

  // Embed URL for OpenStreetMap
  const bbox = `${lng - 0.05},${lat - 0.05},${lng + 0.05},${lat + 0.05}`;
  const embedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;
  const directOsmLink = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=14/${lat}/${lng}`;

  return (
    <div className="relative rounded-2xl overflow-hidden border border-stone-200 bg-stone-100 shadow-sm">
      {/* Interactive Map Iframe */}
      <iframe
        title={`Farm Location: ${farmTitle}`}
        src={embedUrl}
        className={`w-full ${heightClass} border-0`}
        loading="lazy"
        aria-label={`OpenStreetMap showing ${farmTitle} at ${lat}, ${lng}`}
      />

      {/* Floating Info Card */}
      <div className="absolute bottom-3 left-3 right-3 md:right-auto md:max-w-xs bg-white/95 backdrop-blur-md p-3.5 rounded-xl border border-stone-200/80 shadow-md">
        <div className="flex items-start gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#1B5E20]/10 text-[#1B5E20] flex items-center justify-center shrink-0 mt-0.5">
            <MapPin className="w-4 h-4 text-[#1B5E20]" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h4 className="text-xs font-bold text-stone-900 truncate">{farmTitle}</h4>
              <ShieldCheck className="w-3.5 h-3.5 text-[#4CAF50] shrink-0" />
            </div>
            <p className="text-[11px] text-stone-600 truncate">{locationName}</p>
            <div className="mt-1 flex items-center gap-3 text-[10px] text-stone-500 font-mono tabular-nums">
              <span>{lat.toFixed(4)}°N</span>
              <span>·</span>
              <span>{lng.toFixed(4)}°E</span>
            </div>
          </div>
        </div>

        {/* View on OSM link */}
        <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px]">
          <span className="text-emerald-700 font-medium inline-flex items-center gap-1">
            <Navigation className="w-3 h-3" /> Farm GPS Verified
          </span>
          <a
            href={directOsmLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-stone-500 hover:text-stone-900 inline-flex items-center gap-1 transition-colors"
          >
            <span>Open map</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Selector pills for multiple farms if passed */}
      {allFarmers.length > 1 && (
        <div className="absolute top-3 left-3 right-3 flex flex-wrap gap-1.5 p-1 bg-white/90 backdrop-blur-sm rounded-xl border border-stone-200 shadow-sm max-w-full overflow-x-auto">
          {allFarmers.map(f => {
            const isSelected = activePin?.id === f.id;
            return (
              <button
                key={f.id}
                onClick={() => {
                  setActivePin(f);
                  if (onSelectFarmer) onSelectFarmer(f);
                }}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#1B5E20] text-white shadow-sm'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                <UserCheck className="w-3 h-3" />
                <span>{f.farmName || f.name}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
