import React from 'react';
import './maintenancesupport.css';

const MaintenanceSupport = () => {
  return (
    <div className="maintenancesupport-container">
        <img src='https://res.cloudinary.com/drevfgyks/image/upload/v1737188887/tech%20nanisai/rb_20674_udf24c.png'
        className='maintenancesupport-image'/>
      <header className="maintenancesupport-header">
        <h1 className="maintenancesupport-heading">Software Maintenance & Support</h1>
        <p className="maintenancesupport-subheading">
          We provide top-notch support and maintenance services to ensure your software runs smoothly and stays up-to-date.
        </p>
      </header>

      <section className="maintenancesupport-services">
        <div className="maintenancesupport-service">
          <h2 className="maintenancesupport-service-title">24/7 System Monitoring</h2>
          <p className="maintenancesupport-service-description">
            Continuous monitoring of your systems to prevent downtime and respond to issues proactively.
          </p>
        </div>

        <div className="maintenancesupport-service">
          <h2 className="maintenancesupport-service-title">Bug Fixes & Updates</h2>
          <p className="maintenancesupport-service-description">
            Regular bug fixes and timely software updates to ensure a smooth user experience.
          </p>
        </div>

        <div className="maintenancesupport-service">
          <h2 className="maintenancesupport-service-title">Technical Support</h2>
          <p className="maintenancesupport-service-description">
            Expert technical support to troubleshoot and resolve any software-related issues quickly.
          </p>
        </div>
      </section>

      <section className="maintenancesupport-contact">
        <h2 className="maintenancesupport-contact-title">Get in Touch with Us</h2>
        <p className="maintenancesupport-contact-description">
          Have any questions or need help? Contact us today to learn more about our maintenance and support services.
        </p>
        <button className="maintenancesupport-contact-button">Contact Us</button>
      </section>
    </div>
  );
};

export default MaintenanceSupport;
