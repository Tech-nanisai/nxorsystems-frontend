import { createContext, useContext, useState } from "react";
import axios from "axios";

const IDGenerationContext = createContext(null);

export const useIDGeneration = () => useContext(IDGenerationContext);

export const IDGenerationProvider = ({ children }) => {
  const [ids, setIds] = useState([]);
  const [loading, setLoading] = useState(false);

  const api = axios.create({
    baseURL: "https://nxorsystems-backend-xglw.onrender.com/api/global/id",
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("TOKEN")}`,
      "Content-Type": "application/json",
    },
  });

  const fetchIDs = async (search = "") => {
    try {
      setLoading(true);
      const res = await api.get("/all", { params: { search } });
      if (res.data?.success) {
        setIds(res.data.data);
      }
    } catch (err) {
      console.error("fetchIDs error:", err);
    } finally {
      setLoading(false);
    }
  };

  const createID = async (payload) => {
    try {
      setLoading(true);
      const res = await api.post("/create", payload);
      await fetchIDs();
      return res.data;
    } catch (err) {
      console.error("createID error:", err.response?.data || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const approveID = async (id) => {
    try {
      setLoading(true);
      const res = await api.put(`/approve/${id}`);
      await fetchIDs();
      return res.data;
    } catch (err) {
      console.error("approveID error:", err.response?.data || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id) => {
    try {
      setLoading(true);
      const res = await api.put(`/status/${id}`);
      await fetchIDs();
      return res.data;
    } catch (err) {
      console.error("toggleStatus error:", err.response?.data || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteID = async (id) => {
    try {
      setLoading(true);
      const res = await api.delete(`/delete/${id}`);
      await fetchIDs();
      return res.data;
    } catch (err) {
      console.error("deleteID error:", err.response?.data || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <IDGenerationContext.Provider
      value={{
        ids,
        loading,
        fetchIDs,
        createID,
        approveID,
        toggleStatus,
        deleteID,
      }}
    >
      {children}
    </IDGenerationContext.Provider>
  );
};

