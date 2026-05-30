//frontend/src/Reusable/Admin/IDGeneration/IDGeneration.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import UserForm from "./UserForm/UserForm";
import ClientList from "./ClientList/ClientList";
import "./IDGeneration.css";

const IDGeneration = () => {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://nxorsystems-backend-xglw.onrender.com/api/id-generation/get-ids");
        if (response.data) {
          setClients(response.data.clients || []);
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
      const response = await axios.post("https://nxorsystems-backend-xglw.onrender.com/api/id-generation", {
        userType,
        name,
      });
  
      if (response.status === 201) {
        const newEntry = { id: response.data.id, name, status: true };
  
        if (userType === "client") {
          setClients((prev) => [...prev, newEntry]);
        }
      }
    } catch (error) {
      console.error("Error adding new entry:", error.response?.data || error.message); // Debugging log
      alert("Failed to add the entry. Please try again.");
    }
  };
  

  const handleDelete = async (id, userType) => {
    try {
      await axios.delete(`https://nxorsystems-backend-xglw.onrender.com/api/id-generation/${id}`);
      if (userType === "client") {
        setClients((prev) => prev.filter((client) => client.id !== id));
      }
    } catch (error) {
      console.error("Error deleting entry:", error);
      alert("Failed to delete the entry.");
    }
  };

  const handleToggleStatus = async (id, userType) => {
    try {
      const response = await axios.put(`https://nxorsystems-backend-xglw.onrender.com/api/id-generation/status/${id}`);
      const updatedEntry = response.data;

      if (userType === "client") {
        setClients((prev) =>
          prev.map((client) =>
            client.id === id ? { ...client, status: updatedEntry.status } : client
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
      </div>
    </div>
  );
};

export default IDGeneration;

