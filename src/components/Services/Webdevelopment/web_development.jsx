import React, { useEffect } from 'react';
import './web_development.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaMobileAlt, FaTabletAlt, FaDesktop, FaAndroid,FaShieldAlt, FaRocket,FaApple, FaCogs } from "react-icons/fa";

const Webdevelopment = () => {
  useEffect(() => {
    const carouselElement = document.getElementById('carouselExampleFade');
    if (window.bootstrap) {
      const carousel = new window.bootstrap.Carousel(carouselElement, {
        interval: 3000, // Change slide every 3 seconds
        ride: 'carousel',
      });
      return () => {
        carousel.dispose(); // Clean up on unmount
      };
    }
  }, []);

  return (
    <>
      <section>
          <div className="Webdevelopment-carousel-container">
            <div
              id="carouselExampleFade"
              className="carousel slide carousel-fade"
              data-bs-ride="carousel"
            >
              <div className="carousel-inner">
                <div className="carousel-item active">                    
                  <div className="carousel-content">
                    <img
                      src="https://res.cloudinary.com/drevfgyks/image/upload/v1734133852/tech%20nanisai/tech-3_olvshp.jpg"
                      className="carousel-img"
                      alt="Portrait of an Indigenous person"
                    />
                    {/* <div className="carousel-text">
                      <h2>Second Slide Title</h2>
                      <p>Slide details go here</p>
                    </div> */}
                  </div>
                </div>
                <div className="carousel-item">
                  <div className="carousel-content">
                    <img
                      src="https://res.cloudinary.com/drevfgyks/image/upload/v1734133852/tech%20nanisai/tech-5_soy4kz.jpg"
                      className="carousel-img"
                      alt="Abstract art design"
                    />
                    <div className="carousel-text">
                      <h2>Second Slide Title</h2>
                      <p>Slide details go here</p>
                    </div>
                  </div>
                </div>
                <div className="carousel-item">
                  <div className="carousel-content">
                    <img
                      src="https://res.cloudinary.com/drevfgyks/image/upload/v1734133852/tech%20nanisai/Tech-1_aoa3x0.jpg"
                      className="carousel-img"
                      alt="Bee filling honeycombs"
                    />
                    {/* <div className="carousel-text">
                      <h2>Third Slide Title</h2>
                      <p>More details about the slide</p>
                    </div> */}
                  </div>
                </div>
              </div>
              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#carouselExampleFade"
                data-bs-slide="prev"
              >
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#carouselExampleFade"
                data-bs-slide="next"
              >
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>
          </div>
      </section>

      <section>
          <div className="responsive-dynamic-container">
          <h2 className="section-title">Responsive & Dynamic Websites</h2>
          <p className="section-description">
            We specialize in creating websites that look great on any 
            device and dynamically adapt to user needs. Whether your audience is browsing on a smartphone, tablet, or desktop, our responsive 
            designs guarantee a flawless user experience. Our dynamic websites go beyond static content, offering interactive features, 
            real-time updates, and scalability to meet your business's growing demands.
          </p>
          <p className="mockup-caption-web">"Experience seamless scaling from desktop to mobile views"</p>
          <div className="mockup">
            <img src="https://res.cloudinary.com/drevfgyks/image/upload/v1735906061/AMARAVATHI%20NATURO%20TECH%20PVT%20LTD/model_device_axjwfc.png" 
            alt="Responsive mockup"
            className="mockup-image"
            />
          </div>
          <div className="key-points">
            <div className="point">
              <FaMobileAlt className="icon" />
              <h3>Responsive Design</h3>
              <p>Mobile-friendly and optimized for all devices (smartphones, tablets, desktops).</p>
            </div>
            <div className="point">
              <FaTabletAlt className="icon" />
              <h3>Dynamic Features</h3>
              <p>Real-time content updates, interactive elements, and scalable architectures.</p>
            </div>
            <div className="point">
              <FaDesktop className="icon" />
              <h3>Custom Solutions</h3>
              <p>Tailored designs that align with your branding and goals, ensuring uniqueness and functionality.</p>
            </div>
            <div className="point">
              <FaRocket className="icon" />
              <h3>Fast & Secure</h3>
              <p>Optimized for speed and performance with top-notch security protocols to protect your data.</p>
            </div>
          </div>
        </div>          
      </section>
     
      <section>
          <div className="mobile-applications-container">
            <h2 className="section-title">Mobile Applications</h2>
            <p className="section-description">
            Empower Your Business with Mobile-First Solutions In today's mobile-driven era, having a mobile application isn't just an 
            option—it's a necessity for businesses aiming to stay competitive and relevant. Empower your business with cutting-edge 
            mobile apps that not only enhance customer engagement but also streamline operations, drive sales, and build brand loyalty.
            </p>
            <p className="mockup-caption-app">Preview of a seamless mobile app interface.</p>
            <div className="app-showcase">
              <img
                src="https://res.cloudinary.com/drevfgyks/image/upload/v1735913454/tech%20nanisai/rb_2148663017_ojmcai.png"
                alt="Mobile app mockup"
                className="app-mockup"
              />
            </div>
            <div className="key-points">
              <div className="point">
                <FaAndroid className="icon" />
                <h3>Cross-Platform Support</h3>
                <p>Apps built for both Android and iOS, ensuring maximum reach and compatibility.</p>
              </div>
              <div className="point">
                <FaMobileAlt className="icon" />
                <h3>User-Centric Design</h3>
                <p>Focus on ease of use and functionality, providing a seamless user experience.</p>
              </div>
              <div className="point">
                <FaRocket className="icon" />
                <h3>Scalable Architecture</h3>
                <p>Our apps are designed to grow alongside your business needs.</p>
              </div>
              <div className="point">
                <FaShieldAlt className="icon" />
                <h3>Enhanced Security</h3>
                <p>We prioritize user data protection with industry-standard security practices.</p>
              </div>
            </div>          
        </div>
        {/* <div className="Webdevelopment-topsection-content">
          <h1>Mobile Applications</h1>
          <p className="Webdevelopment-topsection-para">
            We create mobile applications that empower your business to succeed in the digital age. Our apps are designed to be
            innovative, easy to use, and capable of growing with your business. Whether your goal is to enhance customer engagement,
            simplify operations, or unlock new revenue opportunities, our tailored mobile solutions are crafted to meet your specific
            needs and drive your success.
          </p>
        </div>
        <img
          src="https://res.cloudinary.com/drevfgyks/image/upload/v1732524987/tech%20nanisai/marketing-creative-collage-with-phone_rrwexu.png"
          alt="Mobile Applications"
          className="nav-image"
        /> */}
      </section>
      <section>
          <div className="ios-applications-container">
            <div className="ios-applications-header">
              {/* <FaApple className="ios-applications-icon" /> */}
              <h2 className="ios-applications-title">iOS Applications</h2>
            </div>
            <p className="ios-applications-description">
              Tap into the power of Apple’s ecosystem with our expertly designed iOS applications. Whether it’s iPhones, iPads, or the latest Apple devices, we specialize in creating apps that deliver unmatched performance, seamless user experiences, and innovative functionality.
            </p>
            <div className="ios-applications-points">
              <div className="ios-applications-point">
                <FaMobileAlt className="ios-applications-point-icon" />
                <div>
                  <h4>Native Expertise</h4>
                  <p>Apps optimized for Apple devices, delivering smooth performance and a premium experience.</p>
                </div>
              </div>
              <div className="ios-applications-point">
                <FaCogs className="ios-applications-point-icon" />
                <div>
                  <h4>Seamless Integration</h4>
                  <p>Leverage Apple’s hardware and software, including iCloud, Siri, and Apple Pay.</p>
                </div>
              </div>
              <div className="ios-applications-point">
                <FaApple className="ios-applications-point-icon" />
                <div>
                  <h4>App Store Submission</h4>
                  <p>We handle the submission process, ensuring compliance with Apple’s standards for a smooth launch.</p>
                </div>
              </div>
            </div>
            <div className="ios-applications-visual">
              <div className='ios-imgage-container'>
              <img
                src="https://res.cloudinary.com/drevfgyks/image/upload/v1732524987/tech%20nanisai/marketing-creative-collage-with-phone_rrwexu.png"
                alt="Mobile Applications"
                className="ios-applications-image"
              />
              {/* <img
                src="https://res.cloudinary.com/drevfgyks/image/upload/v1735913455/tech%20nanisai/smart-confidence-asian-female-startup-entrepreneur-small-business-owner-businesswoman-wear-smart-casual-cloth-smile-hand-use-tablet-woking-inventory-checking-showroom-office-daytime-background_vvjwad.png"
                alt="iOS Mockup"
                className="ios-applications-image"
              /> */}
              </div>
              <p className="ios-applications-caption">"Experience sleek, modern designs built for iOS."</p>          
            </div>
          </div>
      </section>
    </>
  );
};

export default Webdevelopment;
