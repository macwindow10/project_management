"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import TaskList from "@/app/components/TaskList";
import { Person, Project, Task } from "@/app/types";

export default function ProjectTasksPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params?.id as string;
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [persons, setPersons] = useState<Person[]>([]);

  useEffect(() => {
    fetchProject();
    fetchTasks();
    fetchPersons();
  }, [projectId]);

  const fetchProject = async () => {
    const response = await fetch(`/api/projects/${projectId}`);
    const data = await response.json();
    setProject(data);
  };

  const fetchTasks = async () => {
    const response = await fetch(`/api/tasks?projectId=${projectId}`);
    const data = await response.json();
    setTasks(data);
  };

  const fetchPersons = async () => {
    const response = await fetch("/api/persons");
    const data = await response.json();
    setPersons(data);
  };

  if (!project) return <div className="p-8">Loading project...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tasks for {project.name}</h1>
        <button
          onClick={() => router.back()}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
        >
          Back
        </button>
      </div>
      <TaskList
        projectId={projectId}
        tasks={tasks}
        persons={persons}
        onClose={() => router.back()}
        onTasksChange={fetchTasks}
      />
    </div>
  );
}
