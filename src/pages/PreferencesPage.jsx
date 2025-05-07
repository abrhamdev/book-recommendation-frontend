import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const PreferencesPage = () => {
  // Progress calculation
  const calculateProgress = () => {
    let progress = 0;
    if (formData.languages.length > 0) progress += 25;
    if (formData.genres.length > 0) progress += 25;
    if (formData.ageGroup) progress += 25;
    if (formData.bookLength) progress += 25;
    return progress;
  };
  const navigate = useNavigate();
  const { user, setPreferences } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    languages: [],
    genres: [],
    ageGroup: '',
    bookLength: '',
    authors: []
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showAuthorSuggestions, setShowAuthorSuggestions] = useState(false);

  // Sample authors for search suggestions
  const sampleAuthors = [
    'J.K. Rowling', 'Stephen King', 'George R.R. Martin', 'Agatha Christie',
    'Jane Austen', 'Ernest Hemingway', 'Mark Twain', 'Charles Dickens',
    'F. Scott Fitzgerald', 'Toni Morrison', 'Haruki Murakami', 'J.R.R. Tolkien',
    'Virginia Woolf', 'Leo Tolstoy', 'Gabriel García Márquez'
  ];

  const filteredAuthors = sampleAuthors.filter(author =>
    author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLanguageChange = (language) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...prev.languages, language]
    }));
  };

  const handleGenreChange = (genre) => {
    setFormData(prev => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre]
    }));
  };

  const handleAuthorSelect = (author) => {
    if (!formData.authors.includes(author)) {
      setFormData(prev => ({
        ...prev,
        authors: [...prev.authors, author]
      }));
    }
    setSearchQuery('');
    setShowAuthorSuggestions(false);
  };

  const removeAuthor = (authorToRemove) => {
    setFormData(prev => ({
      ...prev,
      authors: prev.authors.filter(author => author !== authorToRemove)
    }));
  };

  const handleSubmit = () => {
    try {
      // Validate form data
      if (formData.languages.length === 0) {
        toast.error('Please select at least one language');
        return;
      }
      if (formData.genres.length === 0) {
        toast.error('Please select at least one genre');
        return;
      }

      // Save preferences and redirect to dashboard
      setPreferences(formData);
      toast.success('Preferences saved successfully!');
    } catch (error) {
      toast.error('Failed to save preferences');
    }
  };

  const nextStep = () => {
    if (currentStep === 0 && formData.languages.length === 0) {
      toast.error('Please select at least one language');
      return;
    }
    if (currentStep === 1 && formData.genres.length === 0) {
      toast.error('Please select at least one genre');
      return;
    }
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const steps = [
    {
      title: "Which language(s) do you prefer to read in?",
      type: "languages",
      options: ['English', 'Amharic', 'French', 'Spanish', 'German', 'Chinese', 'Russian', 'Italian', 'Latin'],
      required: true
    },
    {
      title: "What types of books do you enjoy reading?",
      type: "genres",
      options: [
        { category: "Fiction", items: ['Fiction', 'Fantasy', 'Science Fiction', 'Historical Fiction', 'Romance', 'Thriller', 'Horror'] },
        { category: "Non-Fiction", items: ['Biography', 'Business', 'History', 'Memoir', 'Nonfiction', 'Psychology', 'Self Help'] },
        { category: "Art & Literature", items: ['Art', 'Classics', 'Poetry'] },
        { category: "Special Interest", items: ['Children\'s', 'Christian', 'Cookbooks', 'Humor', 'Music', 'Sports', 'Travel', 'Young Adult'] }
      ],
      required: true
    },
    {
      title: "Select your age group for better reading suggestions:",
      type: "ageGroup",
      options: [
        { label: "Kids (0–12)", value: "kids" },
        { label: "Teens (13–17)", value: "teens" },
        { label: "Young Adults (18–24)", value: "young-adults" },
        { label: "Adults (25–40)", value: "adults" },
        { label: "Older Adults (41+)", value: "older-adults" }
      ],
      required: false
    },
    {
      title: "How long do you prefer your books?",
      type: "bookLength",
      options: [
        { label: "Short (under 150 pages)", value: "short" },
        { label: "Medium (150–300 pages)", value: "medium" },
        { label: "Long (300+ pages)", value: "long" }
      ],
      required: false
    },
    {
      title: "Do you have any favorite authors?",
      type: "authors",
      required: false
    }
  ];

  const renderStep = () => {
    const step = steps[currentStep];

    return (
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-2xl mx-auto"
      >
        <h2 className="text-2xl font-semibold text-white mb-8">{step.title}</h2>
        
        {step.type === "languages" && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {step.options.map(language => (
              <label key={language} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-blue-400/20 cursor-pointer transition-all duration-200">
                <input
                  type="checkbox"
                  checked={formData.languages.includes(language)}
                  onChange={() => handleLanguageChange(language)}
                  className="h-4 w-4 text-blue-500 rounded border-gray-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                />
                <span className="text-blue-100 font-medium">{language}</span>
              </label>
            ))}
          </div>
        )}

        {step.type === "genres" && (
          <div className="space-y-6">
            {step.options.map(category => (
              <div key={category.category}>
                <h3 className="text-lg font-semibold text-blue-200 mb-3">{category.category}</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {category.items.map(genre => (
                    <label key={genre} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-blue-400/20 cursor-pointer transition-all duration-200">
                      <input
                        type="checkbox"
                        checked={formData.genres.includes(genre)}
                        onChange={() => handleGenreChange(genre)}
                        className="h-4 w-4 text-blue-500 rounded border-gray-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      />
                      <span className="text-blue-100 font-medium">{genre}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {step.type === "ageGroup" && (
          <div className="space-y-2">
            {step.options.map(option => (
              <label key={option.value} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-blue-400/20 cursor-pointer transition-all duration-200">
                <input
                  type="radio"
                  name="ageGroup"
                  value={option.value}
                  checked={formData.ageGroup === option.value}
                  onChange={(e) => setFormData(prev => ({ ...prev, ageGroup: e.target.value }))}
                  className="h-4 w-4 text-blue-500 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                />
                <span className="text-blue-100 font-medium">{option.label}</span>
              </label>
            ))}
          </div>
        )}

        {step.type === "bookLength" && (
          <div className="space-y-2">
            {step.options.map(option => (
              <label key={option.value} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-blue-400/20 cursor-pointer transition-all duration-200">
                <input
                  type="radio"
                  name="bookLength"
                  value={option.value}
                  checked={formData.bookLength === option.value}
                  onChange={(e) => setFormData(prev => ({ ...prev, bookLength: e.target.value }))}
                  className="h-4 w-4 text-blue-500 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                />
                <span className="text-blue-100 font-medium">{option.label}</span>
              </label>
            ))}
          </div>
        )}

        {step.type === "authors" && (
          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowAuthorSuggestions(true);
                }}
                placeholder="Search for authors..."
                className="w-full px-4 py-2 bg-white/10 border border-blue-400/30 rounded-lg text-blue-100 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              {showAuthorSuggestions && searchQuery && (
                <div className="absolute z-10 w-full mt-2 bg-blue-900/90 backdrop-blur-sm border border-blue-400/30 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredAuthors.map(author => (
                    <div
                      key={author}
                      onClick={() => handleAuthorSelect(author)}
                      className="px-4 py-2 hover:bg-blue-400/20 cursor-pointer transition-colors duration-200 text-blue-100"
                    >
                      {author}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.authors.map(author => (
                <div
                  key={author}
                  className="flex items-center bg-blue-400/20 text-blue-100 px-3 py-1 rounded-full font-medium"
                >
                  <span>{author}</span>
                  <button
                    onClick={() => removeAuthor(author)}
                    className="ml-2 text-blue-300 hover:text-blue-100 transition-colors"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 py-8 px-4 sm:px-6 lg:px-8">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-2 bg-gray-200">
        <div 
          className="h-full bg-blue-500 transition-all duration-500"
          style={{ width: `${calculateProgress()}%` }}
        />
      </div>

      {/* Welcome Message */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Welcome to Your Reading Journey</h1>
        <p className="text-blue-200 text-lg">
          Let's personalize your experience to help you discover books you'll love.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <div className="flex justify-between mb-3">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 flex-1 mx-1 rounded-full transition-all duration-300 ${
                  index <= currentStep ? 'bg-blue-400' : 'bg-blue-800'
                }`}
              />
            ))}
          </div>
          <p className="text-sm font-medium text-blue-200 text-center">
            Step {currentStep + 1} of {steps.length}
          </p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl p-8">
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>

          <div className="mt-10 flex justify-between">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-2.5 border border-blue-400 rounded-lg text-blue-100 hover:bg-blue-400/20 transition-colors font-medium"
              >
                Previous
              </button>
            )}
            <div className="flex space-x-4 ml-auto">
              {!steps[currentStep].required && (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-2.5 border border-blue-400 rounded-lg text-blue-100 hover:bg-blue-400/20 transition-colors font-medium"
                >
                  Skip
                </button>
              )}
              {currentStep < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                >
                  Finish
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PreferencesPage; 