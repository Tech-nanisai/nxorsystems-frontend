
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaFileUpload, FaSearch, FaFilePdf, FaFileWord, FaFileImage, FaFileAlt, FaTimes, FaCloudUploadAlt, FaSpinner } from "react-icons/fa";
import "./DocumentsDashboard.css";

const API_URL = "https://nxorsystems-backend-xglw.onrender.com/api/superadmin/documents";

const DocumentsDashboard = () => {
    // ---------------- STATE ----------------
    const [documents, setDocuments] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    // Modal State
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState(null);

    // Form State for New Upload
    const [newDocForm, setNewDocForm] = useState({
        name: "",
        sentTo: "",
        type: "pdf",
        description: "",
        file: null
    });

    const fileInputRef = useRef(null);

    // ---------------- EFFECTS ----------------
    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            const token = sessionStorage.getItem("TOKEN");
            const res = await axios.get(`${API_URL}/all`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setDocuments(res.data.documents);
            }
        } catch (error) {
            console.error("Error fetching documents:", error);
        }
    };

    // ---------------- HELPERS ----------------
    const getFileIcon = (type) => {
        switch (type) {
            case "pdf": return <FaFilePdf className="doc-icon pdf" />;
            case "word": case "docx": return <FaFileWord className="doc-icon word" />;
            case "image": case "png": case "jpg": return <FaFileImage className="doc-icon image" />;
            default: return <FaFileAlt className="doc-icon default" />;
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        return dateString.split('T')[0];
    };

    // ---------------- HANDLERS ----------------

    // 1. DELETE
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this document?")) {
            try {
                const token = sessionStorage.getItem("TOKEN");
                await axios.delete(`${API_URL}/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // Update state
                setDocuments(documents.filter(doc => doc._id !== id));
            } catch (error) {
                console.error("Delete error:", error);
                alert("Failed to delete document");
            }
        }
    };

    // 2. VIEW
    const handleView = (doc) => {
        setSelectedDoc(doc);
        setIsViewModalOpen(true);
    };

    // 3. UPLOAD START
    const openUploadModal = () => {
        setNewDocForm({ name: "", sentTo: "", type: "pdf", description: "", file: null });
        setIsUploadModalOpen(true);
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Auto-detect type
            let autoType = newDocForm.type;
            const ext = file.name.split('.').pop().toLowerCase();

            if (['pdf'].includes(ext)) autoType = 'pdf';
            if (['doc', 'docx'].includes(ext)) autoType = 'word';
            if (['png', 'jpg', 'jpeg', 'gif'].includes(ext)) autoType = 'image';
            if (['zip', 'rar'].includes(ext)) autoType = 'zip';

            setNewDocForm({
                ...newDocForm,
                file: file,
                name: newDocForm.name || file.name.split('.')[0],
                type: autoType
            });
        }
    };

    const triggerFileSelect = () => {
        fileInputRef.current.click();
    };

    // 4. SUBMIT UPLOAD
    const [isUploading, setIsUploading] = useState(false);

    const handleUploadSubmit = async (e) => {
        e.preventDefault();

        if (!newDocForm.name || !newDocForm.sentTo) {
            alert("Please fill in all required fields.");
            return;
        }

        if (!newDocForm.file) {
            alert("Please select a file.");
            return;
        }

        setIsUploading(true);

        const formData = new FormData();
        formData.append("name", newDocForm.name);
        formData.append("sentTo", newDocForm.sentTo);
        formData.append("type", newDocForm.type);
        formData.append("description", newDocForm.description || "");
        formData.append("file", newDocForm.file);

        try {
            const token = sessionStorage.getItem("TOKEN");
            const res = await axios.post(`${API_URL}/upload`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            if (res.data.success) {
                setDocuments([res.data.document, ...documents]);
                alert("Document sent successfully!");
                setIsUploadModalOpen(false);
            }
        } catch (error) {
            console.error("Upload Error:", error);
            alert("Failed to upload document");
        } finally {
            setIsUploading(false);
        }
    };

    // Filter Logic
    const filteredDocuments = documents.filter(doc =>
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.sentTo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="DocumentsDashboard-container">
            {/* --- HEADER --- */}
            <div className="DocumentsDashboard-header">
                <div>
                    <h2 className="DocumentsDashboard-title">Document Management</h2>
                    <p className="DocumentsDashboard-subtitle">Send agreements, policies, and promotional materials to clients.</p>
                </div>
                <button className="DocumentsDashboard-upload-btn" onClick={openUploadModal}>
                    <FaFileUpload /> Upload New Document
                </button>
            </div>

            {/* --- CONTROLS --- */}
            <div className="DocumentsDashboard-controls">
                <div className="search-bar">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search documents or Client ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* --- TABLE LIST --- */}
            <div className="DocumentsDashboard-list">
                <div className="doc-table-header">
                    <span>Document Name</span>
                    <span>Sent To</span>
                    <span>Date Sent</span>
                    <span>Size</span>
                    <span>Actions</span>
                </div>

                {filteredDocuments.length > 0 ? (
                    filteredDocuments.map(doc => (
                        <div key={doc._id} className="doc-table-row glass-effect">
                            <div className="doc-info">
                                {getFileIcon(doc.type)}
                                <span className="doc-name">{doc.name}</span>
                            </div>
                            <div className="doc-recipient">
                                <span className={doc.sentTo === "All Clients" ? "badge badge-all" : "badge badge-client"}>
                                    {doc.sentTo}
                                </span>
                            </div>
                            <div className="doc-date">{doc.date || formatDate(doc.createdAt)}</div>
                            <div className="doc-size">{doc.size}</div>
                            <div className="doc-actions">
                                <button className="action-btn view" onClick={() => handleView(doc)}>View</button>
                                <button className="action-btn delete" onClick={() => handleDelete(doc._id)}>Delete</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-docs-found">
                        No documents found matching "{searchTerm}"
                    </div>
                )}
            </div>

            {/* --- UPLOAD MODAL --- */}
            {isUploadModalOpen && (
                <div className="doc-modal-overlay" onClick={() => setIsUploadModalOpen(false)}>
                    <div className="doc-modal-content" onClick={e => e.stopPropagation()}>
                        <div className="doc-modal-header">
                            <h3 className="doc-modal-title">Upload New Document</h3>
                            <button className="doc-modal-close" onClick={() => setIsUploadModalOpen(false)}>
                                <FaTimes />
                            </button>
                        </div>
                        <form onSubmit={handleUploadSubmit}>
                            <div className="doc-form-group">
                                <label className="doc-form-label">Document Name</label>
                                <input
                                    type="text"
                                    className="doc-form-input"
                                    placeholder="e.g. Service Agreement 2024"
                                    value={newDocForm.name}
                                    onChange={e => setNewDocForm({ ...newDocForm, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="doc-form-group">
                                <label className="doc-form-label">Recipient (Client ID)</label>
                                <input
                                    type="text"
                                    className="doc-form-input"
                                    placeholder="Enter Client ID or 'All Clients'"
                                    value={newDocForm.sentTo}
                                    onChange={e => setNewDocForm({ ...newDocForm, sentTo: e.target.value })}
                                    required
                                />
                                <small style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Type "All Clients" to broadcast.</small>
                            </div>

                            <div className="doc-form-group">
                                <label className="doc-form-label">File Type</label>
                                <select
                                    className="doc-form-select"
                                    value={newDocForm.type}
                                    onChange={e => setNewDocForm({ ...newDocForm, type: e.target.value })}
                                >
                                    <option value="pdf">PDF Document</option>
                                    <option value="word">Word Document</option>
                                    <option value="image">Image (JPG/PNG)</option>
                                    <option value="zip">ZIP Archive</option>
                                </select>
                            </div>

                            <div className="doc-form-group">
                                <label className="doc-form-label">Description (Optional)</label>
                                <textarea
                                    className="doc-form-textarea"
                                    placeholder="Brief details about the document..."
                                    value={newDocForm.description}
                                    onChange={e => setNewDocForm({ ...newDocForm, description: e.target.value })}
                                ></textarea>
                            </div>

                            {/* Hidden Input */}
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                onChange={handleFileSelect}
                            />

                            <div className="doc-file-drop" onClick={triggerFileSelect}>
                                <FaCloudUploadAlt style={{ fontSize: '32px', marginBottom: '8px' }} />
                                {newDocForm.file ? (
                                    <div>
                                        <p style={{ color: '#0f172a', fontWeight: '600' }}>{newDocForm.file.name}</p>
                                        <p style={{ fontSize: '0.8rem' }}>
                                            {(newDocForm.file.size / 1024).toFixed(1)} KB - Ready to Upload
                                        </p>
                                    </div>
                                ) : (
                                    <p>Click to select file</p>
                                )}
                            </div>

                            <div className="doc-modal-actions">
                                <button type="button" className="doc-btn-cancel" onClick={() => setIsUploadModalOpen(false)}>Cancel</button>
                                <button type="submit" className="doc-btn-submit" disabled={isUploading}>
                                    {isUploading ? (
                                        <>
                                            <FaSpinner className="icon-spin" style={{ marginRight: '8px' }} /> Uploading...
                                        </>
                                    ) : "Upload & Send"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* --- VIEW DETAILS MODAL --- */}
            {isViewModalOpen && selectedDoc && (
                <div className="doc-modal-overlay" onClick={() => setIsViewModalOpen(false)}>
                    <div className="doc-modal-content" onClick={e => e.stopPropagation()}>
                        <div className="doc-modal-header">
                            <h3 className="doc-modal-title">Document Details</h3>
                            <button className="doc-modal-close" onClick={() => setIsViewModalOpen(false)}>
                                <FaTimes />
                            </button>
                        </div>
                        <div className="doc-modal-body" style={{ padding: '24px' }}>
                            <div className="doc-detail-row">
                                <span className="doc-detail-label">File Name:</span>
                                <span className="doc-detail-value">{selectedDoc.name}</span>
                            </div>
                            <div className="doc-detail-row">
                                <span className="doc-detail-label">Sent To:</span>
                                <span className="doc-detail-value">{selectedDoc.sentTo}</span>
                            </div>
                            <div className="doc-detail-row">
                                <span className="doc-detail-label">Date Sent:</span>
                                <span className="doc-detail-value">{selectedDoc.date}</span>
                            </div>
                            <div className="doc-detail-row">
                                <span className="doc-detail-label">File Size:</span>
                                <span className="doc-detail-value">{selectedDoc.size}</span>
                            </div>
                            <div className="doc-detail-row">
                                <span className="doc-detail-label">Type:</span>
                                <span className="doc-detail-value" style={{ textTransform: 'uppercase' }}>{selectedDoc.type}</span>
                            </div>
                            <div className="doc-detail-row" style={{ flexDirection: 'column', gap: '8px', borderBottom: 'none' }}>
                                <span className="doc-detail-label">Description:</span>
                                <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.5', color: '#334155' }}>
                                    {selectedDoc.description}
                                </p>
                            </div>
                        </div>
                        <div className="doc-modal-actions">
                            <button className="doc-btn-cancel" onClick={() => setIsViewModalOpen(false)}>Close</button>
                            <button className="doc-btn-submit" onClick={() => window.open(`https://nxorsystems-backend-xglw.onrender.com/api/superadmin/documents/download/${selectedDoc._id}?token=${sessionStorage.getItem('TOKEN')}`, '_blank')}>Download File</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default DocumentsDashboard;

