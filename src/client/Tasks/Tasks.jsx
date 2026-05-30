// frontend/src/client/Tasks/Tasks.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTasks, FaPlus, FaTrash, FaCheckCircle, FaExclamationCircle, FaClock, FaCalendarAlt, FaSpinner } from "react-icons/fa";
import Loader from "../../components/Loader/Loader";
import { useClientAuth } from "../../context/ClientAuthContext";
import "./Tasks.css";

const Tasks = () => {
    const { clientToken } = useClientAuth();

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("All"); // All, Pending, Completed

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTask, setNewTask] = useState({
        title: "",
        description: "",
        priority: "Medium",
        dueDate: ""
    });
    const [submitting, setSubmitting] = useState(false);

    // Fetch Tasks
    const fetchTasks = async () => {
        try {
            const res = await axios.get("https://nxorsystems-backend-xglw.onrender.com/api/client/dashboard/tasks", {
                headers: { Authorization: `Bearer ${clientToken}` }
            });
            if (res.data.success) {
                setTasks(res.data.data);
            }
        } catch (err) {
            console.error("Fetch Tasks Error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (clientToken) fetchTasks();
    }, [clientToken]);

    // Handlers
    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newTask.title) return;
        setSubmitting(true);
        // Sanitize Payload
        const payload = { ...newTask };
        if (!payload.dueDate) delete payload.dueDate; // Remove empty date string to avoid Backend Error

        try {
            await axios.post(
                "https://nxorsystems-backend-xglw.onrender.com/api/client/dashboard/tasks",
                payload,
                { headers: { Authorization: `Bearer ${clientToken}` } }
            );
            fetchTasks();
            setIsModalOpen(false);
            setNewTask({ title: "", description: "", priority: "Medium", dueDate: "" });
            // alert("Task created successfully!");
        } catch (err) {
            console.error("Create Task Error:", err);
            const msg = err.response?.data?.message || err.message;
            alert(`Failed to create task: ${msg}`);
        } finally {
            setSubmitting(false);
        }
    };

    const handleToggleStatus = async (task) => {
        const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
        try {
            // Optimistic Update
            setTasks(prev => prev.map(t => t._id === task._id ? { ...t, status: newStatus } : t));

            await axios.patch(
                `https://nxorsystems-backend-xglw.onrender.com/api/client/dashboard/tasks/${task._id}`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${clientToken}` } }
            );
        } catch (err) {
            console.error("Update error", err);
            fetchTasks(); // Revert on error
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this task?")) return;
        try {
            setTasks(prev => prev.filter(t => t._id !== id));
            await axios.delete(
                `https://nxorsystems-backend-xglw.onrender.com/api/client/dashboard/tasks/${id}`,
                { headers: { Authorization: `Bearer ${clientToken}` } }
            );
        } catch (err) {
            alert("Failed to delete");
            fetchTasks();
        }
    };

    // Render Helpers
    const getPriorityColor = (p) => {
        if (p === 'High') return 'red';
        if (p === 'Medium') return 'orange';
        return 'green';
    };

    const filteredTasks = tasks.filter(t => {
        if (filter === 'All') return true;
        if (filter === 'Pending') return t.status !== 'Completed';
        if (filter === 'Completed') return t.status === 'Completed';
        return true;
    });



    if (loading) return (
        <div className="tasks-loading-container">
            <Loader />
        </div>
    );

    return (
        <div className="client-tasks-container">
            {/* Header */}
            <div className="tasks-header">
                <div>
                    <h2><FaTasks /> My Tasks</h2>
                    <p>Manage your project requirements and personal to-dos.</p>
                </div>
                <button className="create-task-btn" onClick={() => setIsModalOpen(true)}>
                    <FaPlus /> Add Task
                </button>
            </div>

            {/* Stats / Filters */}
            <div className="tasks-controls">
                <div className="task-tabs">
                    <button className={filter === 'All' ? 'active' : ''} onClick={() => setFilter('All')}>All</button>
                    <button className={filter === 'Pending' ? 'active' : ''} onClick={() => setFilter('Pending')}>Pending</button>
                    <button className={filter === 'Completed' ? 'active' : ''} onClick={() => setFilter('Completed')}>Completed</button>
                </div>
            </div>

            {/* Task List */}
            <div className="tasks-grid">
                {filteredTasks.length === 0 ? (
                    <div className="no-tasks">
                        <FaTasks size={40} color="#cbd5e1" />
                        <p>No tasks found.</p>
                    </div>
                ) : (
                    filteredTasks.map(task => (
                        <div key={task._id} className={`task-card ${task.status === 'Completed' ? 'completed' : ''}`}>
                            <div className="task-left">
                                <button
                                    className={`status-check-btn ${task.status === 'Completed' ? 'checked' : ''}`}
                                    onClick={() => handleToggleStatus(task)}
                                >
                                    {task.status === 'Completed' ? <FaCheckCircle /> : <div className="circle-outline"></div>}
                                </button>
                                <div className="task-info">
                                    <h4 className="task-title">{task.title}</h4>
                                    {task.description && <p className="task-desc">{task.description}</p>}
                                    <div className="task-meta">
                                        {task.dueDate && (
                                            <span className="meta-item"><FaCalendarAlt /> {new Date(task.dueDate).toLocaleDateString()}</span>
                                        )}
                                        <span className={`priority-badge ${getPriorityColor(task.priority)}`}>
                                            {task.priority} Priority
                                        </span>
                                        {task.isPersonal && <span className="personal-badge">Personal</span>}
                                    </div>
                                </div>
                            </div>

                            <div className="task-actions">
                                {task.isPersonal || true ? ( // Allow deleting for now? Only personal usually
                                    <button className="delete-btn" onClick={() => handleDelete(task._id)}><FaTrash /></button>
                                ) : null}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Create Modal */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Add New Task</h3>
                        <form onSubmit={handleCreate}>
                            <label>Title</label>
                            <input
                                type="text"
                                value={newTask.title}
                                onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                                placeholder="Task title..."
                                required
                            />

                            <label>Description (Optional)</label>
                            <textarea
                                value={newTask.description}
                                onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                                placeholder="Details..."
                            />

                            <div className="form-row">
                                <div>
                                    <label>Priority</label>
                                    <select value={newTask.priority} onChange={e => setNewTask({ ...newTask, priority: e.target.value })}>
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                    </select>
                                </div>
                                <div>
                                    <label>Due Date</label>
                                    <input
                                        type="date"
                                        value={newTask.dueDate}
                                        onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button type="button" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" disabled={submitting} className="primary">
                                    {submitting ? <><FaSpinner className="icon-spin" /> Creating...</> : "Create Task"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Tasks;