"use client";
import { useDropzone } from 'react-dropzone';

export default function ImageUploader({ onFileSelect, preview, fileInputRef }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/webp': []
    },
    maxSize: 12 * 1024 * 1024,
    multiple: false
  });

  return (
    <div>
      <div 
        {...getRootProps()} 
        className={`upload-zone ${isDragActive ? 'border-[#c084fc] bg-[rgba(192,132,252,0.05)]' : ''}`}
      >
        <input {...getInputProps()} />
        <i className="fas fa-camera-retro upload-icon"></i>
        <p>{isDragActive ? "Drop your image here" : "Click, drag or paste image"}</p>
        <small>JPG, PNG, WEBP (max 12MB)</small>
        <button className="btn btn-outline" style={{ marginTop: "0.8rem" }}>
          <i className="fas fa-folder-open"></i> Browse files
        </button>
      </div>

      {preview && (
        <div className="preview-box">
          <img src={preview} className="preview-img" alt="preview" />
          <button 
            className="btn-change mt-2" 
            onClick={() => document.querySelector('input[type="file"]')?.click()}
          >
            <i className="fas fa-sync-alt"></i> Change Image
          </button>
        </div>
      )}
    </div>
  );
}