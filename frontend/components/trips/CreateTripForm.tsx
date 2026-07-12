import React from "react";
import { AlertCircle, X, CheckCircle2 } from "lucide-react";

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
  availableVehicles: any[];
  availableDrivers: any[];
  onDispatch: () => void;
}

export function CreateTripForm({
  source, setSource,
  destination, setDestination,
  vehicle, setVehicle,
  driver, setDriver,
  weight, setWeight,
  distance, setDistance,
  availableVehicles,
  availableDrivers,
  onDispatch
}: CreateTripFormProps) {
  
  const selectedVehicleData = availableVehicles.find(v => v.reg_no === vehicle);
  const capacity = selectedVehicleData?.load_capacity || 0;
  const currentWeight = parseFloat(weight) || 0;
  
  const isOverweight = currentWeight > capacity;
  const canDispatch = source && destination && vehicle && driver && weight && distance && !isOverweight;

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
            placeholder="e.g. Gandhinagar Depot"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-secondary-text uppercase">Destination</label>
          <input 
            type="text" 
            placeholder="e.g. Ahmedabad Hub"
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
            {availableVehicles.map(v => (
              <option key={v.reg_no} value={v.reg_no}>{v.reg_no} - {v.load_capacity} kg capacity</option>
            ))}
            {availableVehicles.length === 0 && <option value="">No vehicles available</option>}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-secondary-text uppercase">Driver (Available Only)</label>
          <select 
            value={driver}
            onChange={(e) => setDriver(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white"
          >
            {availableDrivers.map(d => (
              <option key={d.driver_id} value={d.driver_id.toString()}>{d.user?.name || 'Unknown Driver'} ({d.license_no})</option>
            ))}
            {availableDrivers.length === 0 && <option value="">No drivers available</option>}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-secondary-text uppercase">Cargo Weight (kg)</label>
          <input 
            type="number" 
            placeholder="0"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-secondary-text uppercase">Planned Distance (km)</label>
          <input 
            type="number"
            placeholder="0" 
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* Validation Box */}
        {currentWeight > 0 && selectedVehicleData && (
          isOverweight ? (
            <div className="mt-2 p-3 bg-red-50 border border-error rounded-lg flex gap-3 items-start text-sm transition-all duration-300">
              <AlertCircle className="w-5 h-5 text-error shrink-0 mt-0.5" />
              <div className="flex flex-col text-red-900">
                <span className="font-medium">Vehicle Capacity: {capacity} kg</span>
                <span className="font-medium">Cargo Weight: {currentWeight} kg</span>
                <span className="font-bold text-error mt-1 flex items-center gap-1">
                  <X className="w-4 h-4" /> Capacity exceeded by {currentWeight - capacity} kg - dispatch blocked
                </span>
              </div>
            </div>
          ) : (
            <div className="mt-2 p-3 bg-green-50 border border-success rounded-lg flex gap-3 items-start text-sm transition-all duration-300">
              <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
              <div className="flex flex-col text-green-900">
                <span className="font-medium">Vehicle Capacity: {capacity} kg</span>
                <span className="font-medium">Cargo Weight: {currentWeight} kg</span>
                <span className="font-bold text-success mt-1 flex items-center gap-1">
                  Weight is within limits. Ready to dispatch.
                </span>
              </div>
            </div>
          )
        )}
      </div>

      <div className="p-5 border-t border-border bg-gray-50 flex gap-3 rounded-b-xl">
        <button 
          disabled={!canDispatch} 
          onClick={onDispatch}
          className={`flex-1 px-4 py-2 font-medium rounded-lg transition-colors text-sm ${canDispatch ? 'bg-primary text-white hover:bg-primary/90' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
        >
          {canDispatch ? 'Dispatch Trip' : 'Dispatch (disabled)'}
        </button>
        <button 
          onClick={() => {
            setSource(""); setDestination(""); setWeight(""); setDistance("");
          }}
          className="px-4 py-2 border border-border bg-white text-error hover:bg-red-50 font-medium rounded-lg transition-colors text-sm"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
