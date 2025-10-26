import { useState } from "react";
import { Task, Person } from "@/app/types";

interface TaskListProps {
  projectId: string;
  tasks: Task[];
  persons: Person[];
  onClose: () => void;
  onTasksChange: () => void;
}

export default function TaskList({
  projectId,
  tasks,
  persons,
  onClose,
  onTasksChange,
}: TaskListProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    personId: "",
    startDate: "",
    endDate: "",
    status: "Created",
  });

  const openNewTaskForm = () => {
    setEditingTask(null);
    setFormData({
      title: "",
      personId: "",
      startDate: "",
      endDate: "",
      status: "Created",
    });
    setIsFormOpen(true);
  };

  const openEditTaskForm = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      personId: task.personId || "",
      startDate: task.startDate
        ? new Date(task.startDate).toISOString().split("T")[0]
        : "",
      endDate: task.endDate
        ? new Date(task.endDate).toISOString().split("T")[0]
        : "",
      status: task.status,
    });
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    const url = editingTask ? `/api/tasks/${editingTask.id}` : "/api/tasks";
    const method = editingTask ? "PUT" : "POST";
    const payload = {
      ...formData,
      projectId,
    };
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (response.ok) {
      setIsFormOpen(false);
      setEditingTask(null);
      onTasksChange();
    }
  };

  const handleStatusUpdate = async (task: Task, status: string) => {
    const response = await fetch(`/api/tasks/${task.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...task, status }),
    });
    if (response.ok) {
      onTasksChange();
    }
  };

  return (
    <div>
      <button
        onClick={openNewTaskForm}
        className="mb-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-800"
      >
        New Task
      </button>
      <button
        onClick={onClose}
        className="mb-3 ml-2 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
      >
        Close
      </button>
      <div className="space-y-3">
        {tasks.length === 0 && (
          <div className="text-gray-500">No tasks found.</div>
        )}
        {tasks.map((task) => (
          <div key={task.id} className="border rounded p-3 bg-gray-50">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold text-lg">{task.title}</div>
                <div className="text-sm text-gray-600">
                  Assigned to:{" "}
                  {persons.find((p) => p.id === task.personId)?.name ||
                    "Unassigned"}
                </div>
                <div className="text-sm text-gray-600">
                  Start:{" "}
                  {task.startDate
                    ? new Date(task.startDate).toLocaleDateString()
                    : ""}
                </div>
                <div className="text-sm text-gray-600">
                  End:{" "}
                  {task.endDate
                    ? new Date(task.endDate).toLocaleDateString()
                    : ""}
                </div>
                <div className="text-sm text-gray-600">
                  Status: {task.status}
                </div>
              </div>
              <div className="flex flex-col space-y-1">
                <button
                  onClick={() => openEditTaskForm(task)}
                  className="px-2 py-1 bg-black text-white rounded hover:bg-neutral-800 text-xs"
                >
                  Edit
                </button>
                <select
                  value={task.status}
                  onChange={(e) => handleStatusUpdate(task, e.target.value)}
                  className="text-xs p-1 rounded border"
                >
                  <option value="Created">Created</option>
                  <option value="InProgress">InProgress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
      {isFormOpen && (
        <div className="fixed inset-0 bg-gray-50/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-5 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-3">
              {editingTask ? "Edit Task" : "New Task"}
            </h3>
            <form onSubmit={handleFormSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Assign to
                </label>
                <select
                  value={formData.personId}
                  onChange={(e) =>
                    setFormData({ ...formData, personId: e.target.value })
                  }
                  className="w-full border rounded p-2"
                >
                  <option value="">Unassigned</option>
                  {persons.map((person) => (
                    <option key={person.id} value={person.id}>
                      {person.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full border rounded p-2"
                >
                  <option value="Created">Created</option>
                  <option value="InProgress">InProgress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-800"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
