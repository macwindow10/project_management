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
    status: initialData?.status || ProjectStatus.Under_Development,
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
          Start Date
        </label>
        <input
          type="date"
          required
          value={formData.startDate}
          onChange={(e) =>
            setFormData({ ...formData, startDate: e.target.value })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
          className="mt-1 block w-full"
        />
      </div>

      <button
        type="submit"
        className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        {initialData ? "Update Project" : "Create Project"}
      </button>
    </form>
  );
}
