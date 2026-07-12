import React from "react";
import { Clock, MapPin, Navigation } from "lucide-react";

export interface Trip {
  id: string;
  source: string;
  destination: string;
  status: string;
  statusColor: string;
  vehicleDriver: string;
  time: string;
}

interface LiveBoardProps {
  trips: Trip[];
}

export function LiveBoard({ trips }: LiveBoardProps) {
  return (
    <div className="bg-surface rounded-xl border border-border shadow-sm flex flex-col h-full overflow-hidden">
      <div className="p-5 border-b border-border flex justify-between items-center bg-gray-50">
        <h2 className="text-sm font-bold text-primary-text uppercase tracking-wider flex items-center gap-2">
          <Navigation className="w-4 h-4 text-primary" /> Live Board
        </h2>
      </div>
      
      <div className="p-5 flex flex-col gap-4 flex-1 overflow-y-auto">
        {trips.map((trip) => (
          <div key={trip.id} className="border border-border rounded-lg p-4 hover:border-primary/50 transition-colors shadow-sm flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-sm font-bold text-primary-text">{trip.id}</span>
                <div className="flex items-center gap-2 text-sm text-secondary-text mt-1">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>{trip.source} <span className="mx-1 text-gray-300">→</span> {trip.destination}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-secondary-text uppercase tracking-wider block">{trip.vehicleDriver}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-2 pt-3 border-t border-gray-100">
              <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${trip.statusColor}`}>
                {trip.status}
              </span>
              <span className="text-xs font-medium text-secondary-text flex items-center gap-1.5">
                {trip.status === "Dispatched" ? <Clock className="w-3.5 h-3.5" /> : null}
                {trip.time}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-border bg-gray-50 text-center">
        <p className="text-xs font-medium text-secondary-text">
          On Complete: odometer → fuel log → expenses → Vehicle & Driver Available
        </p>
      </div>
    </div>
  );
}
