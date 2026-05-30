// frontend/src/components/common/SecureReelPlayer/SecureReelPlayer.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  FaPlay, FaPause, FaExpand, FaCompress,
  FaShieldAlt, FaVolumeMute, FaVolumeUp, FaLock
} from 'react-icons/fa';
import './SecureReelPlayer.css';

const SecureReelPlayer = ({ video, isActive = true }) => {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const controlsTimerRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false); // Start unmuted by default so sound plays automatically
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isFocused, setIsFocused] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [securityAlert, setSecurityAlert] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // --- Auto-hide controls timer definition (declared early to avoid TDZ) ---
  const startControlsTimer = useCallback(() => {
    clearTimeout(controlsTimerRef.current);
    controlsTimerRef.current = setTimeout(() => {
      setShowControls(false);
    }, 2800);
  }, []);

  // --- Play-Pause constraint based on active status ---
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    if (!isActive) {
      vid.pause();
      setIsPlaying(false);
    }
  }, [isActive]);

  // --- Playback Controls ---
  const handlePlayToggle = useCallback((e) => {
    // If the card is not active in the carousel, let the click bubble up to center it
    if (!isActive) return;

    if (e) { e.stopPropagation(); e.preventDefault(); }
    const vid = videoRef.current;
    if (!vid) return;

    if (isPlaying) {
      vid.pause();
      setIsPlaying(false);
      setShowControls(true);
    } else {
      vid.muted = isMuted;
      const playPromise = vid.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            startControlsTimer();
          })
          .catch((err) => {
            console.warn("Playback blocked, trying muted", err);
            vid.muted = true;
            setIsMuted(true);
            vid.play()
              .then(() => {
                setIsPlaying(true);
                startControlsTimer();
              })
              .catch((e) => {
                console.error("Playback failed completely", e);
                setIsPlaying(false);
              });
          });
      } else {
        setIsPlaying(true);
        startControlsTimer();
      }
    }
  }, [isPlaying, isMuted, startControlsTimer, isActive]);

  const handleMuteToggle = useCallback((e) => {
    if (e) { e.stopPropagation(); e.preventDefault(); }
    const vid = videoRef.current;
    if (!vid) return;
    vid.muted = !vid.muted;
    setIsMuted(vid.muted);
  }, []);

  // --- Fullscreen: operate on outer container (keeps all crops/controls) ---
  const handleFullscreenToggle = useCallback((e) => {
    if (e) { e.stopPropagation(); e.preventDefault(); }
    const el = containerRef.current;
    if (!el) return;

    if (!document.fullscreenElement) {
      el.requestFullscreen?.() || el.webkitRequestFullscreen?.();
    } else {
      document.exitFullscreen?.() || document.webkitExitFullscreen?.();
    }
  }, []);

  // Sync fullscreen state
  useEffect(() => {
    const onChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onChange);
    document.addEventListener('webkitfullscreenchange', onChange);
    return () => {
      document.removeEventListener('fullscreenchange', onChange);
      document.removeEventListener('webkitfullscreenchange', onChange);
    };
  }, []);

  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    if (isPlaying) startControlsTimer();
  }, [isPlaying, startControlsTimer]);

  useEffect(() => () => clearTimeout(controlsTimerRef.current), []);

  // --- Video event listeners ---
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => { setIsPlaying(false); setShowControls(true); };
    const onEnded = () => { setIsPlaying(false); setShowControls(true); setProgress(0); };
    const onTimeUpdate = () => {
      if (vid.duration) setProgress((vid.currentTime / vid.duration) * 100);
    };
    const onCanPlay = () => setIsLoaded(true);

    vid.addEventListener('play', onPlay);
    vid.addEventListener('pause', onPause);
    vid.addEventListener('ended', onEnded);
    vid.addEventListener('timeupdate', onTimeUpdate);
    vid.addEventListener('canplay', onCanPlay);

    return () => {
      vid.removeEventListener('play', onPlay);
      vid.removeEventListener('pause', onPause);
      vid.removeEventListener('ended', onEnded);
      vid.removeEventListener('timeupdate', onTimeUpdate);
      vid.removeEventListener('canplay', onCanPlay);
    };
  }, []);

  // --- Security: Window Blur + Keyboard Blockers ---
  const triggerSecurityAlert = useCallback(() => {
    const vid = videoRef.current;
    if (vid) vid.pause();
    setIsPlaying(false);
    setShowControls(true);
    setSecurityAlert(true);
    setTimeout(() => setSecurityAlert(false), 4500);
  }, []);

  useEffect(() => {
    const onBlur = () => {
      setIsFocused(false);
      const vid = videoRef.current;
      if (vid) vid.pause();
      setIsPlaying(false);
      setShowControls(true);
    };
    const onFocus = () => setIsFocused(true);

    // Detect phone screenshots / screen recording via Page Visibility API
    // Most mobile browsers briefly hide the page during capture
    const onVisibilityChange = () => {
      if (document.hidden || document.visibilityState === 'hidden') {
        setIsFocused(false);
        const vid = videoRef.current;
        if (vid) vid.pause();
        setIsPlaying(false);
        setShowControls(true);
        // Scrub clipboard immediately
        navigator.clipboard?.writeText('').catch(() => { });
      } else {
        setIsFocused(true);
      }
    };

    const onKeyDown = (e) => {
      const blocked = [
        e.key === 'PrintScreen',
        e.key === 'F12',
        e.ctrlKey && e.shiftKey && ['I', 'i', 'C', 'c', 'J', 'j', 'K', 'k'].includes(e.key),
        e.ctrlKey && ['u', 'U', 's', 'S'].includes(e.key),
        e.metaKey && ['s', 'S'].includes(e.key),
      ];
      if (blocked.some(Boolean)) {
        e.preventDefault();
        e.stopPropagation();
        triggerSecurityAlert();
        // Scrub clipboard
        navigator.clipboard?.writeText('').catch(() => { });
        return false;
      }
    };

    const onKeyUp = (e) => {
      if (e.key === 'PrintScreen') {
        navigator.clipboard?.writeText('').catch(() => { });
        triggerSecurityAlert();
      }
    };

    window.addEventListener('blur', onBlur);
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('keydown', onKeyDown, true);
    window.addEventListener('keyup', onKeyUp, true);

    return () => {
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('keydown', onKeyDown, true);
      window.removeEventListener('keyup', onKeyUp, true);
    };
  }, [triggerSecurityAlert]);

  // --- Progress bar seek (custom timeline) ---
  const handleProgressClick = useCallback((e) => {
    e.stopPropagation();
    const vid = videoRef.current;
    if (!vid || !vid.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    vid.currentTime = ratio * vid.duration;
  }, []);

  return (
    <div
      ref={containerRef}
      className={`SecureReelPlayer-container${!isFocused ? ' blurred' : ''}`}
      onContextMenu={(e) => e.preventDefault()}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      style={{
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none',
        WebkitUserDrag: 'none',
      }}
    >
      {/* Native HTML5 Video — zero external branding */}
      <video
        ref={videoRef}
        className="SecureReelPlayer-video"
        src={video.videoUrl}
        muted={isMuted}
        playsInline
        preload="metadata"
        controlsList="nodownload noremoteplayback nofullscreen"
        disablePictureInPicture
        onContextMenu={(e) => e.preventDefault()}
        style={{ pointerEvents: 'none', WebkitUserDrag: 'none' }}
      />

      {/* Loading Shimmer */}
      {!isLoaded && (
        <div className="SecureReelPlayer-loader">
          <div className="SecureReelPlayer-loader-ring" />
        </div>
      )}

      {/* Transparent click zone - toggles play/pause */}
      <div
        className="SecureReelPlayer-click-blocker"
        onClick={handlePlayToggle}
      />

      {/* UI Overlay Canvas (fades in on hover/pause) */}
      <div className={`SecureReelPlayer-overlay-canvas${showControls ? ' visible' : ''}`}>

        {/* Top row: secure lock badge */}
        <div className="SecureReelPlayer-top-bar">
          <div className="SecureReelPlayer-secure-badge">
            <FaLock className="SecureReelPlayer-lock-icon" />
            <span>Private</span>
          </div>
        </div>

        {/* Center Play/Pause button */}
        <div
          className={`SecureReelPlayer-center-btn${isPlaying ? ' playing' : ''}`}
          onClick={handlePlayToggle}
        >
          {isPlaying
            ? <FaPause className="SecureReelPlayer-center-icon" />
            : <FaPlay className="SecureReelPlayer-center-icon play-offset" />
          }
        </div>

        {/* Bottom Controls */}
        <div className="SecureReelPlayer-bottom" onClick={(e) => e.stopPropagation()}>
          {/* Progress bar */}
          <div className="SecureReelPlayer-progress-track" onClick={handleProgressClick}>
            <div
              className="SecureReelPlayer-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Control Buttons */}
          <div className="SecureReelPlayer-controls-bar">
            <button
              className="SecureReelPlayer-ctrl-btn"
              onClick={handlePlayToggle}
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <FaPause /> : <FaPlay />}
            </button>

            <button
              className="SecureReelPlayer-ctrl-btn"
              onClick={handleMuteToggle}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
            </button>

            <span className="SecureReelPlayer-status-label">
              {isPlaying ? 'Playing' : 'Paused'}
            </span>

            <button
              className="SecureReelPlayer-ctrl-btn fullscreen-ctrl"
              onClick={handleFullscreenToggle}
              title={isFullscreen ? 'Exit Full Screen' : 'Full Screen'}
            >
              {isFullscreen ? <FaCompress /> : <FaExpand />}
            </button>
          </div>
        </div>
      </div>

      {/* Window Focus Lost — Security Shield */}
      {!isFocused && (
        <div className="SecureReelPlayer-shield">
          <div className="SecureReelPlayer-shield-card">
            <FaShieldAlt className="SecureReelPlayer-shield-icon" />
            <h3>NXOR Secure Media</h3>
            <p>Video paused. Return to this tab to continue watching.</p>
          </div>
        </div>
      )}

      {/* Security Alert Toast */}
      {securityAlert && (
        <div className="SecureReelPlayer-alert-toast">
          <FaShieldAlt />
          <span>Recording & capture is disabled for this private content.</span>
        </div>
      )}
    </div>
  );
};

export default SecureReelPlayer;
