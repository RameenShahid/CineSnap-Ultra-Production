"use client";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import toast from "react-hot-toast";
import ImageUploader from "@/components/ImageUploader";
import Controls from "@/components/Controls";
import ResultViewer from "@/components/ResultViewer";
import Navbar from "@/components/Navbar";

export default function Home() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [credits, setCredits] = useState(0);
  const [activeMode, setActiveMode] = useState("auto");
  const [edgeSteps, setEdgeSteps] = useState([false, false, false, false, false]);
  
  // Advanced controls
  const [edgeSensitivity, setEdgeSensitivity] = useState(75);
  const [subjectThreshold, setSubjectThreshold] = useState(60);
  const [edgeSmoothing, setEdgeSmoothing] = useState(50);
  const [featherAmount, setFeatherAmount] = useState(5);
  const [hairDetail, setHairDetail] = useState(65);
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    if (token) fetchCredits();
  }, []);

  const fetchCredits = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/user/credits`, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
      });
      setCredits(res.data.credits);
    } catch (error) {
      console.error("Failed to fetch credits");
    }
  };

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;
    
    if (selectedFile.size > 12 * 1024 * 1024) {
      toast.error("File too large. Maximum size is 12MB");
      return;
    }
    
    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(selectedFile);
    setResult(null);
    setEdgeSteps([true, false, false, false, false]);
    toast.success("Image loaded successfully!");
  };

  const processImage = async () => {
    if (!file) {
      toast.error("Please select an image first");
      return;
    }
    
    if (isLoggedIn && credits <= 0) {
      toast.error("No credits left! Please upgrade your plan.");
      return;
    }

    setLoading(true);
    setEdgeSteps([true, false, false, false, false]);

    const formData = new FormData();
    formData.append("image", file);
    formData.append("edgeSensitivity", edgeSensitivity);
    formData.append("subjectThreshold", subjectThreshold);
    formData.append("edgeSmoothing", edgeSmoothing);
    formData.append("featherAmount", featherAmount);
    formData.append("hairDetail", hairDetail);
    formData.append("mode", activeMode);

    try {
      setEdgeSteps([true, true, false, false, false]);
      
      const endpoint = isLoggedIn 
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/remove-bg`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/remove-bg-demo`;

      const config = isLoggedIn ? {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
      } : {};

      setEdgeSteps([true, true, true, false, false]);
      const res = await axios.post(endpoint, formData, config);
      
      setEdgeSteps([true, true, true, true, false]);
      setResult(res.data.image);
      
      setEdgeSteps([true, true, true, true, true]);
      toast.success("Background removed successfully!");
      
      if (isLoggedIn) fetchCredits();
    } catch (error) {
      console.error("Processing failed:", error);
      toast.error(error.response?.data?.error || "Processing failed. Please try again.");
      setEdgeSteps([false, false, false, false, false]);
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = () => {
    if (!result) return;
    const link = document.createElement("a");
    link.href = result;
    link.download = `cinesnap-${Date.now()}.png`;
    link.click();
    toast.success("Image downloaded!");
  };

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} credits={credits} setIsLoggedIn={setIsLoggedIn} />
      
      <div className="credit-banner">
        <i className="fas fa-crown"></i> Created by <strong>Rameen Shahid</strong> | 
        Ultra-Advanced AI • Smart Edge Detection • Perfect Background Removal
        {!isLoggedIn && <span className="ml-4">✨ 3 free tries for visitors!</span>}
      </div>

      <div className="container">
        <header className="hero">
          <h1>Ultra-Advanced <span className="gradient-text">AI Background Removal</span></h1>
          <p>Smart edge detection • Perfect subject isolation • Professional alpha matting</p>
        </header>

        <div className="editor-grid">
          {/* Left Panel */}
          <div className="panel">
            <div className="panel-header">
              <i className="fas fa-cloud-upload-alt"></i>
              <h3>Upload & Edit</h3>
            </div>

            <ImageUploader 
              onFileSelect={handleFileSelect} 
              preview={preview}
              fileInputRef={fileInputRef}
            />

            {/* Edge Detection Visual */}
            <div className="edge-detection-visual">
              <div className="edge-status">
                {edgeSteps[4] ? "✅ AI Processing Complete!" : 
                 edgeSteps[3] ? "🔧 Refining Edges..." :
                 edgeSteps[2] ? "✨ Removing Background..." :
                 edgeSteps[1] ? "🎯 Isolating Subject..." :
                 edgeSteps[0] ? "🔍 Running Edge Detection..." : "⚡ AI Engine Ready"}
              </div>
              <div className="edge-steps">
                <span className={`step ${edgeSteps[0] ? (edgeSteps[4] ? "completed" : "active") : ""}`}>
                  1️⃣ Edge Detection
                </span>
                <span className={`step ${edgeSteps[1] ? (edgeSteps[4] ? "completed" : "active") : ""}`}>
                  2️⃣ Subject Isolation
                </span>
                <span className={`step ${edgeSteps[2] ? (edgeSteps[4] ? "completed" : "active") : ""}`}>
                  3️⃣ Alpha Matting
                </span>
                <span className={`step ${edgeSteps[3] ? (edgeSteps[4] ? "completed" : "active") : ""}`}>
                  4️⃣ Background Removal
                </span>
                <span className={`step ${edgeSteps[4] ? "completed" : ""}`}>
                  5️⃣ Refinement
                </span>
              </div>
            </div>

            <Controls 
              activeMode={activeMode}
              setActiveMode={setActiveMode}
              edgeSensitivity={edgeSensitivity}
              setEdgeSensitivity={setEdgeSensitivity}
              subjectThreshold={subjectThreshold}
              setSubjectThreshold={setSubjectThreshold}
              edgeSmoothing={edgeSmoothing}
              setEdgeSmoothing={setEdgeSmoothing}
              featherAmount={featherAmount}
              setFeatherAmount={setFeatherAmount}
              hairDetail={hairDetail}
              setHairDetail={setHairDetail}
              onProcess={processImage}
              loading={loading}
              hasImage={!!file}
            />
          </div>

          {/* Right Panel */}
          <ResultViewer 
            result={result}
            onDownload={downloadImage}
            isLoggedIn={isLoggedIn}
          />
        </div>

        <div className="footer">
          <i className="fas fa-heart" style={{color:"#ec489a"}}></i> Created by <strong>Rameen Shahid</strong> — 
          Ultra-Advanced AI Background Removal Engine
        </div>
      </div>
    </>
  );
}