import React, { useEffect, useState } from "react";
import { useIDGeneration } from "../../context/IDGenerationContext";
import { useAuth } from "../../context/AuthContext";
import "./IDGeneration.css";

const IDGeneration = () => {
  const { ids, fetchIDs, createID, toggleStatus, deleteID, approveID } =
    useIDGeneration();
  const { userRole } = useAuth();

  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    category: "Student",
    fullName: "",
  });

  useEffect(() => {
    fetchIDs(search);
  }, [search]);

  const handleCreate = async () => {
    if (!form.fullName.trim()) {
      alert("Full Name is required");
      return;
    }

    try {
      await createID(form);
      setForm({ ...form, fullName: "" });
    } catch (err) {
      alert(err.response?.data?.message || "ID creation failed");
    }
  };

  return (
    <div className="idgeneration-container">
      <div className="idgeneration-header">
        <h2 className="idgeneration-title">ID Generation</h2>
        <p className="idgeneration-subtitle">
          Manage and generate unique identifiers for your organization.
        </p>
      </div>

      <div className="idgeneration-card">
        <div className="idgeneration-controls-wrapper">
          {/* SEARCH */}
          <div className="idgeneration-input-group">
            <label className="idgeneration-label">Search Records</label>
            <input
              className="idgeneration-input"
              type="text"
              placeholder="Search by ID or Name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* CREATE FORM (SUPER ADMIN ONLY) */}
          {userRole === "superadmin" && (
            <div className="idgeneration-create-form">
              <div className="idgeneration-input-group">
                <label className="idgeneration-label">Category</label>
                <select
                  className="idgeneration-select"
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                >
                  <option value="Student">Student</option>
                  <option value="Client">Client</option>
                  <option value="Employee">Employee</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="idgeneration-input-group">
                <label className="idgeneration-label">Full Name</label>
                <input
                  className="idgeneration-input"
                  type="text"
                  placeholder="Enter Full Name"
                  value={form.fullName}
                  onChange={(e) =>
                    setForm({ ...form, fullName: e.target.value })
                  }
                />
              </div>

              <button className="idgeneration-create-btn" onClick={handleCreate}>
                Generate ID
              </button>
            </div>
          )}
        </div>
      </div>

      {/* TABLE */}
      <div className="idgeneration-card">
        <div className="idgeneration-table-container">
          <table className="idgeneration-table">
            <thead className="idgeneration-thead">
              <tr>
                <th className="idgeneration-th">Unique ID</th>
                <th className="idgeneration-th">Category</th>
                <th className="idgeneration-th">Full Name</th>
                <th className="idgeneration-th">Approval</th>
                <th className="idgeneration-th">Status</th>
                <th className="idgeneration-th">Actions</th>
              </tr>
            </thead>
            <tbody className="idgeneration-tbody">
              {ids.map((item) => (
                <tr key={item._id}>
                  <td className="idgeneration-td">
                    <strong>{item.generatedID}</strong>
                  </td>
                  <td className="idgeneration-td">{item.category}</td>
                  <td className="idgeneration-td">{item.fullName}</td>

                  <td className="idgeneration-td">
                    <span
                      className={`idgeneration-badge ${item.approved ? "approved" : "pending"
                        }`}
                    >
                      {item.approved ? "Approved" : "Pending"}
                    </span>
                  </td>

                  <td className="idgeneration-td">
                    <span
                      className={`idgeneration-badge ${item.status === "Active" ? "active" : "inactive"
                        }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="idgeneration-td">
                    <div className="idgeneration-actions">
                      {userRole === "superadmin" && (
                        <>
                          {!item.approved && (
                            <button
                              className="idgeneration-action-btn idgeneration-btn-approve"
                              onClick={() => approveID(item._id)}
                            >
                              Approve
                            </button>
                          )}

                          <button
                            className="idgeneration-action-btn idgeneration-btn-toggle"
                            onClick={() => toggleStatus(item._id)}
                          >
                            {item.status === "Active" ? "Deactivate" : "Activate"}
                          </button>

                          <button
                            className="idgeneration-action-btn idgeneration-btn-delete"
                            onClick={() => {
                              if (
                                window.confirm(
                                  "Are you sure you want to delete this ID?"
                                )
                              ) {
                                deleteID(item._id);
                              }
                            }}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {ids.length === 0 && (
                <tr>
                  <td colSpan="6" className="idgeneration-td" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                    No IDs found. Generate one to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default IDGeneration;
