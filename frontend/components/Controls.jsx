export default function Controls({ 
  activeMode, setActiveMode,
  edgeSensitivity, setEdgeSensitivity,
  subjectThreshold, setSubjectThreshold,
  edgeSmoothing, setEdgeSmoothing,
  featherAmount, setFeatherAmount,
  hairDetail, setHairDetail,
  onProcess, loading, hasImage
}) {
  
  const modes = [
    { id: "auto", label: "🤖 Auto Detect", icon: "fas fa-robot" },
    { id: "portrait", label: "👤 Portrait Mode", icon: "fas fa-user" },
    { id: "product", label: "📦 Product Mode", icon: "fas fa-box" },
    { id: "hair", label: "💇 Hair/Fur Mode", icon: "fas fa-feather-alt" },
    { id: "highContrast", label: "⚡ High Contrast", icon: "fas fa-bolt" },
    { id: "soft", label: "🌸 Soft Edge", icon: "fas fa-flower" }
  ];

  const presets = [
    { id: "hollywood", label: "🎬 Hollywood" },
    { id: "vintage", label: "🎞️ Vintage" },
    { id: "cyberpunk", label: "🤖 Cyberpunk" },
    { id: "noir", label: "🕶️ Noir" },
    { id: "warmglow", label: "☀️ Golden Hour" },
    { id: "icy", label: "❄️ Winter Frost" }
  ];

  return (
    <>
      <div className="section-card bg-removal-card">
        <div className="section-title">
          <i className="fas fa-microchip"></i> Ultra-Advanced AI Engine
        </div>
        
        <button 
          className="btn btn-primary btn-lg" 
          onClick={onProcess} 
          disabled={!hasImage || loading} 
          style={{width:"100%", marginBottom:"1rem"}}
        >
          {loading ? (
            <>
              <div className="spinner"></div>
              Processing...
            </>
          ) : (
            <>
              <i className="fas fa-wand-magic"></i> 🚀 Run Ultra AI Background Removal
            </>
          )}
        </button>
        
        <div className="advanced-controls">
          <div className="control-group-header">
            <i className="fas fa-sliders-h"></i> Ultra-Precision Controls
          </div>
          
          <div className="control-row">
            <label>Edge Detection Strength: <span>{edgeSensitivity}%</span></label>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={edgeSensitivity} 
              onChange={(e) => setEdgeSensitivity(parseInt(e.target.value))} 
            />
            <small>Higher = detects more edges</small>
          </div>
          
          <div className="control-row">
            <label>Subject Isolation: <span>{subjectThreshold}%</span></label>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={subjectThreshold} 
              onChange={(e) => setSubjectThreshold(parseInt(e.target.value))} 
            />
            <small>Adjusts subject vs background separation</small>
          </div>
          
          <div className="control-row">
            <label>Edge Smoothing: <span>{edgeSmoothing}%</span></label>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={edgeSmoothing} 
              onChange={(e) => setEdgeSmoothing(parseInt(e.target.value))} 
            />
            <small>Smooths detected edges</small>
          </div>
          
          <div className="control-row">
            <label>Feather Amount: <span>{featherAmount}px</span></label>
            <input 
              type="range" 
              min="0" 
              max="20" 
              value={featherAmount} 
              onChange={(e) => setFeatherAmount(parseInt(e.target.value))} 
            />
            <small>Softens subject edges</small>
          </div>
          
          <div className="control-row">
            <label>Hair/Fur Detail: <span>{hairDetail}%</span></label>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={hairDetail} 
              onChange={(e) => setHairDetail(parseInt(e.target.value))} 
            />
            <small>Preserves fine hair and fur details</small>
          </div>
        </div>
        
        <div className="bg-modes">
          {modes.map(mode => (
            <button 
              key={mode.id}
              className={`mode-btn ${activeMode === mode.id ? "active" : ""}`} 
              onClick={() => setActiveMode(mode.id)}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      <div className="section-card">
        <div className="section-title">
          <i className="fas fa-film"></i> Cinematic Presets
        </div>
        <div className="preset-grid">
          {presets.map(preset => (
            <div key={preset.id} className="preset-chip" data-preset={preset.id}>
              {preset.label}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}