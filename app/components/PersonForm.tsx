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

    const uploadFormData = new FormData();
    uploadFormData.append("files", files[0]);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });

      if (!response.ok) {
        console.error("Failed to upload picture");
        return;
      }

      const { files: uploadedFiles } = await response.json();
      console.log("Uploaded picture:", uploadedFiles);
      
      if (uploadedFiles && uploadedFiles.length > 0) {
        const pictureUrl = uploadedFiles[0].fileUrl;
        console.log("Setting picture URL:", pictureUrl);
        
        setFormData((prev) => ({
          ...prev,
          picture: pictureUrl,
        }));
      }
    } catch (error) {
      console.error("Error uploading picture:", error);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Submitting person form data:", formData);
    console.log("Picture URL:", formData.picture);
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-5 rounded-lg">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Name
        </label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full h-10 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Role</label>
        <select
          value={formData.role}
          onChange={(e) =>
            setFormData({ ...formData, role: e.target.value as PersonRole })
          }
          className="mt-1 block w-full h-12 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200 hover:border-blue-400"
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
          className="mt-1 block w-full h-12 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors duration-200"
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
        className="inline-flex justify-center rounded-lg border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
      >
        {initialData ? "Update Person" : "Create Person"}
      </button>
    </form>
  );
}
