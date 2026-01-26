//frontend/src/Reusable/Admin/IDGeneration/IDGeneration.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import UserForm from "./UserForm/UserForm";
import ClientList from "./ClientList/ClientList";
import StudentList from "./StudentList/StudentList";
import "./IDGeneration.css";

const IDGeneration = () => {
  const [clients, setClients] = useState([]);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:1981/api/id-generation/get-ids");
        if (response.data) {
          setClients(response.data.clients || []);
          setStudents(response.data.students || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleAdd = async (name, userType) => {
    try {
      console.log("Adding Entry:", { userType, name }); // Debugging log
      const response = await axios.post("http://localhost:1981/api/id-generation", {
        userType,
        name,
      });
  
      if (response.status === 201) {
        const newEntry = { id: response.data.id, name, status: true };
  
        if (userType === "client") {
          setClients((prev) => [...prev, newEntry]);
        } else {
          setStudents((prev) => [...prev, newEntry]);
        }
      }
    } catch (error) {
      console.error("Error adding new entry:", error.response?.data || error.message); // Debugging log
      alert("Failed to add the entry. Please try again.");
    }
  };
  

  const handleDelete = async (id, userType) => {
    try {
      await axios.delete(`http://localhost:1981/api/id-generation/${id}`);
      if (userType === "client") {
        setClients((prev) => prev.filter((client) => client.id !== id));
      } else {
        setStudents((prev) => prev.filter((student) => student.id !== id));
      }
    } catch (error) {
      console.error("Error deleting entry:", error);
      alert("Failed to delete the entry.");
    }
  };

  const handleToggleStatus = async (id, userType) => {
    try {
      const response = await axios.put(`http://localhost:1981/api/id-generation/status/${id}`);
      const updatedEntry = response.data;

      if (userType === "client") {
        setClients((prev) =>
          prev.map((client) =>
            client.id === id ? { ...client, status: updatedEntry.status } : client
          )
        );
      } else {
        setStudents((prev) =>
          prev.map((student) =>
            student.id === id ? { ...student, status: updatedEntry.status } : student
          )
        );
      }
    } catch (error) {
      console.error("Error toggling status:", error);
      alert("Failed to toggle status.");
    }
  };

  return (
    <div className="IDGeneration-container">
      <h2>ID Generation System</h2>
      <UserForm onAdd={handleAdd} />
      <div className="IDGeneration-List">
        <ClientList
          clients={clients}
          toggleStatus={(id) => handleToggleStatus(id, "client")}
          handleDelete={(id) => handleDelete(id, "client")}
        />
        <StudentList
          students={students}
          toggleStatus={(id) => handleToggleStatus(id, "student")}
          handleDelete={(id) => handleDelete(id, "student")}
        />
      </div>
    </div>
  );
};

export default IDGeneration;
