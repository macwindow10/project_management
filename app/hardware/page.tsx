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
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          New Hardware
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
          <div key={item.id} className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
            {item.description && (
              <p className="text-gray-600 mb-2">{item.description}</p>
            )}
            <p className="text-gray-600 mb-2">
              Purchased: {new Date(item.dateOfPurchase).toLocaleDateString()}
            </p>
            {item.issuedTo && (
              <p className="text-gray-600 mb-4">
                Issued to: {item.issuedTo.name}
              </p>
            )}

            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setEditingHardware(item);
                  setIsFormOpen(true);
                }}
                className="bg-blue-100 text-blue-600 px-3 py-1 rounded hover:bg-blue-200"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
