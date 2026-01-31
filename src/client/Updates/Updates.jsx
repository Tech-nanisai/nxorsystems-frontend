import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaThumbsUp, FaThumbsDown, FaFilePdf, FaVideo, FaImage, FaBolt, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Loader from "../../components/Loader/Loader";
import "./Updates.css";

const GenericCarousel = ({ items, title }) => {
  const [index, setIndex] = useState(0);

  const nextSlide = (e) => {
    e.stopPropagation();
    setIndex((prev) => (prev + 1) % items.length);
  };

  const prevSlide = (e) => {
    e.stopPropagation();
    setIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="ClientUpdates-carousel" style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Render Current Item */}
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {items[index]}
      </div>

      {items.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            style={{
              position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)',
              background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%',
              width: '30px', height: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 10
            }}
          >
            <FaChevronLeft />
          </button>
          <button
            onClick={nextSlide}
            style={{
              position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
              background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%',
              width: '30px', height: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 10
            }}
          >
            <FaChevronRight />
          </button>
          <div style={{
            position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)',
            display: 'flex', gap: '5px', zIndex: 10
          }}>
            {items.map((_, i) => (
              <div
                key={i}
                style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: i === index ? 'white' : 'rgba(255,255,255,0.5)'
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const ExpandableText = ({ text }) => {
  const [expanded, setExpanded] = useState(false);
  if (!text) return null;
  const words = text.split(/\s+/);
  const isLong = words.length > 40;

  if (!isLong) return <p className="ClientUpdates-desc">{text}</p>;

  return (
    <p className="ClientUpdates-desc">
      {expanded ? text : words.slice(0, 40).join(" ") + "..."}
      <button
        onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
        style={{ border: 'none', background: 'none', color: '#2563eb', fontWeight: '600', cursor: 'pointer', marginLeft: '5px', padding: 0, font: 'inherit' }}
      >
        {expanded ? "Show Less" : "Read More"}
      </button>
    </p>
  );
};

const Updates = () => {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUpdates();
  }, []);

  const fetchUpdates = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 5000)); // 5 Second Delay
      const token = sessionStorage.getItem("TOKEN");
      const res = await axios.get("https://nxorsystems-backend-xglw.onrender.com/api/client/promotional-updates/all", {
        headers: { "Authorization": `Bearer ${token}` },
        withCredentials: true
      });
      if (res.data.success) {
        setUpdates(res.data.updates);
      }
    } catch (error) {
      console.error("Error fetching updates:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReaction = async (id, status) => {
    try {
      const token = sessionStorage.getItem("TOKEN");
      const res = await axios.post(`https://nxorsystems-backend-xglw.onrender.com/api/client/promotional-updates/react/${id}`,
        { status },
        {
          headers: { "Authorization": `Bearer ${token}` },
          withCredentials: true
        }
      );
      if (res.data.success) {
        // Optimistic UI Update
        setUpdates(prev => prev.map(u =>
          u._id === id ? { ...u, myReaction: status } : u
        ));
      }
    } catch (error) {
      console.error("Error reacting:", error);
    }
  };

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return "";
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
  };

  const renderMedia = (update) => {
    // Helper to get all media URLs
    const getMediaList = () => {
      let list = [];
      if (update.mediaUrls && update.mediaUrls.length > 0) {
        list = update.mediaUrls.map(u => `https://nxorsystems-backend-xglw.onrender.com/${u}`);
      } else if (update.mediaUrl) {
        list = [`https://nxorsystems-backend-xglw.onrender.com/${update.mediaUrl}`];
      }
      return list;
    };

    switch (update.type) {
      case "image":
        const imageUrls = getMediaList();
        const imageItems = imageUrls.map((url, i) => (
          <img
            key={i}
            src={url}
            alt={`${update.title} - ${i}`}
            className="ClientUpdates-image"
            onError={(e) => e.target.style.display = 'none'}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ));

        return (
          <div className="ClientUpdates-media-wrapper">
            {imageItems.length > 0 ? (
              <GenericCarousel items={imageItems} title={update.title} />
            ) : (
              <div className="ClientUpdates-text-only">No Image</div>
            )}
          </div>
        );
      case "video":
        let videoLinks = [];
        if (update.youtubeLinks && update.youtubeLinks.length > 0) {
          videoLinks = update.youtubeLinks;
        } else if (update.youtubeLink) {
          videoLinks = [update.youtubeLink];
        }

        const videoItems = videoLinks.map(link => getYouTubeEmbedUrl(link)).filter(Boolean).map((embedUrl, i) => (
          <iframe
            key={i}
            className="ClientUpdates-video-frame"
            src={embedUrl}
            title={`${update.title} - ${i}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ width: '100%', height: '100%', border: 'none' }}
          ></iframe>
        ));

        return (
          <div className="ClientUpdates-media-wrapper">
            {videoItems.length > 0 ? (
              <GenericCarousel items={videoItems} title={update.title} />
            ) : (
              <div className="ClientUpdates-text-only" style={{ background: '#000', color: '#fff' }}>Video Link Invalid</div>
            )}
          </div>
        );
      case "pdf":
        const pdfUrls = getMediaList();
        return (
          <div className="ClientUpdates-media-wrapper" style={{ flexDirection: 'column', overflowY: 'auto', background: '#f8fafc', alignItems: 'stretch', justifyContent: 'flex-start' }}>
            {pdfUrls.map((url, i) => (
              <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="ClientUpdates-pdf-placeholder" style={{ flex: '0 0 auto', borderBottom: '1px solid #e2e8f0', minHeight: '80px' }}>
                <FaFilePdf size={30} />
                <span style={{ fontSize: '0.9rem', marginTop: '5px' }}>Open Document {pdfUrls.length > 1 ? i + 1 : ''}</span>
              </a>
            ))}
          </div>
        );
      case "text":
      default:
        return (
          <div className="ClientUpdates-text-only">
            <FaBolt />
          </div>
        );
    }
  };

  return (
    <div className="ClientUpdates-container">
      <div className="ClientUpdates-header">
        <h1 className="ClientUpdates-title">Latest Updates</h1>
        <p className="ClientUpdates-subtitle">New features, offers, and announcements curated for you.</p>
      </div>

      {loading ? (
        <Loader />
      ) : updates.length === 0 ? (
        <div className="ClientUpdates-loader">No updates available at the moment.</div>
      ) : (
        <div className="ClientUpdates-feed">
          {updates.map((update, index) => (
            <motion.div
              className="ClientUpdates-card"
              key={update._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="ClientUpdates-content">
                <div className="ClientUpdates-header-row">
                  <span className="ClientUpdates-type-badge">{update.type}</span>
                  <span className="ClientUpdates-date-badge">{new Date(update.createdAt).toLocaleDateString("en-IN", { month: 'long', day: 'numeric' })}</span>
                </div>

                <h2 className="ClientUpdates-card-title">{update.title}</h2>
                <ExpandableText text={update.description} />

                <div className="ClientUpdates-action-area">
                  <AnimatePresence mode="wait">
                    {!update.myReaction && (
                      <motion.div
                        key="buttons"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ display: 'flex', gap: '1rem' }}
                      >
                        <button
                          className="ClientUpdates-btn btn-interested"
                          onClick={() => handleReaction(update._id, 'interested')}
                        >
                          <FaThumbsUp /> Interested
                        </button>
                        <button
                          className="ClientUpdates-btn btn-not-interested"
                          onClick={() => handleReaction(update._id, 'not_interested')}
                        >
                          <FaThumbsDown /> Pass
                        </button>
                      </motion.div>
                    )}

                    {update.myReaction === 'interested' && (
                      <motion.div
                        key="interested"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="ClientUpdates-status-badge status-interested"
                      >
                        <FaCheckCircle /> Interested
                      </motion.div>
                    )}

                    {update.myReaction === 'not_interested' && (
                      <motion.div
                        key="not_interested"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="ClientUpdates-status-badge status-passed"
                      >
                        <FaTimesCircle /> Passed
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {renderMedia(update)}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Updates;
