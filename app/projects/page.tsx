"use client";

import { useState, useEffect } from "react";
import { Project, Person } from "@/app/types";
import { ProjectForm } from "@/app/components/ProjectForm";

export default function ProjectsPage() {
  const [teamModalOpen, setTeamModalOpen] = useState(false);
  const [teamProject, setTeamProject] = useState<Project | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<string[]>([]);

  const openTeamModal = (project: Project) => {
    setTeamProject(project);
    setSelectedTeam(
      project.teamMembers ? project.teamMembers.map((m) => m.id) : []
    );
    setTeamModalOpen(true);
  };

  const handleTeamChange = (personId: string) => {
    setSelectedTeam((prev) =>
      prev.includes(personId)
        ? prev.filter((id) => id !== personId)
        : [...prev, personId]
    );
  };

  const handleTeamSubmit = async () => {
    if (!teamProject) return;
    await fetch(`/api/projects/${teamProject.id}/team`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teamMemberIds: selectedTeam }),
    });
    fetchProjects();
    setTeamModalOpen(false);
    setTeamProject(null);
  };
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

    console.log("=== SUBMITTING PROJECT ===");
    console.log("URL:", url);
    console.log("Method:", editingProject ? "PUT" : "POST");
    console.log("Form Data:", formData);
    console.log("Attachments in form data:", formData.attachments);

    const response = await fetch(url, {
      method: editingProject ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const result = await response.json();
      console.log("API Response:", result);
      console.log("=== END SUBMITTING PROJECT ===");
      fetchProjects();
      setIsFormOpen(false);
      setEditingProject(null);
    } else {
      console.error("Failed to submit project:", response.status);
      const error = await response.json();
      console.error("Error details:", error);
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
          className="bg-black text-white p-3 rounded-lg hover:bg-neutral-800 transition-colors shadow-sm hover:shadow-md"
          title="New Project"
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
              d="M12 4v16m8-8H4"
            />
          </svg>
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
          <div
            key={project.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center flex-shrink-0 mr-3">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 truncate mb-1">
                      {project.name}
                    </h3>
                    {project.description && (
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                        {project.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex space-x-1 ml-2">
                  <button
                    onClick={() => openTeamModal(project)}
                    className="bg-black text-white p-2 rounded-md hover:bg-neutral-800 transition-colors"
                    title="Manage team members"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </button>
                  {teamModalOpen && teamProject && (
                    <div className="fixed inset-0 bg-gray-50/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-5 max-w-xl w-full">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3">
                          Manage Team Members
                        </h2>
                        <div className="mb-4">
                          <div className="font-medium mb-2">
                            Assign or remove team members for{" "}
                            <span className="font-bold">
                              {teamProject.name}
                            </span>
                            :
                          </div>
                          <div className="mb-2">
                            <label className="block mb-1 font-medium">
                              Select team members:
                            </label>
                            <select
                              multiple
                              value={selectedTeam}
                              onChange={(e) => {
                                const options = Array.from(
                                  e.target.selectedOptions
                                ).map((opt) => opt.value);
                                setSelectedTeam(options);
                              }}
                              className="w-full border rounded p-2"
                              size={Math.min(8, persons.length)}
                            >
                              {persons.map((person) => (
                                <option key={person.id} value={person.id}>
                                  {person.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="mt-2">
                            <span className="font-medium">
                              Already assigned:
                            </span>
                            <ul className="list-disc ml-5 text-sm mt-1">
                              {teamProject.teamMembers &&
                              teamProject.teamMembers.length > 0 ? (
                                teamProject.teamMembers.map((member) => {
                                  const person = persons.find(
                                    (p) =>
                                      p.id === member.personId ||
                                      p.id === member.id
                                  );
                                  return (
                                    <li key={member.id}>
                                      {person
                                        ? person.name
                                        : member.name || member.id}
                                    </li>
                                  );
                                })
                              ) : (
                                <li className="text-gray-400">
                                  No team members assigned
                                </li>
                              )}
                            </ul>
                          </div>
                        </div>
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => {
                              setTeamModalOpen(false);
                              setTeamProject(null);
                            }}
                            className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleTeamSubmit}
                            className="px-4 py-2 rounded bg-black text-white hover:bg-neutral-800"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={() => {
                      setEditingProject(project);
                      setIsFormOpen(true);
                    }}
                    className="bg-black text-white p-2 rounded-md hover:bg-neutral-800 transition-colors"
                    title="Edit project"
                  >
                    <svg
                      className="w-4 h-4"
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
                    className="bg-black text-white p-2 rounded-md hover:bg-neutral-800 transition-colors"
                    title="Delete project"
                  >
                    <svg
                      className="w-4 h-4"
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

              <div className="space-y-2 text-sm mb-3">
                <div className="flex items-center text-gray-600">
                  <svg
                    className="w-4 h-4 mr-2 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="truncate">Status: {project.status}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <svg
                    className="w-4 h-4 mr-2 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="truncate">Client: {project.clientName}</span>
                </div>
              </div>

              {project.attachments && project.attachments.length > 0 && (
                <div className="pt-3 border-t border-gray-100">
                  <div className="flex items-center text-xs font-medium text-gray-500 mb-2">
                    <svg
                      className="w-3.5 h-3.5 mr-1"
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
                    {project.attachments.length} Attachment
                    {project.attachments.length > 1 ? "s" : ""}
                  </div>
                  <div className="space-y-1">
                    {project.attachments.map((attachment) => (
                      <a
                        key={attachment.id}
                        href={attachment.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-xs text-blue-600 hover:text-blue-800 hover:underline truncate"
                      >
                        <svg
                          className="w-3 h-3 mr-1 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <span className="truncate">{attachment.fileName}</span>
                        {attachment.fileSize && (
                          <span className="ml-1 text-gray-500 flex-shrink-0">
                            ({(attachment.fileSize / 1024).toFixed(1)} KB)
                          </span>
                        )}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
