"use client";

import React, { useState } from "react";
import { TripLifecycle } from "@/components/trips/TripLifecycle";
import { CreateTripForm } from "@/components/trips/CreateTripForm";
import { LiveBoard, Trip } from "@/components/trips/LiveBoard";

export default function TripDispatcherPage() {
  const [source, setSource] = useState("Gandhinagar Depot");
  const [destination, setDestination] = useState("Ahmedabad Hub");
  const [vehicle, setVehicle] = useState("VAN-05 - 500 kg capacity");
  const [driver, setDriver] = useState("Alex");
  const [weight, setWeight] = useState("700");
  const [distance, setDistance] = useState("38");

  const liveTrips: Trip[] = [
    {
      id: "TR001",
      source: "Gandhinagar Depot",
      destination: "Ahmedabad Hub",
      status: "Dispatched",
      statusColor: "bg-blue-100 text-blue-700 border-blue-200",
      vehicleDriver: "VAN-05 / ALEX",
      time: "45 min"
    },
    {
      id: "TR004",
      source: "Vatva Industrial Area",
      destination: "Sanand Warehouse",
      status: "Draft",
      statusColor: "bg-gray-100 text-gray-700 border-gray-200",
      vehicleDriver: "TRUCK-04 / SURESH",
      time: "Awaiting driver"
    },
    {
      id: "TR006",
      source: "Mansa",
      destination: "Kalol Depot",
      status: "Cancelled",
      statusColor: "bg-red-100 text-red-700 border-red-200",
      vehicleDriver: "Unassigned",
      time: "Vehicle went to shop"
    }
  ];

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary-text">Trip Dispatcher</h1>
        <p className="text-secondary-text mt-1">Manage and dispatch fleet trips in real-time.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 flex flex-col space-y-6">
          <TripLifecycle />
          <CreateTripForm 
            source={source} setSource={setSource}
            destination={destination} setDestination={setDestination}
            vehicle={vehicle} setVehicle={setVehicle}
            driver={driver} setDriver={setDriver}
            weight={weight} setWeight={setWeight}
            distance={distance} setDistance={setDistance}
          />
        </div>

        <div className="lg:col-span-8 flex flex-col space-y-4">
          <LiveBoard trips={liveTrips} />
        </div>
      </div>
    </div>
  );
}
