// frontend/src/client/Payments/Payments.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaFileInvoiceDollar, FaEye, FaDownload, FaSpinner, FaCreditCard, FaTimes, FaQrcode, FaRupeeSign, FaCheckCircle } from "react-icons/fa";
import { useClientAuth } from "../../context/ClientAuthContext";
import "./Payments.css";

const Payments = () => {
  const navigate = useNavigate();
  const { clientToken } = useClientAuth();

  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Payment Modal State
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await axios.get("https://nxorsystems-backend-xglw.onrender.com/api/client/dashboard/invoices", {
          headers: { Authorization: `Bearer ${clientToken}` }
        });
        if (res.data.success) {
          setInvoices(res.data.data);
        }
      } catch (err) {
        console.error("Fetch Invoices Error:", err);
        setError("Failed to load payment history.");
      } finally {
        setLoading(false);
      }
    };

    if (clientToken) {
      fetchInvoices();
    }
  }, [clientToken]);

  const getStatusClass = (status) => {
    if (!status) return "due";
    const s = status.toLowerCase();
    if (s.includes("part")) return "partial";
    return s;
  };

  // Helper: Format Invoice ID => NXOR + DDMM + Last6Chars
  const formatInvoiceID = (inv) => {
    if (!inv || !inv.date || !inv._id) return "NXOR-INV";
    const d = new Date(inv.date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const suffix = inv._id.slice(-6).toUpperCase();
    return `NXOR${day}${month}${suffix}`;
  };

  const handleDownload = () => {
    window.print();
  };

  const openPaymentModal = (inv) => {
    setSelectedInvoice(inv);
    setPayModalOpen(true);
  };

  const closePaymentModal = () => {
    setPayModalOpen(false);
    setSelectedInvoice(null);
  };

  if (loading) {
    return (
      <div className="client-payments-container">
        <div className="loading-state">
          <FaSpinner className="fa-spin" style={{ fontSize: '32px', marginBottom: '10px' }} />
          <p>Loading your invoices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="client-payments-container">
      <div className="payments-header">
        <h2>Payment History</h2>
        <button className="download-report-btn" onClick={handleDownload}>
          <FaDownload /> Download Report
        </button>
      </div>

      {invoices.length === 0 ? (
        <div className="empty-state">
          <p>No transactions found.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="payments-table">
            <thead>
              <tr>
                <th>Invoice ID</th>
                <th>Issues Date</th>
                <th>Due Amount</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => {
                const status = inv.status.toLowerCase();
                const isPayable = status === 'due' || status.includes('partial') || status === 'overdue';

                return (
                  <tr key={inv._id}>
                    <td>
                      <div className="inv-id-cell">
                        <div className="inv-icon-box">
                          <FaFileInvoiceDollar />
                        </div>
                        {formatInvoiceID(inv)}
                      </div>
                    </td>
                    <td className="date-cell">
                      {new Date(inv.date).toLocaleDateString("en-GB", {
                        day: "2-digit", month: "short", year: "numeric"
                      })}
                    </td>
                    <td className="amount-cell" style={{ color: '#dc2626' }}>
                      <FaRupeeSign size={10} /> {inv.dueAmount?.toLocaleString() || "0"}
                    </td>
                    <td className="amount-cell">
                      <FaRupeeSign size={10} /> {inv.amount.toLocaleString()}
                    </td>
                    <td>
                      <span className={`status-pill ${getStatusClass(inv.status)}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="view-btn"
                          onClick={() => navigate(`/client/invoice/${inv._id}`)}
                          title="View Details"
                        >
                          <FaEye />
                        </button>

                        {isPayable && (
                          <button
                            className="pay-now-btn"
                            onClick={() => openPaymentModal(inv)}
                            title="Pay Now"
                          >
                            <FaCreditCard /> Pay Now
                          </button>
                        )}

                        {status === 'paid' && (
                          <div className="fully-paid-badge">
                            <FaCheckCircle style={{ marginRight: '4px' }} /> Fully Paid
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* PAYMENT MODAL */}
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
              <h3><FaRupeeSign /> {selectedInvoice.dueAmount?.toLocaleString()}</h3>
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
                    src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=9948946658@pthdfc&pn=NXOR%20Systems"
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

            {/* <button className="confirm-paid-btn">
               I Have Paid
            </button> */}
          </div>
        </div>
      )}

    </div>
  );
};

export default Payments;
