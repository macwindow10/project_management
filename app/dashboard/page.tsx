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
    <main className="min-h-screen bg-[#020817] text-white">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-4 md:py-8">
          <h1 className="text-2xl font-semibold text-white"></h1>
          <div className="mt-4 md:mt-0">
            <span className="text-sm font-medium text-gray-400">
              Last updated: {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="bg-[#020817] overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center border border-[#18303b] rounded-lg p-3">
                <div className="flex-shrink-0 p-3 bg-blue-500 rounded-md">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">
                      Total Projects
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-white">
                        {projects.length}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-[#020817] overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center border border-[#18303b] rounded-lg p-3">
                <div className="shrink-0 p-3 bg-gray-500 rounded-md">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">
                      Team Members
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-white">
                        {persons.length}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-[#020817] overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center border border-[#18303b] rounded-lg p-3">
                <div className="shrink-0 p-3 bg-slate-500 rounded-md">
                  <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-400 truncate">
                      Hardware Items
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-white">
                        {hardware.length}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="mb-8">
          <div className="max-w-lg">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search projects or persons..."
                className="block w-full pl-10 pr-3 py-[5px] rounded-md bg-[#020817] text-white placeholder-[#9aa4b2] border border-[#18303b] focus:outline-none focus:border-[#0969da] focus:ring-1 focus:ring-[#0969da] text-[14px] leading-normal"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-white">Active Projects</h2>
            <a
              href="/projects"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-900"
            >
              View all projects
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-[#020817] overflow-hidden shadow-sm rounded-lg hover:shadow-md transition-shadow duration-300 ease-in-out cursor-pointer"
                onClick={() => setSelectedProject(project)}
              >
                <div className="p-6 border border-[#18303b] rounded-lg">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-white mb-1">
                      {project.name}
                    </h3>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${
                      project.status === "Under_Development"
                        ? "bg-yellow-100 text-yellow-800"
                        : project.status === "Deployed"
                        ? "bg-green-100 text-green-800"
                        : project.status === "Developed_Not_Deployed"
                        ? "bg-gray-100 text-gray-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                    >
                      {formatEnumValue(project.status)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 mt-2">
                    Client: {project.clientName}
                  </p>
                  <div className="mt-4 flex items-center">
                    {project.teamMembers.slice(0, 3).map((member, index) => {
                      // Find the corresponding person if member.name is missing
                      // console.log("Member: ", member);
                      // console.log("Persons : ", persons);
                      const displayName =
                        member.name ||
                        (persons.find((p) => p.id === member.personId)?.name ??
                          "?");
                      const displayInitial = displayName.charAt(0);
                      return member.picture ? (
                        <img
                          key={member.id}
                          src={member.picture}
                          alt={displayName}
                          className={`w-8 h-8 rounded-full border-2 border-white ${
                            index > 0 ? "-ml-2" : ""
                          }`}
                        />
                      ) : (
                        <div
                          key={member.id}
                          className={`w-8 h-8 rounded-full bg-[#0b1620] flex items-center justify-center border-2 border-transparent ${
                            index > 0 ? "-ml-2" : ""
                          }`}
                        >
                          <span className="text-xs text-gray-300">
                            {displayInitial}
                          </span>
                        </div>
                      );
                    })}
                    {project.teamMembers.length > 3 && (
                      <span className="text-sm text-gray-300 ml-2">
                        +{project.teamMembers.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Members Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-white">Team Members</h2>
            <a
              href="/persons"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-900"
            >
              View all members
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPersons.map((person) => (
              <div
                key={person.id}
                className="bg-[#020817] overflow-hidden shadow-sm rounded-lg hover:shadow-md transition-shadow duration-300 ease-in-out cursor-pointer"
                onClick={() => setSelectedPerson(person)}
              >
                <div className="p-6 border border-[#18303b] rounded-lg">
                  <div className="flex items-center space-x-4">
                    {person.picture ? (
                      <img
                        src={person.picture}
                        alt={person.name}
                        className="w-12 h-12 rounded-full"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-xl font-medium text-indigo-700">
                          {person.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-medium text-white">
                        {person.name}
                      </h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 mt-1">
                        {formatEnumValue(person.role)}
                      </span>
                    </div>
                  </div>
                  {person.leadingProjects && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-300">
                        Leading {person.leadingProjects.length} project(s)
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Project Details Modal */}
        {selectedProject && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-50">
            <div className="fixed inset-0 z-50 overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <div className="relative transform overflow-hidden rounded-lg bg-[#020817] text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
                  <div className="bg-[#020817] px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                        <div className="flex justify-between items-start">
                          <h2 className="text-xl font-semibold text-white">
                            {selectedProject.name}
                          </h2>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${
                            selectedProject.status === "Under_Development"
                              ? "bg-yellow-100 text-yellow-800"
                              : selectedProject.status === "Deployed"
                              ? "bg-green-100 text-green-800"
                              : selectedProject.status ===
                                "Developed_Not_Deployed"
                              ? "bg-gray-100 text-gray-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                          >
                            {formatEnumValue(selectedProject.status)}
                          </span>
                        </div>
                        <div className="mt-4 space-y-4">
                          <div>
                            <h3 className="text-sm font-medium text-white">
                              Description
                            </h3>
                            <p className="mt-1 text-sm text-gray-300">
                              {selectedProject.description}
                            </p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-white">
                              Client
                            </h3>
                            <p className="mt-1 text-sm text-gray-300">
                              {selectedProject.clientName}
                            </p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-white">
                              Team
                            </h3>
                            <div className="mt-2">
                              <div className="flex items-center space-x-2 mb-2">
                                {selectedProject.teamLead.picture ? (
                                  <img
                                    src={selectedProject.teamLead.picture}
                                    alt={selectedProject.teamLead.name}
                                    className="w-8 h-8 rounded-full"
                                  />
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                                    <span className="text-sm font-medium text-indigo-700">
                                      {selectedProject.teamLead.name.charAt(0)}
                                    </span>
                                  </div>
                                )}
                                <span className="text-sm text-white">
                                  {selectedProject.teamLead.name}
                                </span>
                                <span className="text-xs text-gray-400">
                                  (Team Lead)
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                {selectedProject.teamMembers.map((member) => {
                                  const displayName =
                                    member.name ||
                                    (persons.find(
                                      (p) => p.id === member.personId
                                    )?.name ??
                                      "?");
                                  const displayInitial = displayName.charAt(0);
                                  return (
                                    <div
                                      key={member.id}
                                      className="flex items-center space-x-2"
                                    >
                                      {member.picture ? (
                                        <img
                                          src={member.picture}
                                          alt={displayName}
                                          className="w-6 h-6 rounded-full"
                                        />
                                      ) : (
                                        <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                                          <span className="text-xs text-gray-700">
                                            {displayInitial}
                                          </span>
                                        </div>
                                      )}
                                      <span className="text-sm text-gray-300">
                                        {displayName}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                          {selectedProject.attachments.length > 0 && (
                            <div>
                              <h3 className="text-sm font-medium text-white">
                                Attachments
                              </h3>
                              <ul className="mt-2 divide-y divide-[#0f2540]">
                                {selectedProject.attachments.map((file) => (
                                  <li
                                    key={file.id}
                                    className="py-2 flex items-center justify-between"
                                  >
                                    <div className="flex items-center">
                                      <svg
                                        className="h-5 w-5 text-gray-400"
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                      >
                                        <path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                      </svg>
                                      <a
                                        href={file.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="ml-2 text-sm text-indigo-400 hover:text-indigo-200"
                                      >
                                        {file.fileName}
                                      </a>
                                    </div>
                                    {file.fileSize && (
                                      <span className="text-sm text-gray-400">
                                        {(file.fileSize / 1024).toFixed(1)} KB
                                      </span>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-transparent px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-gray-800 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-700 hover:bg-gray-700 sm:mt-0 sm:w-auto"
                      onClick={() => setSelectedProject(null)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Person Details Modal */}
        {selectedPerson && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-50">
            <div className="fixed inset-0 z-50 overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <div className="relative transform overflow-hidden rounded-lg bg-[#020817] text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
                  <div className="bg-[#020817] px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                        <div className="flex items-center space-x-4 mb-6">
                          {selectedPerson.picture ? (
                            <img
                              src={selectedPerson.picture}
                              alt={selectedPerson.name}
                              className="w-16 h-16 rounded-full"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center">
                              <span className="text-2xl font-medium text-indigo-700">
                                {selectedPerson.name.charAt(0)}
                              </span>
                            </div>
                          )}
                          <div>
                            <h2 className="text-xl font-semibold text-white">
                              {selectedPerson.name}
                            </h2>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 mt-1">
                              {formatEnumValue(selectedPerson.role)}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-6">
                          {selectedPerson.leadingProjects &&
                            selectedPerson.leadingProjects.length > 0 && (
                              <div>
                                <h3 className="text-sm font-medium text-white mb-2">
                                  Leading Projects
                                </h3>
                                <div className="bg-[#020817] rounded-lg p-4">
                                  <div className="space-y-2">
                                    {selectedPerson.leadingProjects.map(
                                      (project) => (
                                        <div
                                          key={project.id}
                                          className="flex items-center justify-between"
                                        >
                                          <span className="text-sm text-white">
                                            {project.name}
                                          </span>
                                          <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                      ${
                                        project.status === "Under_Development"
                                          ? "bg-yellow-100 text-yellow-800"
                                          : project.status === "Deployed"
                                          ? "bg-green-100 text-green-800"
                                          : project.status ===
                                            "Developed_Not_Deployed"
                                          ? "bg-gray-100 text-gray-800"
                                          : "bg-blue-100 text-blue-800"
                                      }`}
                                          >
                                            {formatEnumValue(project.status)}
                                          </span>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}

                          {selectedPerson.memberOfProjects &&
                            selectedPerson.memberOfProjects.length > 0 && (
                              <div>
                                <h3 className="text-sm font-medium text-white mb-2">
                                  Member of Projects
                                </h3>
                                <div className="bg-[#020817] rounded-lg p-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    {selectedPerson.memberOfProjects.map(
                                      (project) => (
                                        <div
                                          key={project.id}
                                          className="text-sm text-white"
                                        >
                                          {project.name}
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}

                          {selectedPerson.assignedHardware &&
                            selectedPerson.assignedHardware.length > 0 && (
                              <div>
                                <h3 className="text-sm font-medium text-white mb-2">
                                  Assigned Hardware
                                </h3>
                                <div className="bg-[#020817] rounded-lg p-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    {selectedPerson.assignedHardware.map(
                                      (item) => (
                                        <div
                                          key={item.id}
                                          className="flex items-center space-x-2"
                                        >
                                          <svg
                                            className="h-4 w-4 text-gray-400"
                                            fill="none"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                          >
                                            <path d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                          </svg>
                                          <span className="text-sm text-white">
                                            {item.name}
                                          </span>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-transparent px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-gray-800 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-700 hover:bg-gray-700 sm:mt-0 sm:w-auto"
                      onClick={() => setSelectedPerson(null)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
