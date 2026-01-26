// frontend/src/components/AvatarUpload/AvatarCropper.jsx
import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import Slider from "@mui/material/Slider";
import "./AvatarCropper.css";

const AvatarCropper = ({ image, onCancel, onSave }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const generateCroppedImage = async () => {
    const createImage = (url) =>
      new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = () => resolve(img);
        img.onerror = reject;
      });

    const canvas = document.createElement("canvas");
    const img = await createImage(image);

    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      img,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );

    const croppedBase64 = canvas.toDataURL("image/jpeg", 0.9);
    onSave(croppedBase64);
  };

  return (
    <div className="saprof-cropper-overlay">
      <div className="saprof-cropper-modal">
        <h3 className="saprof-cropper-title">Adjust Your Avatar</h3>

        <div className="saprof-cropper-container">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="saprof-cropper-controls">
          <label className="saprof-cropper-zoom-label">Zoom</label>
          <Slider
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            onChange={(_, v) => setZoom(v)}
          />
        </div>

        <div className="saprof-cropper-buttons">
          <button
            className="saprof-crop-btn saprof-crop-btn-cancel"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="saprof-crop-btn saprof-crop-btn-save"
            onClick={generateCroppedImage}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvatarCropper;
