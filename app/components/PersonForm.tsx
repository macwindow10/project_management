"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { PersonRole, PERSON_ROLES } from "@/app/types";

interface PersonFormProps {
  onSubmit: (data: any) => void;
  initialData?: {
    name: string;
    role: PersonRole;
    picture?: string;
  } | null;
}

export function PersonForm({ onSubmit, initialData = null }: PersonFormProps) {
  const [formData, setFormData] = useState(
    initialData || {
      name: "",
      role: "Developer" as PersonRole,
      picture: "",
    }
  );

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    formData.append("files", files[0]);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const urls = await response.json();
    // console.log(urls);
    setFormData((prev) => ({
      ...prev,
      picture: urls[0],
    }));
  };

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
        <label className="block text-sm font-medium text-gray-700">Role</label>
        <select
          value={formData.role}
          onChange={(e) =>
            setFormData({ ...formData, role: e.target.value as PersonRole })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          {PERSON_ROLES.map((role) => (
            <option key={role} value={role}>
              {role.replace(/_/g, " ")}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Picture
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mt-1 block w-full"
        />
        {formData.picture && (
          <img
            src={formData.picture}
            alt="Preview"
            className="mt-2 w-32 h-32 object-cover rounded-lg"
          />
        )}
      </div>

      <button
        type="submit"
        className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        {initialData ? "Update Person" : "Create Person"}
      </button>
    </form>
  );
}
