import Link from "next/link";

export default function ResultViewer({ result, onDownload, isLoggedIn }) {
  return (
    <div className="panel">
      <div className="panel-header">
        <i className="fas fa-star-of-life"></i>
        <h3>Masterpiece Output</h3>
      </div>
      <div className="result-container">
        {!result ? (
          <div style={{textAlign:"center", color:"#8b92a8"}}>
            <i className="fas fa-image" style={{fontSize:"3rem", marginBottom:"0.5rem"}}></i>
            <p>Your enhanced image will appear here</p>
            <small>Upload a photo and click "Run Ultra AI Background Removal"</small>
          </div>
        ) : (
          <img src={result} className="result-img" alt="result" />
        )}
      </div>
      {result && (
        <div className="result-actions">
          <button className="btn btn-success" onClick={onDownload}>
            <i className="fas fa-download"></i> Download PNG
          </button>
          {!isLoggedIn && (
            <Link href="/register" className="btn btn-primary">
              <i className="fas fa-gem"></i> Sign Up for More →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}