"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { ProjectStatus, Project, PROJECT_STATUS } from "@/app/types";

interface ProjectFormData {
  name: string;
  description: string;
  startDate: string;
  status: ProjectStatus;
  teamLeadId: string;
  clientName: string;
  latestUpdate: string;
  teamMemberIds: string[];
  attachments: {
    fileName: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
  }[];
}

interface ProjectFormProps {
  onSubmit: (data: ProjectFormData) => void;
  initialData?: Project | null;
}

export function ProjectForm({
  onSubmit,
  initialData = null,
}: ProjectFormProps) {
  const [formData, setFormData] = useState<ProjectFormData>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    startDate: initialData?.startDate
      ? new Date(initialData.startDate).toISOString().split("T")[0]
      : "",
    status: initialData?.status || "Under_Development",
    teamLeadId: initialData?.teamLeadId || "",
    clientName: initialData?.clientName || "",
    latestUpdate: initialData?.latestUpdate || "",
    teamMemberIds: initialData?.teamMembers?.map((member) => member.id) || [],
    attachments: initialData?.attachments || [],
  });

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const { files: uploadedFiles } = await response.json();
    setFormData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...uploadedFiles],
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
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
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="mt-1 block w-full h-24 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Start Date
        </label>
        <input
          type="date"
          required
          value={formData.startDate}
          onChange={(e) =>
            setFormData({ ...formData, startDate: e.target.value })
          }
          className="mt-1 block w-full h-12 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Status
        </label>
        <select
          value={formData.status}
          onChange={(e) =>
            setFormData({
              ...formData,
              status: e.target.value as ProjectStatus,
            })
          }
          className="mt-1 block w-full h-12 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200 hover:border-blue-400"
        >
          {PROJECT_STATUS.map((status) => (
            <option key={status} value={status}>
              {status.replace(/_/g, " ")}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Client Name
        </label>
        <input
          type="text"
          required
          value={formData.clientName}
          onChange={(e) =>
            setFormData({ ...formData, clientName: e.target.value })
          }
          className="mt-1 block w-full h-12 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Latest Update
        </label>
        <textarea
          value={formData.latestUpdate}
          onChange={(e) =>
            setFormData({ ...formData, latestUpdate: e.target.value })
          }
          className="mt-1 block w-full h-24 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Attachments
        </label>
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="mt-1 block w-full h-12 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors duration-200"
        />
      </div>

      <button
        type="submit"
        className="inline-flex justify-center rounded-lg border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
      >
        {initialData ? "Update Project" : "Create Project"}
      </button>
    </form>
  );
}
