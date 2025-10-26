"use client";

import { useState, useEffect } from "react";
import { Project, Person } from "@/app/types";
import { ProjectForm } from "@/app/components/ProjectForm";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [persons, setPersons] = useState<Person[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  useEffect(() => {
    fetchProjects();
    fetchPersons();
  }, []);

  const fetchProjects = async () => {
    const response = await fetch("/api/projects");
    const data = await response.json();
    setProjects(data);
  };

  const fetchPersons = async () => {
    const response = await fetch("/api/persons");
    const data = await response.json();
    setPersons(data);
  };

  const handleSubmit = async (formData: any) => {
    const url = editingProject
      ? `/api/projects/${editingProject.id}`
      : "/api/projects";

    const response = await fetch(url, {
      method: editingProject ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      fetchProjects();
      setIsFormOpen(false);
      setEditingProject(null);
    }
  };

  const handleDelete = async (projectId: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    const response = await fetch(`/api/projects/${projectId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      fetchProjects();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Projects</h1>
        <button
          onClick={() => {
            setEditingProject(null);
            setIsFormOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          New Project
        </button>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-gray-50/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-5 max-w-2xl w-full">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              {editingProject ? "Edit Project" : "New Project"}
            </h2>
            <ProjectForm onSubmit={handleSubmit} initialData={editingProject} />
            <button
              onClick={() => {
                setIsFormOpen(false);
                setEditingProject(null);
              }}
              className="mt-4 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <div key={project.id} className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
            <p className="text-gray-600 mb-2">{project.description}</p>
            <p className="text-gray-600 mb-2">Status: {project.status}</p>
            <p className="text-gray-600 mb-2">Client: {project.clientName}</p>

            {project.attachments && project.attachments.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-1">Attachments:</p>
                <div className="space-y-1">
                  {project.attachments.map((attachment) => (
                    <a
                      key={attachment.id}
                      href={attachment.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                        />
                      </svg>
                      {attachment.fileName}
                      {attachment.fileSize && (
                        <span className="ml-1 text-gray-500">
                          ({(attachment.fileSize / 1024).toFixed(1)} KB)
                        </span>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setEditingProject(project);
                  setIsFormOpen(true);
                }}
                className="bg-blue-100 text-blue-600 p-2 rounded hover:bg-blue-200 transition-colors"
                title="Edit project"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
              <button
                onClick={() => handleDelete(project.id)}
                className="bg-red-100 text-red-600 p-2 rounded hover:bg-red-200 transition-colors"
                title="Delete project"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
