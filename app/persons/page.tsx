"use client";

import { useState, useEffect } from "react";
import { Person } from "@/app/types";
import { PersonForm } from "@/app/components/PersonForm";

export default function PersonsPage() {
  const [persons, setPersons] = useState<Person[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);

  useEffect(() => {
    fetchPersons();
  }, []);

  const fetchPersons = async () => {
    const response = await fetch("/api/persons");
    const data = await response.json();
    setPersons(data);
  };

  const handleSubmit = async (formData: any) => {
    const url = editingPerson
      ? `/api/persons/${editingPerson.id}`
      : "/api/persons";

    const response = await fetch(url, {
      method: editingPerson ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      fetchPersons();
      setIsFormOpen(false);
      setEditingPerson(null);
    }
  };

  const handleDelete = async (personId: string) => {
    if (!confirm("Are you sure you want to delete this person?")) return;

    const response = await fetch(`/api/persons/${personId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      fetchPersons();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Team Members</h1>
        <button
          onClick={() => {
            setEditingPerson(null);
            setIsFormOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          New Person
        </button>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-gray-50/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-5 max-w-2xl w-full">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              {editingPerson ? "Edit Person" : "New Person"}
            </h2>
            <PersonForm onSubmit={handleSubmit} initialData={editingPerson} />
            <button
              onClick={() => {
                setIsFormOpen(false);
                setEditingPerson(null);
              }}
              className="mt-4 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {persons.map((person) => (
          <div key={person.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center mb-4">
              {person.picture && (
                <img
                  src={person.picture}
                  alt={person.name}
                  className="w-16 h-16 rounded-full mr-4 object-cover"
                />
              )}
              <div>
                <h3 className="text-xl font-semibold">{person.name}</h3>
                <p className="text-gray-600">{person.role}</p>
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setEditingPerson(person);
                  setIsFormOpen(true);
                }}
                className="bg-blue-100 text-blue-600 px-3 py-1 rounded hover:bg-blue-200"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(person.id)}
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
