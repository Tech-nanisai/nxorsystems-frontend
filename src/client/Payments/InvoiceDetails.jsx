//frontend/src/client/Payments/InvoiceDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaPrint, FaArrowLeft, FaSpinner, FaTimes, FaRupeeSign } from "react-icons/fa";
import { useClientAuth } from "../../context/ClientAuthContext";
import "./InvoiceDetails.css";

const InvoiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { clientToken, client } = useClientAuth();

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await axios.get(`https://nxorsystems-backend-xglw.onrender.com/api/client/dashboard/invoice/${id}`, {
          headers: { Authorization: `Bearer ${clientToken}` }
        });
        if (res.data.success) {
          setInvoice(res.data.data);
        }
      } catch (err) {
        console.error("Fetch Invoice Detail Error:", err);
        setError("Invoice not found or access denied.");
      } finally {
        setLoading(false);
      }
    };

    if (clientToken && id) {
      fetchDetails();
    }
  }, [clientToken, id]);

  // Helper: Format Invoice ID
  const formatID = (inv) => {
    if (!inv) return "";
    const d = new Date(inv.date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const suffix = inv._id.slice(-6).toUpperCase();
    return `NXOR${day}${month}${suffix}`;
  };

  // Payment Modal State
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [payAmount, setPayAmount] = useState("");

  const openPaymentModal = (inv) => {
    setSelectedInvoice(inv);
    // Default to due amount, ensure it matches validation
    setPayAmount(inv.dueAmount || inv.amount);
    setPayModalOpen(true);
  };

  const closePaymentModal = () => {
    setPayModalOpen(false);
    setSelectedInvoice(null);
    setPayAmount("");
  };

  if (loading) return <div className="detail-loading"><FaSpinner className="fa-spin" /> Loading Invoice...</div>;
  if (error) return <div className="detail-error">{error}</div>;
  if (!invoice) return null;

  const status = invoice.status.toLowerCase();
  const isPayable = status === 'due' || status.includes('partial') || status === 'overdue';

  return (
    <div className="invoice-page">
      <div className="invoice-actions">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button>
        <div className="right-actions" style={{ display: 'flex', gap: '1rem' }}>
          {isPayable && (
            <button className="pay-now-action-btn" onClick={() => openPaymentModal(invoice)}>
              <span style={{ marginRight: '8px' }}>💳</span> Pay Now
            </button>
          )}
          <button className="print-btn" onClick={() => window.print()}>
            <FaPrint /> Print Invoice
          </button>
        </div>
      </div>

      <div className="invoice-paper">
        {/* HEADER */}
        <div className="inv-header">
          <div className="company-info">
            <h1>NXOR SYSTEMS</h1>
            <p>123 High-Tech City, Hyderabad</p>
            <p>billing@nxor.com</p>
          </div>
          <div className="inv-meta">
            <h2>INVOICE</h2>
            <p className="meta-row"><strong>No:</strong> #{formatID(invoice)}</p>
            <p className="meta-row">
              <strong>Date:</strong> {new Date(invoice.date).toLocaleDateString()}
            </p>
            <p className="inv-status">
              Status: <span className={`status-badge ${invoice.status.toLowerCase()}`}>{invoice.status}</span>
            </p>
          </div>
        </div>

        {/* BILL TO */}
        <div className="bill-to-section">
          <h3>Bill To:</h3>
          <p className="client-name">{client?.fullName || "Valued Client"}</p>
          <p>Client ID: {invoice.clientID}</p>
          <p>{client?.email}</p>
        </div>

        {/* ITEMS TABLE */}
        <table className="inv-items">
          <thead>
            <tr>
              <th>Description</th>
              <th className="right">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Professional Services / Project Payment</td>
              <td className="right">₹{invoice.amount.toLocaleString()}</td>
            </tr>
            {/* If you had detailed line items in DB, map them here. Currently generic. */}
          </tbody>
          <tfoot>
            <tr>
              <td>Total Amount</td>
              <td className="right">₹{invoice.amount.toLocaleString()}</td>
            </tr>
            <tr>
              <td>Paid / Advance</td>
              <td className="right" style={{ color: '#15803d' }}>(-) ₹{(invoice.paidAmount || 0).toLocaleString()}</td>
            </tr>
            <tr className="grand-total">
              <td>Balance Due</td>
              <td className="right">₹{(invoice.dueAmount || invoice.amount).toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>

        <div className="inv-footer">
          <p>Thank you for your business!</p>
          <p>Please make checks payable to <strong>NXOR SYSTEMS PVT LTD</strong>.</p>
        </div>
      </div>

      {/* PAYMENT MODAL (Simplified duplication for standalone component) */}
      {payModalOpen && selectedInvoice && (
        <div className="payment-modal-overlay">
          <div className="payment-modal-content">
            <button className="modal-close-icon" onClick={closePaymentModal}>
              <FaTimes />
            </button>
            <div className="pm-header">
              <h2>Secure Payment</h2>
              <p>Complete your transaction securely.</p>
            </div>
            <div className="pm-amount-box">
              <span>Total Payable Amount</span>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', marginTop: '5px' }}>
                <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#2563eb' }}>₹</span>
                <input
                  type="number"
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  style={{
                    fontSize: '1.8rem',
                    fontWeight: 'bold',
                    color: '#2563eb',
                    width: '120px',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: '2px dashed #93c5fd',
                    textAlign: 'center',
                    outline: 'none'
                  }}
                />
              </div>
            </div>
            <div className="pm-methods" style={{ textAlign: 'center' }}>
              {/* QR Container */}
              <div className="qr-code-container" style={{
                background: 'white',
                borderRadius: '20px',
                padding: '20px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                display: 'inline-block',
                border: '1px solid #f1f5f9',
                position: 'relative'
              }}>

                {/* QR Code */}
                <div style={{ padding: '5px', background: 'white' }}>
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(`upi://pay?pa=9948946658@pthdfc&pn=NXOR Systems&am=${payAmount}&cu=INR`)}`}
                    alt="UPI QR Code"
                    style={{ width: '180px', height: '180px' }}
                  />
                </div>

                {/* UPI ID */}
                <div style={{ marginTop: '15px', fontSize: '0.9rem', color: '#334155', fontWeight: '500' }}>
                  <span style={{ color: '#eab308', marginRight: '5px' }}>▶</span>
                  9948946658@pthdfc
                </div>
              </div>

              {/* Footer Apps */}
              <div style={{ marginTop: '1.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '8px' }}>Scan with any UPI app</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', opacity: 0.8, filter: 'grayscale(0%)' }}>
                  <span style={{ fontWeight: 'bold', color: '#002970' }}>Paytm</span>
                  <span style={{ fontWeight: 'bold', color: '#6739b7' }}>PhonePe</span>
                  <span style={{ fontWeight: 'bold', color: '#ea4335' }}>GPay</span>
                  <span style={{ fontWeight: 'bold', color: '#f57c00' }}>BHIM</span>
                </div>
              </div>

              <div className="payment-note" style={{ marginTop: '1.5rem' }}>
                <p><strong>Note:</strong> After payment, please share the transaction screenshot.</p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default InvoiceDetails;
