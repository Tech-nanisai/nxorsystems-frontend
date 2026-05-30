import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaPrint, FaArrowLeft, FaSpinner, FaRupeeSign } from "react-icons/fa";
import "../../client/Payments/InvoiceDetails.css"; // Reuse CLIENT Styles directly

const SuperAdminInvoiceDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const res = await axios.get(`https://nxorsystems-backend-xglw.onrender.com/api/superadmin/data/invoice/${id}`);
                if (res.data.success) {
                    setInvoice(res.data.data);
                }
            } catch (err) {
                console.error("Fetch Invoice Detail Error:", err);
                setError("Invoice not found.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchDetails();
        }
    }, [id]);

    // Helper: Format Invoice ID
    const formatID = (inv) => {
        if (!inv) return "";
        const d = new Date(inv.date);
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const suffix = inv._id.slice(-6).toUpperCase();
        return `NXOR${day}${month}${suffix}`;
    };

    if (loading) return <div className="detail-loading"><FaSpinner className="fa-spin" /> Loading Invoice...</div>;
    if (error) return <div className="detail-error">{error}</div>;
    if (!invoice) return null;

    return (
        <div className="invoice-page">
            <div className="invoice-actions">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <FaArrowLeft /> Back
                </button>
                <div className="right-actions">
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
                    <p className="client-name">Client ID: {invoice.clientID}</p>
                    <p className="text-sm text-gray-500">(Client details fetched from DB)</p>
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
                            <td className="right"><FaRupeeSign size={10} /> {invoice.amount.toLocaleString()}</td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td>Total Amount</td>
                            <td className="right"><FaRupeeSign size={10} /> {invoice.amount.toLocaleString()}</td>
                        </tr>
                        <tr>
                            <td>Paid / Advance</td>
                            <td className="right" style={{ color: '#15803d' }}>(-) <FaRupeeSign size={10} /> {(invoice.paidAmount || 0).toLocaleString()}</td>
                        </tr>
                        <tr className="grand-total">
                            <td>Balance Due</td>
                            <td className="right"><FaRupeeSign size={10} /> {(invoice.dueAmount || invoice.amount).toLocaleString()}</td>
                        </tr>
                    </tfoot>
                </table>

                <div className="inv-footer">
                    <p>Super Admin View - Read Only</p>
                </div>
            </div>
        </div >
    );
};

export default SuperAdminInvoiceDetails;

