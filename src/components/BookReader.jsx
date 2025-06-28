import { useState, useEffect, useRef } from 'react';
import { X, Maximize2, Minimize2 } from 'lucide-react';

const BookReader = ({ book, onClose }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const iframeRef = useRef(null);
  
  // Add history management to prevent back button issues
  useEffect(() => {
    // Add a history entry when the reader opens
    window.history.pushState({ readerOpen: true }, '');
    
    const handlePopState = (event) => {
      // Close reader when back button is pressed
      if (event.state?.readerOpen) {
        onClose();
      }
    };
    
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
      // Clean up history state when closing
      if (window.history.state?.readerOpen) {
        window.history.back();
      }
    };
  }, [onClose]);

  // Add scroll lock to body
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  useEffect(() => {
    if (!book || !book.previewLink) return;
    
    // Extract file ID from Google Drive URL
    const extractFileId = (url) => {
      const patterns = [
        /[?&]id=([^&]+)/i,      // UC parameter format
        /\/d\/([^\/]+)/i,        // Standard shareable link
        /\/file\/d\/([^\/]+)/i,  // Alternative format
        /\/open\?id=([^&]+)/i    // Open format
      ];
      
      for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) return match[1];
      }
      return null;
    };
    
    const fileId = extractFileId(book.previewLink);
    
    if (fileId) {
      setPreviewUrl(`https://drive.google.com/file/d/${fileId}/preview`);
      setError(null);
    } else {
      setError("Could not extract file ID from Google Drive link");
      setLoading(false);
    }
  }, [book]);

  const toggleFullscreen = () => {
    if (!iframeRef.current) return;
    
    if (!document.fullscreenElement) {
      iframeRef.current.requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(err => {
          console.error('Fullscreen error:', err);
          setError("Fullscreen not supported by your browser");
        });
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleIframeLoad = () => {
    setLoading(false);
    setError(null);
    
    // Add scroll lock to the iframe container
    const iframeContainer = document.querySelector('.iframe-container');
    if (iframeContainer) {
      iframeContainer.style.overflow = 'hidden';
    }
  };

  const handleIframeError = () => {
    setLoading(false);
    setError("Failed to load book preview");
  };

  return (
    <div className="fixed inset-0 z-150 bg-white flex flex-col">
      {/* Toolbar with NovaReads branding */}
      <div className="bg-gray-800 text-white p-2 flex justify-between items-center">
        <div className="flex items-center">
          <span className=" text-white px-2 py-1 rounded-md mr-2 font-bold">
            NovaReads
          </span>
        </div>
        
        <div className="flex items-center space-x-4">
        <div className="max-w-[100%]">
            <h2 className="font-semibold truncate bg-gray-700 px-3 py-1 rounded-md border border-gray-500">
              {book?.title || 'Book Reader'}
            </h2>
          </div>
          <button 
            onClick={toggleFullscreen}
            className="p-1 rounded hover:bg-gray-700 transition-colors"
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? (
              <Minimize2 className="h-5 w-5" />
            ) : (
              <Maximize2 className="h-5 w-5" />
            )}
          </button>
        </div>
        
        <button 
          onClick={onClose}
          className="p-1 rounded hover:bg-red-600 transition-colors"
          title="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden relative iframe-container">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <p className="mt-4 text-gray-600">Loading book preview...</p>
            </div>
          </div>
        )}
        
        {error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white p-4 z-10">
            <div className="text-red-500 text-lg font-medium mb-4">
              {error}
            </div>
            <p className="text-gray-600 text-center mb-6">
              This book cannot be displayed in the reader.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => window.open(book.previewLink, '_blank')}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Open in New Tab
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
              >
                Close Reader
              </button>
            </div>
          </div>
        ) : previewUrl ? (
          <iframe
            ref={iframeRef}
            src={previewUrl}
            className="w-full h-full border-0"
            title={`${book?.title || 'Book'} Preview`}
            allow="autoplay; fullscreen"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
          />
        ) : null}
      </div>
    </div>
  );
};

export default BookReader;