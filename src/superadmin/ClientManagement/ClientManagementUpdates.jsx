import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaBullhorn, FaImage, FaFilePdf, FaVideo, FaFont, FaThumbsUp, FaThumbsDown, FaPaperPlane, FaTrash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "../../components/Loader/Loader";
import "./ClientManagementUpdates.css";


const ClientManagementUpdates = () => {
    const [activeTab, setActiveTab] = useState("compose");
    const [updates, setUpdates] = useState([]);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        type: "image", // image, pdf, video, text
        youtubeLink: "",
        targetAudience: "all", // all, specific
        targetClients: [], // array of client IDs
    });
    const [files, setFiles] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const [youtubeLinks, setYoutubeLinks] = useState([""]); // Start with one empty link

    useEffect(() => {
        if (activeTab === "history") {
            fetchUpdates();
        }
        // Fetch clients once
        fetchClients();
    }, [activeTab]);

    const fetchUpdates = async () => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 5000)); // 5 Second Delay
            const token = sessionStorage.getItem("TOKEN");
            const res = await axios.get("https://nxorsystems-backend-xglw.onrender.com/api/superadmin/promotional-updates/all", {
                headers: { "Authorization": `Bearer ${token}` },
                withCredentials: true
            });
            if (res.data.success) {
                setUpdates(res.data.updates);
            }
        } catch (error) {
            console.error("Error fetching updates:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchClients = async () => {
        try {
            const token = sessionStorage.getItem("TOKEN");
            const res = await axios.get("https://nxorsystems-backend-xglw.onrender.com/api/superadmin/data/all-clients", {
                headers: { "Authorization": `Bearer ${token}` },
                withCredentials: true
            });
            if (res.data.success) {
                setClients(res.data.data);
            }
        } catch (err) {
            console.error("Error fetching clients:", err);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const toggleClientSelection = (clientId) => {
        setFormData(prev => {
            const current = prev.targetClients;
            if (current.includes(clientId)) {
                return { ...prev, targetClients: current.filter(id => id !== clientId) };
            } else {
                return { ...prev, targetClients: [...current, clientId] };
            }
        });
    };

    const handleSelectAll = () => {
        if (formData.targetClients.length === clients.length) {
            setFormData({ ...formData, targetClients: [] });
        } else {
            setFormData({ ...formData, targetClients: clients.map(c => c._id) });
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFiles = Array.from(e.target.files);
            setFiles(selectedFiles);

            // Create previews
            const urls = selectedFiles.map(file => URL.createObjectURL(file));
            setPreviewUrls(urls);
        } else {
            setFiles([]);
            setPreviewUrls([]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = sessionStorage.getItem("TOKEN");
            const data = new FormData();
            data.append("title", formData.title);
            data.append("description", formData.description);
            data.append("type", formData.type);

            // Append target audience data
            data.append("targetAudience", formData.targetAudience);
            if (formData.targetAudience === 'specific') {
                data.append("targetClients", JSON.stringify(formData.targetClients));
            }

            // Append Youtube Links
            // Remove empty links
            const validLinks = youtubeLinks.filter(link => link.trim() !== "");
            if (validLinks.length > 0) {
                validLinks.forEach(link => {
                    data.append("youtubeLinks", link);
                });
                // Legacy support (first link)
                data.append("youtubeLink", validLinks[0]);
            }

            if (files.length > 0) {
                files.forEach(file => {
                    data.append("files", file);
                });
            }

            const res = await axios.post("https://nxorsystems-backend-xglw.onrender.com/api/superadmin/promotional-updates/create", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${token}`
                },
                withCredentials: true
            });

            if (res.data.success) {
                alert("Update Broadcasted Successfully!");
                setFormData({
                    title: "",
                    description: "",
                    type: "image",
                    youtubeLink: "",
                    targetAudience: "all",
                    targetClients: []
                });
                setFiles([]);
                setPreviewUrls([]);
                setYoutubeLinks([""]);
                setActiveTab("history");
            }
        } catch (error) {
            console.error("Error creating update:", error);
            const msg = error.response?.data?.message || "Failed to send update. Check console for details.";
            alert(`Error: ${msg}`);
        } finally {
            setLoading(false);
        }
    };

    const getYouTubeEmbedUrl = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
    };

    const getStats = (reactions) => {
        const interested = reactions.filter(r => r.status === 'interested').length;
        const notInterested = reactions.filter(r => r.status === 'not_interested').length;
        return { interested, notInterested };
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this update? This action cannot be undone.")) return;

        try {
            const token = sessionStorage.getItem("TOKEN");
            const res = await axios.delete(`https://nxorsystems-backend-xglw.onrender.com/api/superadmin/promotional-updates/delete/${id}`, {
                headers: { "Authorization": `Bearer ${token}` },
                withCredentials: true
            });
            if (res.data.success) {
                setUpdates(prev => prev.filter(u => u._id !== id));
            }
        } catch (error) {
            console.error("Error deleting update:", error);
            alert("Failed to delete update.");
        }
    };

    const [viewOpinions, setViewOpinions] = useState(null);

    return (
        <div className="Updates-container">
            <div className="Updates-header">
                <h1 className="Updates-title">Client Updates Center</h1>
            </div>

            <div className="Updates-tabs">
                <button
                    className={`Updates-tab ${activeTab === "compose" ? "active" : ""}`}
                    onClick={() => setActiveTab("compose")}
                >
                    Compose Update
                </button>
                <button
                    className={`Updates-tab ${activeTab === "history" ? "active" : ""}`}
                    onClick={() => setActiveTab("history")}
                >
                    Sent History
                </button>
            </div>

            {activeTab === "compose" ? (
                <div className="Updates-content">
                    {/* Form Side */}
                    <motion.div
                        className="Updates-form-card"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h3 className="Updates-label" style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Create New Broadcast</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="Updates-form-group">
                                <label className="Updates-label">Campaign Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    className="Updates-input"
                                    placeholder="e.g., New AI Features Available!"
                                    required
                                    value={formData.title}
                                    onChange={handleInputChange}
                                />
                            </div>

                            {/* TARGETING SECTION */}
                            <div className="Updates-form-group">
                                <label className="Updates-label">Target Audience</label>
                                <select
                                    name="targetAudience"
                                    className="Updates-select"
                                    value={formData.targetAudience}
                                    onChange={handleInputChange}
                                    style={{ marginBottom: '10px' }}
                                >
                                    <option value="all">Broadcast to All Clients</option>
                                    <option value="specific">Target Specific Clients</option>
                                </select>

                                {formData.targetAudience === 'specific' && (
                                    <div style={{ padding: '15px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', maxHeight: '300px', overflowY: 'auto' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                            <label className="Updates-label" style={{ fontSize: '0.9rem', marginBottom: 0 }}>Select Clients</label>
                                            <button
                                                type="button"
                                                onClick={handleSelectAll}
                                                style={{ border: 'none', background: 'transparent', color: '#2563eb', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }}
                                            >
                                                {formData.targetClients.length === clients.length ? "Deselect All" : "Select All"}
                                            </button>
                                        </div>

                                        <div className="Updates-client-list" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            {clients.map(client => (
                                                <div
                                                    key={client._id}
                                                    onClick={() => toggleClientSelection(client._id)}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '10px',
                                                        padding: '8px 12px',
                                                        background: formData.targetClients.includes(client._id) ? '#eff6ff' : 'white',
                                                        border: `1px solid ${formData.targetClients.includes(client._id) ? '#bfdbfe' : '#cbd5e1'}`,
                                                        borderRadius: '8px',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s'
                                                    }}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.targetClients.includes(client._id)}
                                                        readOnly
                                                        style={{ width: '16px', height: '16px', accentColor: '#2563eb', cursor: 'pointer' }}
                                                    />
                                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                        <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1e293b' }}>{client.fullName}</span>
                                                        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{client.companyName || client.clientID}</span>
                                                    </div>
                                                </div>
                                            ))}
                                            {clients.length === 0 && <p style={{ color: '#94a3b8', fontSize: '0.9rem', textAlign: 'center' }}>No clients found.</p>}
                                        </div>
                                        <div style={{ marginTop: '10px', fontSize: '0.8rem', color: '#64748b', textAlign: 'right' }}>
                                            {formData.targetClients.length} selected
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="Updates-form-group">
                                <label className="Updates-label">Type</label>
                                <select name="type" className="Updates-select" value={formData.type} onChange={handleInputChange}>
                                    <option value="image">Image / Poster</option>
                                    <option value="video">Video (YouTube)</option>
                                    <option value="pdf">PDF Document</option>
                                    <option value="text">Text Only</option>
                                </select>
                            </div>

                            {formData.type === 'video' && (
                                <div className="Updates-form-group">
                                    <label className="Updates-label">YouTube Links</label>
                                    {youtubeLinks.map((link, index) => (
                                        <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                                            <input
                                                type="url"
                                                className="Updates-input"
                                                placeholder="https://youtube.com/..."
                                                value={link}
                                                onChange={(e) => {
                                                    const newLinks = [...youtubeLinks];
                                                    newLinks[index] = e.target.value;
                                                    setYoutubeLinks(newLinks);
                                                }}
                                            />
                                            {youtubeLinks.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newLinks = youtubeLinks.filter((_, i) => i !== index);
                                                        setYoutubeLinks(newLinks);
                                                    }}
                                                    style={{ background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '8px', width: '40px', cursor: 'pointer' }}
                                                >
                                                    <FaTrash />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => setYoutubeLinks([...youtubeLinks, ""])}
                                        style={{ background: '#eff6ff', color: '#2563eb', border: 'none', padding: '8px 12px', borderRadius: '8px', fontSize: '0.85rem', cursor: 'pointer', fontWeight: '600' }}
                                    >
                                        + Add Another Link
                                    </button>
                                </div>
                            )}

                            {(formData.type === 'image' || formData.type === 'pdf') && (
                                <div className="Updates-form-group">
                                    <label className="Updates-label">Upload File ({formData.type === 'image' ? 'JPG, PNG' : 'PDF'})</label>
                                    <input
                                        type="file"
                                        className="Updates-input"
                                        accept={formData.type === 'image' ? "image/*" : "application/pdf"}
                                        multiple
                                        onChange={handleFileChange}
                                    />
                                    {files.length > 0 && <span style={{ fontSize: '0.8rem', color: '#16a34a' }}>{files.length} file(s) selected</span>}
                                </div>
                            )}

                            <div className="Updates-form-group">
                                <label className="Updates-label">Description / Message</label>
                                <textarea
                                    name="description"
                                    className="Updates-textarea"
                                    placeholder="Write your message here..."
                                    required
                                    value={formData.description}
                                    onChange={handleInputChange}
                                ></textarea>
                            </div>

                            <button type="submit" className="Updates-btn-submit" disabled={loading}>
                                {loading ? "Sending..." : <><FaPaperPlane /> Broadcast Now</>}
                            </button>
                        </form>
                    </motion.div>

                    {/* Preview Side */}
                    <motion.div
                        className="Updates-preview-container"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h4 style={{ marginBottom: '1rem', color: '#64748b' }}>Client View Preview</h4>
                        <div className="Updates-preview-card">
                            {(formData.type === 'image' || formData.type === 'video') && (
                                <div className="Updates-media-placeholder">
                                    {previewUrls.length > 0 && formData.type === 'image' ? (
                                        <div style={{ display: 'flex', overflowX: 'auto', gap: '5px' }}>
                                            {previewUrls.map((url, idx) => (
                                                <img key={idx} src={url} alt="Preview" className="Updates-media-img" style={{ height: '200px', objectFit: 'cover' }} />
                                            ))}
                                        </div>
                                    ) : formData.type === 'video' ? (
                                        youtubeLinks.some(link => getYouTubeEmbedUrl(link)) ? (
                                            <div style={{ width: '100%', height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                {youtubeLinks.map((link, idx) => {
                                                    const embedUrl = getYouTubeEmbedUrl(link);
                                                    if (!embedUrl) return null;
                                                    return (
                                                        <iframe
                                                            key={idx}
                                                            width="100%"
                                                            height="200" // Fixed height for preview stack
                                                            src={embedUrl}
                                                            title={`Preview ${idx}`}
                                                            style={{ border: 'none', flexShrink: 0 }}
                                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                            allowFullScreen
                                                        />
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#94a3b8' }}>
                                                <FaVideo size={40} />
                                                <span style={{ fontSize: '0.8rem', marginTop: '10px' }}>Enter valid YouTube URL</span>
                                            </div>
                                        )
                                    ) : (
                                        <FaImage />
                                    )}
                                </div>
                            )}
                            {formData.type === 'pdf' && (
                                <div className="Updates-media-placeholder" style={{ height: 'auto', padding: '20px', flexDirection: 'column', gap: '10px' }}>
                                    <FaFilePdf size={40} />
                                    <div style={{ width: '100%' }}>
                                        {files.length > 0 ? (
                                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, width: '100%' }}>
                                                {files.map((f, i) => (
                                                    <li key={i} style={{ fontSize: '0.85rem', color: '#64748b', background: 'white', padding: '5px 10px', borderRadius: '4px', marginBottom: '4px', border: '1px solid #e2e8f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                        {f.name}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>No PDF selected</span>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="Updates-preview-body">
                                <h3 className="Updates-preview-title">{formData.title || "Campaign Title"}</h3>
                                <p className="Updates-preview-desc">{formData.description || "Your message description will appear here..."}</p>

                                <div className="Updates-preview-actions">
                                    <button className="Updates-action-btn interested" type="button">
                                        <FaThumbsUp /> Interested
                                    </button>
                                    <button className="Updates-action-btn not-interested" type="button">
                                        <FaThumbsDown /> Not Interested
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            ) : loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
                    <Loader />
                </div>
            ) : (
                // History Tab
                <div className="Updates-list">
                    {updates.map(update => {
                        const stats = getStats(update.reactions);
                        return (
                            <motion.div
                                key={update._id}
                                className="Updates-history-card"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>{update.type}</span>
                                    <span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>{new Date(update.createdAt).toLocaleDateString()}</span>
                                </div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem', color: '#1e293b' }}>{update.title}</h3>
                                <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                    {update.description}
                                </p>

                                {/* Target info */}
                                <div style={{ marginBottom: '10px', fontSize: '0.8rem', color: '#6366f1', background: '#eef2ff', padding: '4px 8px', borderRadius: '4px', width: 'fit-content' }}>
                                    Target: {update.targetAudience === 'all' ? 'All Clients' : `${update.targetClients?.length || 0} Specific Clients`}
                                </div>

                                <div className="Updates-stats">
                                    <div className="Updates-stat-item stat-interested">
                                        <FaThumbsUp /> {stats.interested} Interested
                                    </div>
                                    <div className="Updates-stat-item stat-not-interested">
                                        <FaThumbsDown /> {stats.notInterested} Pass
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                                    <button
                                        onClick={() => setViewOpinions(update)}
                                        style={{
                                            flex: 1,
                                            padding: '8px',
                                            border: '1px dashed #cbd5e1',
                                            background: 'transparent',
                                            color: '#64748b',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontSize: '0.9rem'
                                        }}
                                    >
                                        View Opinions
                                    </button>
                                    <button
                                        onClick={() => handleDelete(update._id)}
                                        style={{
                                            width: '40px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            border: 'none',
                                            background: '#fee2e2',
                                            color: '#ef4444',
                                            borderRadius: '8px',
                                            cursor: 'pointer'
                                        }}
                                        title="Delete Update"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                    {updates.length === 0 && <p style={{ color: '#94a3b8', textAlign: 'center', width: '100%' }}>No updates sent yet.</p>}
                </div>
            )}

            {/* OPINIONS MODAL */}
            <AnimatePresence>
                {viewOpinions && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, backdropFilter: 'blur(5px)' }}
                    >
                        <motion.div
                            initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                            style={{ background: 'white', padding: '2rem', borderRadius: '16px', width: '90%', maxWidth: '600px', maxHeight: '80vh', overflowY: 'auto', WebkitOverflowScrolling: 'touch', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1e293b' }}>Reaction Details</h3>
                                <button onClick={() => setViewOpinions(null)} style={{ background: 'transparent', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#64748b' }}>Ã—</button>
                            </div>

                            <h4 style={{ fontSize: '1rem', color: '#64748b', marginBottom: '20px', fontWeight: 'normal' }}>{viewOpinions.title}</h4>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                {/* Interested Column */}
                                <div style={{ background: '#f0fdf4', padding: '15px', borderRadius: '12px' }}>
                                    <h5 style={{ color: '#16a34a', fontWeight: '700', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}><FaThumbsUp /> Interested ({viewOpinions.reactions.filter(r => r.status === 'interested').length})</h5>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {viewOpinions.reactions.filter(r => r.status === 'interested').map((r, i) => (
                                            <div key={i} style={{ background: 'white', padding: '8px', borderRadius: '8px', fontSize: '0.85rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                                                <div style={{ fontWeight: '600' }}>{r.client?.firstName || 'Client'} {r.client?.lastName}</div>
                                                <div style={{ color: '#64748b', fontSize: '0.75rem' }}>{r.client?.clientID}</div>
                                                <div style={{ color: '#94a3b8', fontSize: '0.7rem', marginTop: '2px' }}>{new Date(r.reactedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</div>
                                            </div>
                                        ))}
                                        {viewOpinions.reactions.filter(r => r.status === 'interested').length === 0 && <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>None yet.</span>}
                                    </div>
                                </div>

                                {/* Pass Column */}
                                <div style={{ background: '#fef2f2', padding: '15px', borderRadius: '12px' }}>
                                    <h5 style={{ color: '#ef4444', fontWeight: '700', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}><FaThumbsDown /> Passed ({viewOpinions.reactions.filter(r => r.status === 'not_interested').length})</h5>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {viewOpinions.reactions.filter(r => r.status === 'not_interested').map((r, i) => (
                                            <div key={i} style={{ background: 'white', padding: '8px', borderRadius: '8px', fontSize: '0.85rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                                                <div style={{ fontWeight: '600' }}>{r.client?.firstName || 'Client'} {r.client?.lastName}</div>
                                                <div style={{ color: '#64748b', fontSize: '0.75rem' }}>{r.client?.clientID}</div>
                                                <div style={{ color: '#94a3b8', fontSize: '0.7rem', marginTop: '2px' }}>{new Date(r.reactedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</div>
                                            </div>
                                        ))}
                                        {viewOpinions.reactions.filter(r => r.status === 'not_interested').length === 0 && <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>None yet.</span>}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ClientManagementUpdates;

