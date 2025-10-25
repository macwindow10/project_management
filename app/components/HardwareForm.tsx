"use client";

import { useState, FormEvent } from "react";
import { Person } from "@/app/types";

interface HardwareFormProps {
  onSubmit: (data: any) => void;
  persons: Person[];
  initialData?: {
    name: string;
    description?: string;
    dateOfPurchase: string;
    issuedToId?: string;
  } | null;
}

export function HardwareForm({
  onSubmit,
  persons,
  initialData = null,
}: HardwareFormProps) {
  const [formData, setFormData] = useState(
    initialData || {
      name: "",
      description: "",
      dateOfPurchase: "",
      issuedToId: "",
    }
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Date of Purchase
        </label>
        <input
          type="date"
          required
          value={formData.dateOfPurchase}
          onChange={(e) =>
            setFormData({ ...formData, dateOfPurchase: e.target.value })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Issued To
        </label>
        <select
          value={formData.issuedToId || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              issuedToId: e.target.value || undefined,
            })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Not Issued</option>
          {persons.map((person) => (
            <option key={person.id} value={person.id}>
              {person.name} ({person.role})
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        {initialData ? "Update Hardware" : "Create Hardware"}
      </button>
    </form>
  );
}
