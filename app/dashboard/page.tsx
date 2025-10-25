"use client";

import { useState, useEffect } from "react";
import {
  Project,
  Person,
  Hardware,
  isValidProjectStatus,
  isValidPersonRole,
} from "../types";

function formatEnumValue(value: string): string {
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [persons, setPersons] = useState<Person[]>([]);
  const [hardware, setHardware] = useState<Hardware[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, personsRes, hardwareRes] = await Promise.all([
          fetch("/api/projects"),
          fetch("/api/persons"),
          fetch("/api/hardware"),
        ]);

        const projectsData = await projectsRes.json();
        const personsData = await personsRes.json();
        const hardwareData = await hardwareRes.json();

        setProjects(projectsData);
        setPersons(personsData);
        setHardware(hardwareData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Project Management Dashboard</h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Total Projects</h2>
          <p className="text-3xl">{projects.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Total Team Members</h2>
          <p className="text-3xl">{persons.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Total Hardware Items</h2>
          <p className="text-3xl">{hardware.length}</p>
        </div>
      </div>

      {/* Search Section */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search projects or persons..."
          className="w-full p-2 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Projects Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedProject(project)}
            >
              <h3 className="text-lg font-semibold">{project.name}</h3>
              <p className="text-gray-600">
                Status: {formatEnumValue(project.status)}
              </p>
              <p className="text-gray-600">Client: {project.clientName}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Team Members Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Team Members</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPersons.map((person) => (
            <div
              key={person.id}
              className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedPerson(person)}
            >
              <div className="flex items-center mb-2">
                {person.picture && (
                  <img
                    src={person.picture}
                    alt={person.name}
                    className="w-10 h-10 rounded-full mr-2"
                  />
                )}
                <div>
                  <h3 className="text-lg font-semibold">{person.name}</h3>
                  <p className="text-gray-600">
                    {formatEnumValue(person.role)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">{selectedProject.name}</h2>
            <p className="mb-2">
              <span className="font-semibold">Description:</span>{" "}
              {selectedProject.description}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Status:</span>{" "}
              {formatEnumValue(selectedProject.status)}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Client:</span>{" "}
              {selectedProject.clientName}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Team Lead:</span>{" "}
              {selectedProject.teamLead.name}
            </p>
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Team Members:</h3>
              <ul className="list-disc pl-5">
                {selectedProject.teamMembers.map((member) => (
                  <li key={member.id}>{member.name}</li>
                ))}
              </ul>
            </div>
            {selectedProject.attachments.length > 0 && (
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Attachments:</h3>
                <ul className="list-disc pl-5">
                  {selectedProject.attachments.map((file) => (
                    <li key={file.id}>
                      <a
                        href={file.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {file.fileName}
                      </a>
                      {file.fileSize && (
                        <span className="text-gray-500 text-sm ml-2">
                          ({(file.fileSize / 1024).toFixed(1)} KB)
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <button
              className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
              onClick={() => setSelectedProject(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Person Details Modal */}
      {selectedPerson && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center mb-4">
              {selectedPerson.picture && (
                <img
                  src={selectedPerson.picture}
                  alt={selectedPerson.name}
                  className="w-20 h-20 rounded-full mr-4"
                />
              )}
              <div>
                <h2 className="text-2xl font-bold">{selectedPerson.name}</h2>
                <p className="text-gray-600">
                  {formatEnumValue(selectedPerson.role)}
                </p>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold mb-2">Leading Projects:</h3>
              <ul className="list-disc pl-5">
                {selectedPerson.leadingProjects?.map((project) => (
                  <li key={project.id}>{project.name}</li>
                ))}
              </ul>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold mb-2">Member of Projects:</h3>
              <ul className="list-disc pl-5">
                {selectedPerson.memberOfProjects?.map((project) => (
                  <li key={project.id}>{project.name}</li>
                ))}
              </ul>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold mb-2">Assigned Hardware:</h3>
              <ul className="list-disc pl-5">
                {selectedPerson.assignedHardware?.map((item) => (
                  <li key={item.id}>{item.name}</li>
                ))}
              </ul>
            </div>

            <button
              className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
              onClick={() => setSelectedPerson(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
