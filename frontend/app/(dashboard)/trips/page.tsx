'use client';

import React, { useState, useEffect } from 'react';
import { TripLifecycle } from '@/components/trips/TripLifecycle';
import { CreateTripForm } from '@/components/trips/CreateTripForm';
import { LiveBoard, Trip } from '@/components/trips/LiveBoard';

export default function TripDispatcherPage() {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [driver, setDriver] = useState('');
  const [weight, setWeight] = useState('');
  const [distance, setDistance] = useState('');

  const [availableVehicles, setAvailableVehicles] = useState<any[]>([]);
  const [availableDrivers, setAvailableDrivers] = useState<any[]>([]);
  const [liveTrips, setLiveTrips] = useState<Trip[]>([]);

  const [loading, setLoading] = useState(true);

  const [selectedTripId, setSelectedTripId] = useState<number | null>(null);

  const fetchDashboardData = async () => {
    try {
      const [vehRes, drvRes, tripRes] = await Promise.all([
        fetch('http://localhost:3000/api/v1/vehicles', { cache: 'no-store' }),
        fetch('http://localhost:3000/api/v1/drivers', { cache: 'no-store' }),
        fetch('http://localhost:3000/api/v1/trips', { cache: 'no-store' }),
      ]);

      const vehData = await vehRes.json();
      const drvData = await drvRes.json();
      const tripData = await tripRes.json();

      const vehicles = (vehData.data || []).filter((v: any) => v.status === 'Available');
      const drivers = (drvData.data || []).filter((d: any) => d.status === 'Available');

      setAvailableVehicles(vehicles);
      setAvailableDrivers(drivers);

      if (vehicles.length > 0) setVehicle(vehicles[0].reg_no);
      if (drivers.length > 0) setDriver(drivers[0].driver_id.toString());

      const statusColorMap: Record<string, string> = {
        Draft: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        Dispatched: 'bg-blue-100 text-blue-700 border-blue-200',
        Completed: 'bg-gray-100 text-gray-700 border-gray-200',
        Cancelled: 'bg-red-100 text-red-700 border-red-200',
      };

      const formattedTrips = (tripData.data || []).map((t: any) => ({
        id: t.id,
        displayId: `TR${t.id.toString().padStart(3, '0')}`,
        source: t.src,
        destination: t.dest,
        status: t.trip_status,
        statusColor: statusColorMap[t.trip_status] || 'bg-gray-100 text-gray-700 border-gray-200',
        vehicleDriver: `${t.vehicle?.reg_no || 'Unassigned'} / ${t.driver?.user?.name?.toUpperCase() || 'UNASSIGNED'}`,
        time:
          t.trip_status === 'Dispatched'
            ? 'In transit'
            : t.trip_status === 'Draft'
              ? 'Awaiting dispatch'
              : '-',
      }));

      setLiveTrips(formattedTrips);
      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleStatusUpdate = async (tripId: number, newStatus: string) => {
    try {
      await fetch(`http://localhost:3000/api/v1/trips/${tripId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trip_status: newStatus }),
      });
      fetchDashboardData();
    } catch (error) {
      console.error('Failed to update trip status:', error);
    }
  };

  const handleDispatch = async () => {
    if (!source || !destination || !vehicle || !driver || !weight || !distance) return;

    try {
      await fetch('http://localhost:3000/api/v1/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reg_no: vehicle,
          driver_id: parseInt(driver, 10),
          src: source,
          dest: destination,
          cargo_weight: parseFloat(weight),
          trip_dist: parseFloat(distance),
        }),
      });

      // Refresh board
      setSource('');
      setDestination('');
      setWeight('');
      setDistance('');
      fetchDashboardData();
    } catch (error) {
      console.error('Failed to dispatch trip:', error);
    }
  };

  if (loading) {
    return <div className="flex-1 p-8 flex justify-center items-center">Loading dashboard...</div>;
  }

  const selectedTripStatus = liveTrips.find((t) => t.id === selectedTripId)?.status || 'Draft';

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary-text">Trip Dispatcher</h1>
        <p className="text-secondary-text mt-1">Manage and dispatch fleet trips in real-time.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 flex flex-col space-y-6">
          <TripLifecycle currentStatus={selectedTripStatus} />
          <CreateTripForm
            source={source}
            setSource={setSource}
            destination={destination}
            setDestination={setDestination}
            vehicle={vehicle}
            setVehicle={setVehicle}
            driver={driver}
            setDriver={setDriver}
            weight={weight}
            setWeight={setWeight}
            distance={distance}
            setDistance={setDistance}
            availableVehicles={availableVehicles}
            availableDrivers={availableDrivers}
            onDispatch={handleDispatch}
          />
        </div>

        <div className="lg:col-span-8 flex flex-col space-y-4">
          <LiveBoard
            trips={liveTrips}
            onStatusUpdate={handleStatusUpdate}
            selectedTripId={selectedTripId}
            onSelectTrip={setSelectedTripId}
          />
        </div>
      </div>
    </div>
  );
}
