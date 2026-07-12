import React from "react";

export function TripLifecycle() {
  return (
    <div className="bg-surface rounded-xl border border-border p-5 shadow-sm">
      <h2 className="text-xs font-semibold text-secondary-text uppercase tracking-wider mb-4">Trip Lifecycle</h2>
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-border z-0"></div>
        
        <div className="relative z-10 flex flex-col items-center gap-1">
          <div className="w-4 h-4 rounded-full bg-success ring-4 ring-surface"></div>
          <span className="text-[10px] font-medium text-success">Draft</span>
        </div>
        <div className="relative z-10 flex flex-col items-center gap-1">
          <div className="w-4 h-4 rounded-full bg-blue-500 ring-4 ring-surface"></div>
          <span className="text-[10px] font-medium text-blue-600">Dispatched</span>
        </div>
        <div className="relative z-10 flex flex-col items-center gap-1">
          <div className="w-4 h-4 rounded-full bg-gray-300 ring-4 ring-surface"></div>
          <span className="text-[10px] font-medium text-secondary-text">Completed</span>
        </div>
        <div className="relative z-10 flex flex-col items-center gap-1">
          <div className="w-4 h-4 rounded-full bg-gray-300 ring-4 ring-surface"></div>
          <span className="text-[10px] font-medium text-secondary-text">Cancelled</span>
        </div>
      </div>
    </div>
  );
}
