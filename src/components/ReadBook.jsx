import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import BookReader from './BookReader';

const PurchaseOptions = ({ isbns, onClose }) => {
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [selectedIsbnIndex, setSelectedIsbnIndex] = useState(0);

  const sellers = [
    { 
      name: "Amazon", 
      url: `https://www.amazon.com/s?k=${isbns[selectedIsbnIndex]}`,
      icon: "https://logo.clearbit.com/amazon.com",
      description: "Fast shipping, new & used options"
    },
    { 
      name: "AbeBooks", 
      url: `https://www.abebooks.com/servlet/SearchResults?kn=${isbns[selectedIsbnIndex]}`,
      icon: "https://logo.clearbit.com/abebooks.com",
      description: "Specialists in rare & used books"
    },
    {
      name: "Books-A-Million",
      url: `https://www.booksamillion.com/search2?query=${isbns[selectedIsbnIndex]}`,
      icon: "https://logo.clearbit.com/booksamillion.com",
      description: "Haven of a Million books"
    }
  ];

  const handleRedirect = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
    onClose();
  };

  const handlePrevIsbn = () => {
    setSelectedIsbnIndex((prev) => (prev === 0 ? isbns.length - 1 : prev - 1));
    setSelectedSeller(null);
  };

  const handleNextIsbn = () => {
    setSelectedIsbnIndex((prev) => (prev === isbns.length - 1 ? 0 : prev + 1));
    setSelectedSeller(null);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="relative w-full max-w-md bg-white rounded-lg shadow-xl"
        >
          <div className="p-6">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-medium text-gray-900">
                Where would you like to purchase this book?
              </h3>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mt-2">
              <p className="text-sm text-gray-500">Select ISBN:</p>
              <div className="flex items-center justify-between mt-1">
                <button
                  onClick={handlePrevIsbn}
                  className="p-1 text-gray-500 hover:text-gray-700 disabled:text-gray-300"
                  disabled={isbns.length <= 1}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <p className="text-sm font-medium text-gray-900">
                  ISBN: {isbns[selectedIsbnIndex]}
                </p>
                <button
                  onClick={handleNextIsbn}
                  className="p-1 text-gray-500 hover:text-gray-700 disabled:text-gray-300"
                  disabled={isbns.length <= 1}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {sellers.map((seller) => (
                <motion.div
                  key={seller.name}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedSeller?.name === seller.name 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedSeller(seller)}
                >
                  <img 
                    src={seller.icon} 
                    alt={seller.name} 
                    className="w-10 h-10 object-contain mr-3 rounded" 
                    onError={(e) => {
                      e.target.src = '/default-bookstore-icon.png';
                    }}
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">{seller.name}</h4>
                    <p className="text-sm text-gray-500">{seller.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors ${
                  selectedSeller 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-blue-400 cursor-not-allowed'
                }`}
                onClick={() => selectedSeller && handleRedirect(selectedSeller.url)}
                disabled={!selectedSeller}
              >
                Visit {selectedSeller?.name || 'Seller'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const ReadBook = ({ book }) => {
  const [bookNotAvailable, setBookNotAvailable] = useState(false);
  const [purchaseNotAvailable, setPurchaseNotAvailable] = useState(false);
  const [showPurchaseOptions, setShowPurchaseOptions] = useState(false);
  const [isbnList, setIsbnList] = useState([]);
  const [showReader, setShowReader] = useState(false);

  const getBookIsbn = (book) => {
    if (book?.id?.startsWith('local-')) return [];

    if (!book?.industryIdentifiers) return [];
    
    const isbns = [];
    const isbn13 = book.industryIdentifiers.find(id => id.type === "ISBN_13");
    const isbn10 = book.industryIdentifiers.find(id => id.type === "ISBN_10");
    
    if (isbn13?.identifier) isbns.push(isbn13.identifier);
    if (isbn10?.identifier) isbns.push(isbn10.identifier);
    
    return isbns;
  };

  useEffect(() => {
    // Reset states when a new book is selected
    setBookNotAvailable(false);
    setPurchaseNotAvailable(false);
    setShowPurchaseOptions(false);
    setIsbnList([]);

    // Check ISBNs and viewability for the new book
    const isbns = getBookIsbn(book);
    if (book?.viewability === "NO_PAGES" && isbns.length === 0) {
      setBookNotAvailable(true);
    } else if (book?.viewability === "PARTIAL" && isbns.length === 0) {
      setPurchaseNotAvailable(true);
    } else if (["PARTIAL", "NO_PAGES"].includes(book?.viewability) && isbns.length > 0) {
      setIsbnList(isbns);
    }
  }, [book]);

  const handleReadBook = () => {
    try {
    // For local books: use our custom reader
    if (book?.id?.startsWith('local-')) {
      setShowReader(true);
      return;
    }
      const isbns = getBookIsbn(book);
      
      // If book has FULL or ALL_PAGES viewability and a preview link
      if (["FULL", "ALL_PAGES"].includes(book.viewability)) {
        if (book.previewLink) {
          const previewUrl = book.previewLink + "&printsec=frontcover#v=onepage&q&f=true";
          window.open(previewUrl, "_blank", "noopener,noreferrer");
        } else {
          setBookNotAvailable(true);
        }
        return;
      }
  
      // If book has PARTIAL viewability
      if (book.viewability === "PARTIAL") {
        if (book.previewLink) {
          const previewUrl = book.previewLink + "&printsec=frontcover#v=onepage&q&f=true";
          window.open(previewUrl, "_blank", "noopener,noreferrer");
        }
        
        if (isbns.length > 0) {
          setIsbnList(isbns);
          setShowPurchaseOptions(true);
        } else {
          setPurchaseNotAvailable(true);
        }
        return;
      }
  
      // If book has NO_PAGES viewability
      if (book.viewability === "NO_PAGES") {
        if (isbns.length > 0) {
          setIsbnList(isbns);
          setShowPurchaseOptions(true);
        } else {
          setBookNotAvailable(true);
        }
        return;
      }
  
      // Default case if none of the above
      setBookNotAvailable(true);
    } catch (error) {
      console.error("Error in handleReadBook:", error);
    }
  };

  return (
    <>
      {bookNotAvailable ? (
        <button 
          disabled 
          className="px-3 py-1.5 border-2 border-dashed border-gray-400 text-gray-500 text-sm rounded-md font-medium font-handwritten cursor-not-allowed"
        >
          This book is not available for preview or purchase
        </button>
      ) : (
        <>
          {/* Read/Preview Button */}
          {["FULL", "ALL_PAGES", "PARTIAL"].includes(book?.viewability) && (
            <button 
              onClick={handleReadBook} 
              className="px-3 py-1.5 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors font-medium font-handwritten"
            >
              {book?.viewability === "PARTIAL" ? "Preview Book" : "Read Book"}
            </button>
          )}
        {/* Reader Component */}
        {showReader && (
          <BookReader 
            book={book} 
            onClose={() => setShowReader(false)} 
          />
        )}
          {/* Purchase Button */}
          {["PARTIAL", "NO_PAGES"].includes(book?.viewability) && (
            purchaseNotAvailable ? (
              <button 
                disabled
                className="px-3 py-1.5 border-2 border-dashed border-gray-400 text-gray-500 text-sm rounded-md font-medium font-handwritten cursor-not-allowed"
              >
                Not available for purchase
              </button>
            ) : (
              <button 
                onClick={() => {
                  const isbns = getBookIsbn(book);
                  setIsbnList(isbns);
                  setShowPurchaseOptions(true);
                }}
                className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors font-medium font-handwritten"
              >
                Buy Book
              </button>
            )
          )}
        </>
      )}

      {/* Purchase Options Modal */}
      {showPurchaseOptions && isbnList.length > 0 && (
        <PurchaseOptions 
          isbns={isbnList}
          onClose={() => setShowPurchaseOptions(false)}
        />
      )}
    </>
  );
};

export default ReadBook;