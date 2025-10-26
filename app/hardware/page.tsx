"use client";

import { useState, useEffect } from "react";
import { Hardware, Person } from "@/app/types";
import { HardwareForm } from "@/app/components/HardwareForm";

export default function HardwarePage() {
  const [hardware, setHardware] = useState<Hardware[]>([]);
  const [persons, setPersons] = useState<Person[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingHardware, setEditingHardware] = useState<Hardware | null>(null);

  useEffect(() => {
    fetchHardware();
    fetchPersons();
  }, []);

  const fetchHardware = async () => {
    const response = await fetch("/api/hardware");
    const data = await response.json();
    setHardware(data);
  };

  const fetchPersons = async () => {
    const response = await fetch("/api/persons");
    const data = await response.json();
    setPersons(data);
  };

  const handleSubmit = async (formData: any) => {
    const url = editingHardware
      ? `/api/hardware/${editingHardware.id}`
      : "/api/hardware";

    const response = await fetch(url, {
      method: editingHardware ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      fetchHardware();
      setIsFormOpen(false);
      setEditingHardware(null);
    }
  };

  const handleDelete = async (hardwareId: string) => {
    if (!confirm("Are you sure you want to delete this hardware item?")) return;

    const response = await fetch(`/api/hardware/${hardwareId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      fetchHardware();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Hardware</h1>
        <button
          onClick={() => {
            setEditingHardware(null);
            setIsFormOpen(true);
          }}
          className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
          title="New Hardware"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-gray-50/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-5 max-w-2xl w-full">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              {editingHardware ? "Edit Hardware" : "New Hardware"}
            </h2>
            <HardwareForm
              onSubmit={handleSubmit}
              persons={persons}
              initialData={editingHardware}
            />
            <button
              onClick={() => {
                setIsFormOpen(false);
                setEditingHardware(null);
              }}
              className="mt-4 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {hardware.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center flex-shrink-0 mr-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 truncate mb-1">{item.name}</h3>
                    {item.description && (
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">{item.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex space-x-1 ml-2">
                  <button
                    onClick={() => {
                      setEditingHardware(item);
                      setIsFormOpen(true);
                    }}
                    className="bg-blue-50 text-blue-600 p-2 rounded-md hover:bg-blue-100 transition-colors"
                    title="Edit hardware"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-50 text-red-600 p-2 rounded-md hover:bg-red-100 transition-colors"
                    title="Delete hardware"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-gray-600">
                  <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Purchased: {new Date(item.dateOfPurchase).toLocaleDateString()}</span>
                </div>
                {item.issuedTo && (
                  <div className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="truncate">Issued to: {item.issuedTo.name}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
