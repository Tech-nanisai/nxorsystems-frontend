import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch, FaFilePdf, FaFileWord, FaFileImage, FaFileAlt, FaDownload, FaEye, FaTimes, FaSpinner } from "react-icons/fa";
import { useClientAuth } from "../../context/ClientAuthContext";
import "./ClientDocuments.css";

const API_URL = "https://nxorsystems-backend-xglw.onrender.com/api/client/documents";

const ClientDocuments = () => {
  const { client, clientToken } = useClientAuth();
  const [documents, setDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Modal & Action States
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null); // Track which doc is downloading

  // Load documents
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        if (!clientToken) return;
        const res = await axios.get(`${API_URL}/my-documents`, {
          headers: { Authorization: `Bearer ${clientToken}` }
        });
        if (res.data.success) {
          setDocuments(res.data.documents);
        }
      } catch (error) {
        console.error("Error fetching client docs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDocuments();
  }, [clientToken]);

  // --- HELPERS ---
  const getFileIcon = (type) => {
    switch (type) {
      case "pdf": return <FaFilePdf className="doc-icon pdf" />;
      case "word": case "docx": return <FaFileWord className="doc-icon word" />;
      case "image": case "png": case "jpg": return <FaFileImage className="doc-icon image" />;
      default: return <FaFileAlt className="doc-icon default" />;
    }
  };

  const formatIST = (dateString, includeTime = false) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const options = {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };
    if (includeTime) {
      options.hour = '2-digit';
      options.minute = '2-digit';
    }
    return date.toLocaleString('en-IN', options);
  };

  const isNew = (dateString) => {
    // "New" if created within last 24 hours
    if (!dateString) return false;
    return new Date(dateString) > new Date(Date.now() - 24 * 60 * 60 * 1000);
  };

  // --- ACTIONS ---
  const handleDownload = async (doc) => {
    try {
      setDownloadingId(doc._id);
      const response = await axios.get(`${API_URL}/download/${doc._id}`, {
        headers: { Authorization: `Bearer ${clientToken}` },
        responseType: 'blob', // Important for files to be handled as blobs
      });

      // Create a URL for the blob
      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;

      // Ensure filename has an extension
      let filename = doc.name;
      // Simple check: if no dot in last 5 chars, likely missing extension
      if (filename.lastIndexOf('.') === -1 || filename.lastIndexOf('.') < filename.length - 5) {
        const typeMap = { 'pdf': '.pdf', 'word': '.docx', 'docx': '.docx', 'image': '.png', 'zip': '.zip' };
        if (typeMap[doc.type]) {
          filename += typeMap[doc.type];
        }
      }

      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download file. Please try again.");
    } finally {
      setDownloadingId(null);
    }
  };

  const handleView = (doc) => {
    setSelectedDoc(doc);
    setIsViewModalOpen(true);
  };

  const filteredDocs = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="client-docs-container">
      <div className="client-docs-header">
        <div>
          <h2 className="client-docs-title">My Documents</h2>
          <p className="client-docs-subtitle">Access your agreements, invoices, and project files.</p>
        </div>
      </div>

      <div className="client-docs-search">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search your documents..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="client-docs-loading">
          <FaSpinner className="spinner icon-spin" /> Loading documents...
        </div>
      ) : filteredDocs.length > 0 ? (
        <div className="client-docs-grid">
          {filteredDocs.map(doc => {
            // Check based on 5 hours
            const isNewDoc = new Date(doc.createdAt) > new Date(Date.now() - 5 * 60 * 60 * 1000);
            return (
              <div key={doc._id} className="client-doc-card">
                <div className="doc-card-icon">
                  {getFileIcon(doc.type)}
                </div>
                <div className="doc-card-info">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <h4 className="doc-card-name" title={doc.name}>{doc.name}</h4>
                    {isNewDoc && <span className="doc-badge-new">New</span>}
                  </div>

                  <div className="doc-card-meta">
                    <span>{formatIST(doc.createdAt, true)}</span>
                    <span>â€¢</span>
                    <span>{doc.size}</span>
                  </div>
                  {/* Description REMOVED from card */}
                </div>
                <div className="doc-card-actions">
                  <button
                    className="doc-btn-download"
                    title="Download"
                    onClick={() => handleDownload(doc)}
                    disabled={downloadingId === doc._id}
                  >
                    {downloadingId === doc._id ? <FaSpinner className="icon-spin" /> : <FaDownload />}
                    {downloadingId === doc._id ? " Downloading..." : " Download"}
                  </button>
                  <button className="doc-btn-view" title="View Details" onClick={() => handleView(doc)}>
                    <FaEye /> View
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="client-docs-empty">
          <div className="empty-state-icon"><FaFileAlt /></div>
          <h3>No Documents Found</h3>
          <p>You don't have any documents matching criteria.</p>
        </div>
      )}

      {/* --- VIEW MODAL --- */}
      {isViewModalOpen && selectedDoc && (
        <div className="doc-modal-overlay" onClick={() => setIsViewModalOpen(false)}>
          <div className="doc-modal-content" onClick={e => e.stopPropagation()}>
            <div className="doc-modal-header">
              <h3 className="doc-modal-title">Document Details</h3>
              <button className="doc-modal-close" onClick={() => setIsViewModalOpen(false)}>
                <FaTimes />
              </button>
            </div>

            <div className="doc-view-body">
              {/* Flex container for Icon + Info */}
              <div className="doc-view-top-section">
                <div className="doc-view-icon-wrapper">
                  {getFileIcon(selectedDoc.type)}
                </div>

                <div className="doc-view-info-block">
                  <h2 className="doc-view-title">{selectedDoc.name}</h2>
                  {(new Date(selectedDoc.createdAt) > new Date(Date.now() - 5 * 60 * 60 * 1000)) && <span className="doc-badge-new inline">New</span>}

                  <div className="doc-view-meta-row">
                    <span className="doc-meta-label">Date:</span>
                    <span className="doc-meta-value">{formatIST(selectedDoc.createdAt, true)}</span>
                  </div>

                  <div className="doc-view-meta-row">
                    <span className="doc-meta-label">Size:</span>
                    <span className="doc-meta-value">{selectedDoc.size}</span>
                  </div>
                </div>
              </div>

              <div className="doc-view-description-section">
                <span className="doc-meta-label" style={{ display: 'block', marginBottom: '8px' }}>Description:</span>
                <p className="doc-description-text">{selectedDoc.description || "No description provided."}</p>
              </div>
            </div>

            <div className="doc-modal-actions">
              <button className="doc-btn-cancel" onClick={() => setIsViewModalOpen(false)}>Close</button>
              <button
                className="doc-btn-download"
                onClick={() => handleDownload(selectedDoc)}
                disabled={downloadingId === selectedDoc._id}
              >
                {downloadingId === selectedDoc._id ? <FaSpinner className="icon-spin" /> : <FaDownload />}
                {downloadingId === selectedDoc._id ? " Downloading..." : " Download File"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDocuments;
