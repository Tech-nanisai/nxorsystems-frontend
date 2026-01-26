
import './apidevelopment.css'
import React from "react";
import { FaServer, FaMobileAlt, FaDatabase, FaExchangeAlt } from "react-icons/fa";


const APIdevelopment = () =>{
    return(
    <div className="APIS-development-container">
        <div className='APIS-heading-container'>
            <img src='https://res.cloudinary.com/drevfgyks/image/upload/v1736892704/tech%20nanisai/api-1_hp18mb.png'
            className='APIS-api-image'/>
            <div>
                <h1 className="APIS-heading">API Development</h1>
                <p className="APIS-intro">
                    APIDevelopment component with additional text added for better explanation. The repeated text "APIs 
                    (Application Programming Interfaces) enable seamless communication between different software components, 
                    making it easier to integrate and build applications" has been incorporated at relevant sections.
                </p>
            </div>            
        </div>        
        {/* Section: How APIs Work */}
        <div className="APIS-how-it-works">
            <h2 className="APIS-section-heading">How APIs Work</h2>
            <div className="APIS-map">
                <div className="APIS-map-item">
                    <FaMobileAlt className="APIS-icon" />
                    <p className="APIS-label">Client Application</p>
                </div>
                <FaExchangeAlt className="APIS-map-arrow" />
                <div className="APIS-map-item">
                    <FaServer className="APIS-icon" />
                    <p className="APIS-label">API Gateway</p>
                </div>
                <FaExchangeAlt className="APIS-map-arrow" />
                <div className="APIS-map-item">
                    <FaDatabase className="APIS-icon" />
                    <p className="APIS-label">Database</p>
                </div>
            </div>
            {/* <p className="APIS-description">
                A client sends a request to the API with specific parameters or data, the API processes the request using defined 
                logic, interacts with the database to retrieve, insert, update, or delete the required data, formats the result into 
                a structured response (usually JSON), and sends it back to the client along with an appropriate HTTP status code.
            </p>             */}
        </div>

        {/* Section: Features of APIs */}
        <div className="APIS-features">
            <h2 className="APIS-section-heading">Features of APIs</h2>
            <ul className="APIS-features-list">
            <li className="APIS-feature-item">Facilitates communication between different systems.</li>
            <li className="APIS-feature-item">Allows third-party integrations (e.g., payment gateways).</li>
            <li className="APIS-feature-item">Standardized and reusable endpoints.</li>
            <li className="APIS-feature-item">Secured with authentication mechanisms (e.g., OAuth, JWT).</li>
            <li className="APIS-feature-item">Supports scalability and modular application design.</li>
            </ul>
        </div>

        {/* Section: Example API Request */}
        <div className="APIS-example">
            <h2 className="APIS-section-heading">API Example</h2>
            <div className="APIS-example-code">
            <code>
                <span className="APIS-code-comment">// Example GET request to fetch user data</span> <br />
                <span className="APIS-code-highlight">GET</span> https://api.example.com/users/12345 <br />
                <span className="APIS-code-comment">// Response</span> <br />
                &#123; "id": 12345, "name": "John Doe", "email": "john@example.com" &#125;
            </code>
            </div>
        </div>
    </div>
    )
}

export default APIdevelopment;