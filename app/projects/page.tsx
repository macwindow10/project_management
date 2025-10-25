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
            <p className="text-gray-600 mb-4">Client: {project.clientName}</p>

            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setEditingProject(project);
                  setIsFormOpen(true);
                }}
                className="bg-blue-100 text-blue-600 px-3 py-1 rounded hover:bg-blue-200"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(project.id)}
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
