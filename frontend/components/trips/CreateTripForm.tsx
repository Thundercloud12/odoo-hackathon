import React from "react";
import { AlertCircle, X } from "lucide-react";

interface CreateTripFormProps {
  source: string;
  setSource: (val: string) => void;
  destination: string;
  setDestination: (val: string) => void;
  vehicle: string;
  setVehicle: (val: string) => void;
  driver: string;
  setDriver: (val: string) => void;
  weight: string;
  setWeight: (val: string) => void;
  distance: string;
  setDistance: (val: string) => void;
}

export function CreateTripForm({
  source, setSource,
  destination, setDestination,
  vehicle, setVehicle,
  driver, setDriver,
  weight, setWeight,
  distance, setDistance
}: CreateTripFormProps) {
  return (
    <div className="bg-surface rounded-xl border border-border shadow-sm flex flex-col">
      <div className="p-5 border-b border-border">
        <h2 className="text-sm font-bold text-primary-text uppercase tracking-wider">Create Trip</h2>
      </div>
      
      <div className="p-5 flex flex-col gap-4">
        <div className="space-y-1">
          <label className="text-xs font-medium text-secondary-text uppercase">Source</label>
          <input 
            type="text" 
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-secondary-text uppercase">Destination</label>
          <input 
            type="text" 
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-secondary-text uppercase">Vehicle (Available Only)</label>
          <select 
            value={vehicle}
            onChange={(e) => setVehicle(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white"
          >
            <option value="VAN-05 - 500 kg capacity">VAN-05 - 500 kg capacity</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-secondary-text uppercase">Driver (Available Only)</label>
          <select 
            value={driver}
            onChange={(e) => setDriver(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white"
          >
            <option value="Alex">Alex</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-secondary-text uppercase">Cargo Weight (kg)</label>
          <input 
            type="number" 
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-secondary-text uppercase">Planned Distance (km)</label>
          <input 
            type="number" 
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div className="mt-2 p-3 bg-red-50 border border-error rounded-lg flex gap-3 items-start text-sm">
          <AlertCircle className="w-5 h-5 text-error shrink-0 mt-0.5" />
          <div className="flex flex-col text-red-900">
            <span className="font-medium">Vehicle Capacity: 500 kg</span>
            <span className="font-medium">Cargo Weight: 700 kg</span>
            <span className="font-bold text-error mt-1 flex items-center gap-1">
              <X className="w-4 h-4" /> Capacity exceeded by 200 kg - dispatch blocked
            </span>
          </div>
        </div>
      </div>

      <div className="p-5 border-t border-border bg-gray-50 flex gap-3 rounded-b-xl">
        <button disabled className="flex-1 px-4 py-2 bg-gray-300 text-gray-500 font-medium rounded-lg cursor-not-allowed transition-colors text-sm">
          Dispatch (disabled)
        </button>
        <button className="px-4 py-2 border border-border bg-white text-error hover:bg-red-50 font-medium rounded-lg transition-colors text-sm">
          Cancel
        </button>
      </div>
    </div>
  );
}
