"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { ProjectStatus, Project, PROJECT_STATUS, Person } from "@/app/types";

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
    fileType?: string;
    fileSize?: number;
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

  const [persons, setPersons] = useState<Person[]>([]);

  useEffect(() => {
    const fetchPersons = async () => {
      try {
        const response = await fetch("/api/persons");
        const data = await response.json();
        setPersons(data);
      } catch (error) {
        console.error("Error fetching persons:", error);
      }
    };
    fetchPersons();
  }, []);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const files = Array.from(e.target.files);
    const uploadFormData = new FormData();
    files.forEach((file) => uploadFormData.append("files", file));

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });

      if (!response.ok) {
        console.error("Failed to upload files");
        return;
      }

      const { files: uploadedFiles } = await response.json();
      console.log("Uploaded files:", uploadedFiles);
      
      setFormData((prev) => ({
        ...prev,
        attachments: [...prev.attachments, ...uploadedFiles],
      }));
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Submitting form data:", formData);
    onSubmit(formData);
  };

  return (
    <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
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
          Team Lead
        </label>
        <select
          required
          value={formData.teamLeadId}
          onChange={(e) =>
            setFormData({ ...formData, teamLeadId: e.target.value })
          }
          className="mt-1 block w-full h-12 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200 hover:border-blue-400"
        >
          <option value="">Select Team Lead</option>
          {persons.map((person) => (
            <option key={person.id} value={person.id}>
              {person.name} ({person.role.replace(/_/g, " ")})
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
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Attachments
        </label>
        
        {formData.attachments.length > 0 && (
          <div className="mb-3 space-y-2">
            {formData.attachments.map((attachment, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-50 p-2 rounded-lg border border-gray-200"
              >
                <div className="flex items-center min-w-0 flex-1">
                  <svg className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  <span className="text-sm text-gray-700 truncate">{attachment.fileName}</span>
                  {attachment.fileSize && (
                    <span className="ml-2 text-xs text-gray-500 flex-shrink-0">
                      ({(attachment.fileSize / 1024).toFixed(1)} KB)
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveAttachment(index)}
                  className="ml-2 text-red-600 hover:text-red-800 p-1"
                  title="Remove attachment"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
        
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
    </div>
  );
}
