
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaFileInvoiceDollar, FaPlus, FaTimes, FaProjectDiagram, FaRupeeSign } from "react-icons/fa";
import "./GenerateInvoice.css";

const GenerateInvoice = ({ isModal = false, onSuccess }) => {
  const navigate = useNavigate();

  // State for active modal: null | 'invoice' | 'project'
  const [activeModal, setActiveModal] = useState(null);

  // ------------------------------------------
  // INVOICE STATE
  // ------------------------------------------
  const [invoiceData, setInvoiceData] = useState({
    clientID: "",
    amount: "",
    paidAmount: "",
    status: "Due",
    date: new Date().toISOString().split("T")[0],
  });
  const [dueAmount, setDueAmount] = useState(0);
  const [feedback, setFeedback] = useState({ type: "", text: "" });

  // ------------------------------------------
  // INVOICE EFFECT: Auto-calculate Due Amount
  // ------------------------------------------
  useEffect(() => {
    const total = parseFloat(invoiceData.amount) || 0;
    const paid = parseFloat(invoiceData.paidAmount) || 0;
    const due = total - paid;
    setDueAmount(due >= 0 ? due : 0);

    // Auto update status logic
    if (total > 0 && due <= 0) {
      setInvoiceData(prev => ({ ...prev, status: "Paid" }));
    } else if (total > 0 && paid > 0) {
      setInvoiceData(prev => ({ ...prev, status: "Partial/Due" }));
    } else {
      if (invoiceData.status === "Paid" && due > 0) {
        setInvoiceData(prev => ({ ...prev, status: "Due" }));
      }
    }
  }, [invoiceData.amount, invoiceData.paidAmount]);

  // ------------------------------------------
  // HANDLERS
  // ------------------------------------------
  const handleInvoiceChange = (e) => {
    setInvoiceData({ ...invoiceData, [e.target.name]: e.target.value });
  };

  const handleInvoiceSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ type: "", text: "" });

    // Payload Preparation
    const payload = {
      ...invoiceData,
      dueAmount: dueAmount
    };

    try {
      const res = await axios.post(
        "https://nxorsystems-backend-xglw.onrender.com/api/superadmin/data/create-invoice",
        payload
      );
      if (res.data.success) {
        // If in Modal mode, call onSuccess instead of setting local feedback
        if (isModal && onSuccess) {
          onSuccess();
          return;
        }

        setFeedback({ type: "success", text: "Invoice Created!" });
        // Reset Form
        setInvoiceData({
          clientID: "",
          amount: "",
          paidAmount: "",
          status: "Due",
          date: new Date().toISOString().split("T")[0],
        });
      }
    } catch (err) {
      setFeedback({
        type: "error",
        text: err.response?.data?.message || "Failed to create invoice.",
      });
    }
  };

  // If used as a modal component, we render just the form without the page container wrapper
  // Or we adapt the classes.
  const containerClass = isModal ? "GenerateInvoice-modal-wrapper" : "GenerateInvoice-container";
  const cardClass = isModal ? "" : "GenerateInvoice-card";

  return (
    <div className={containerClass}>
      {!isModal && (
        <div className="GenerateInvoice-header">
          <h2 className="GenerateInvoice-title">Generate Invoice</h2>
          <p className="GenerateInvoice-subtitle">CM {'>'} Billing {'>'} Generate Invoice</p>
          <button
            className="GenerateInvoice-history-btn"
            onClick={() => navigate("/superadmin/invoice-history")}
          >
            View Invoice History
          </button>
        </div>
      )}

      <div className={cardClass}>
        {isModal && <h2 className="GenerateInvoice-title" style={{ fontSize: '1.8rem', textAlign: 'center' }}>Generate Invoice</h2>}

        <form className="GenerateInvoice-form" onSubmit={handleInvoiceSubmit}>
          {/* DETAILS */}
          <div className="GenerateInvoice-form-row">
            <div className="GenerateInvoice-input-group">
              <label className="GenerateInvoice-field-label">Client ID</label>
              <input
                type="text"
                name="clientID"
                className="GenerateInvoice-std-input"
                value={invoiceData.clientID}
                onChange={handleInvoiceChange}
                required
                placeholder="e.g. CL10003"
              />
            </div>
            <div className="GenerateInvoice-input-group">
              <label className="GenerateInvoice-field-label">Invoice Date</label>
              <input
                type="date"
                name="date"
                className="GenerateInvoice-std-input"
                value={invoiceData.date}
                onChange={handleInvoiceChange}
                required
              />
            </div>
          </div>

          {/* FINANCIALS */}
          <div className="GenerateInvoice-form-row">
            <div className="GenerateInvoice-input-group">
              <label className="GenerateInvoice-field-label">Total Amount (₹)</label>
              <input
                type="number"
                name="amount"
                className="GenerateInvoice-std-input"
                value={invoiceData.amount}
                onChange={handleInvoiceChange}
                required
                placeholder="0.00"
                min="0"
              />
            </div>
            <div className="GenerateInvoice-input-group">
              <label className="GenerateInvoice-field-label">Advance Payment (Optional)</label>
              <input
                type="number"
                name="paidAmount"
                className="GenerateInvoice-std-input"
                value={invoiceData.paidAmount}
                onChange={handleInvoiceChange}
                placeholder="0.00"
                min="0"
              />
            </div>
          </div>

          <div className="GenerateInvoice-input-group">
            <label className="GenerateInvoice-field-label">Status</label>
            <select
              name="status"
              className="GenerateInvoice-std-select"
              value={invoiceData.status}
              onChange={handleInvoiceChange}
            >
              <option value="Due">Due</option>
              <option value="Partial/Due">Partial/Due</option>
              <option value="Paid">Paid</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>

          {/* SUMMARY */}
          <div className="GenerateInvoice-summary-box">
            <div className="GenerateInvoice-summary-row">
              <span>Total Bill:</span>
              <span><FaRupeeSign size={10} /> {parseFloat(invoiceData.amount || 0).toFixed(2)}</span>
            </div>
            <div className="GenerateInvoice-summary-row">
              <span>Paid / Advance:</span>
              <span style={{ color: '#10b981' }}>- <FaRupeeSign size={10} /> {parseFloat(invoiceData.paidAmount || 0).toFixed(2)}</span>
            </div>
            <div className="GenerateInvoice-summary-row total">
              <span>Balance Due:</span>
              <span style={{ color: dueAmount > 0 ? '#ef4444' : '#10b981' }}>
                <FaRupeeSign size={10} /> {dueAmount.toFixed(2)}
              </span>
            </div>
          </div>

          <button type="submit" className="GenerateInvoice-btn">
            Create Invoice
          </button>
        </form>

        {/* FEEDBACK HELPER */}
        {feedback.text && (
          <div className={`GenerateInvoice-feedback-msg ${feedback.type}`}>
            {feedback.text}
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateInvoice;


