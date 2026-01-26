import { useState } from "react";
import { FaFileInvoice, FaFileUpload, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import "./ClientList.jsx";

const Adminreportsclient = () => {
    const [file, setFile] = useState(null);
    const [invoiceNumber, setInvoiceNumber] = useState("");
    const [amount, setAmount] = useState("");
    const [dateTime, setDateTime] = useState("");
    const [fileName, setFileName] = useState("No file chosen");
    const [clientID, setClientID] = useState("");
    const [isClientIDValid, setIsClientIDValid] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFileName(file.name);
            setFile(file);
        } else {
            setFileName("No file chosen");
        }
    };

    const validateClientID = async (id) => {
        setClientID(id);

        if (id.trim() === "") {
            setIsClientIDValid(null);
            return;
        }

        try {
            const response = await fetch(`https://your-backend-endpoint.com/api/validate-client/${id}`);
            const result = await response.json();

            setIsClientIDValid(result.isValid); // Assuming the API returns { isValid: true/false }
        } catch (error) {
            console.error("Error validating Client ID:", error);
            setIsClientIDValid(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isClientIDValid) {
            alert("Invalid Client ID!");
            return;
        }
        const formSendDocuments = new FormData();
        formSendDocuments.append("invoiceNumber", invoiceNumber);
        formSendDocuments.append("amount", amount);
        formSendDocuments.append("dateTime", dateTime);
        formSendDocuments.append("clientID", clientID);
        if (file) {
            formSendDocuments.append("file", file);
        }

        try {
            const response = await fetch("https://your-backend-endpoint.com/api/upload", {
                method: "POST",
                body: formSendDocuments,
            });

            const result = await response.json();
            if (response.ok) {
                alert("Documents submitted successfully!");
                setInvoiceNumber("");
                setAmount("");
                setDateTime("");
                setClientID("");
                setFile(null);
                setFileName("No file chosen");
                setIsClientIDValid(null);
            } else {
                alert("Failed to submit invoice: " + result.message);
            }
        } catch (error) {
            console.error("Error submitting invoice:", error);
            alert("An error occurred. Please try again later.");
        }
    };

    return (
        <div className="Admin_client-main-container">
            <div className="Admin_client-billing-invoices-container">
                <h1 className="Admin_client-billing-invoices-title">Send Documents</h1>
                <form className="Admin_client-billing-invoices-form" onSubmit={handleSubmit}>
                    <label className="Admin_client-billing-invoices-label">
                        Client ID:
                        <div className="Admin_client-billing-invoices-input-wrapper">
                            <input
                                type="text"
                                className="Admin_client-billing-invoices-input"
                                value={clientID}
                                onChange={(e) => validateClientID(e.target.value)}
                                placeholder="Enter Client ID"
                            />
                            {isClientIDValid !== null && (
                                isClientIDValid ? (
                                    <FaCheckCircle className="valid-icon" style={{ color: "green" }} />
                                ) : (
                                    <FaTimesCircle className="invalid-icon" style={{ color: "red" }} />
                                )
                            )}
                        </div>
                    </label>

                    <label className="Admin_client-billing-invoices-label">
                        Verify No:
                        <input
                            type="number"
                            className="Admin_client-billing-invoices-input"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter verify number"
                        />
                    </label>

                    <label className="Admin_client-billing-invoices-label">
                        Date & Time:
                        <input
                            type="datetime-local"
                            className="Admin_client-billing-invoices-input"
                            value={dateTime}
                            onChange={(e) => setDateTime(e.target.value)}
                        />
                    </label>

                    <label className="Admin_client-billing-invoices-label-file">
                        {fileName} <FaFileUpload className="Admin_client-billing-invoices-icon" />
                        <input
                            type="file"
                            className="Admin_client-billing-invoices-file-input"
                            onChange={handleFileChange}
                            style={{ display: "none" }}
                        />
                    </label>

                    <button type="submit" className="Admin_client-billing-invoices-submit">
                        Submit Invoice <FaFileInvoice className="Admin_client-billing-invoices-icon" />
                    </button>
                </form>
            </div>

            <div className="Admin_client-websiteupdates-container">
                <h1 className="Admin_client-websiteupdates-title">Project Update Details</h1>
                <form className="Admin_client-websiteupdates-form" onSubmit={handleSubmit}>
                    <label className="Admin_client-websiteupdates-label">
                        Client ID:
                        <input
                            type="text"
                            className="Admin_client-websiteupdates-input"
                            value={clientID}
                            onChange={(e) => setClientID(e.target.value)}
                            placeholder="Enter Client ID"
                        />
                    </label>

                    <label className="Admin_client-websiteupdates-label">
                        Update Details:
                        <textarea
                            type="text"
                            className="Admin_client-websiteupdates-input"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Website Details"
                        />
                    </label>

                    <label className="Admin_client-websiteupdates-label">
                        Date & Time:
                        <input
                            type="datetime-local"
                            className="Admin_client-websiteupdates-input"
                            value={dateTime}
                            onChange={(e) => setDateTime(e.target.value)}
                        />
                    </label>

                    <label className="Admin_client-websiteupdates-label-file">
                        {fileName} <FaFileUpload className="Admin_client-websiteupdates-icon" />
                        <input
                            type="file"
                            className="Admin_client-websiteupdates-file-input"
                            onChange={handleFileChange}
                            style={{ display: "none" }}
                        />
                    </label>

                    <button type="submit" className="Admin_client-websiteupdates-submit">
                        Submit Update <FaFileInvoice className="Admin_client-websiteupdates-icon" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Adminreportsclient;
