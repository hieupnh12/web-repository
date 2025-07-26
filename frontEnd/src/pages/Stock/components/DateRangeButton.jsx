import React, { useState, useRef, useEffect } from 'react';
import { Calendar } from 'lucide-react';

const DateRangeButton = ({ 
  startDate, 
  endDate, 
  onStartDateChange, 
  onEndDateChange, 
  onApply,
  onClear 
}) => {
  const [showDateRange, setShowDateRange] = useState(false);
  const dateRangeRef = useRef(null);

  // Close date range picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dateRangeRef.current && !dateRangeRef.current.contains(event.target)) {
        setShowDateRange(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDateRange = () => {
    setShowDateRange(!showDateRange);
  };

  const handleClear = () => {
    onClear();
    setShowDateRange(false);
  };

  const handleApply = () => {
    onApply();
    setShowDateRange(false);
  };

  // Convert YYYY-MM-DD to Date object
  const handleStartDateChange = (value) => {
    if (value) {
      onStartDateChange(new Date(value));
    } else {
      onStartDateChange(null);
    }
  };

  const handleEndDateChange = (value) => {
    if (value) {
      onEndDateChange(new Date(value));
    } else {
      onEndDateChange(null);
    }
  };

  // Format Date object back to YYYY-MM-DD for input display
  const formatDateForInput = (date) => {
    if (!date) return '';
    return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
  };

  return (
    <div className="relative" ref={dateRangeRef}>
      {/* Date Range Button */}
      <button
        onClick={toggleDateRange}
        className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
          showDateRange 
            ? 'bg-teal-500 text-white border-teal-500' 
            : (startDate || endDate)
              ? 'bg-teal-500 text-white border-teal-500'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
        }`}
      >
        <Calendar size={16} />
        <span>Date Range</span>
      </button>

      {/* Date Range Picker - Floating Dropdown */}
      {showDateRange && (
        <div className="absolute top-full left-0 mt-2 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-[400px]">
          <div className="flex items-center space-x-4 mb-3">
            <div className="flex items-center space-x-2">
              <label htmlFor="start-date" className="text-sm font-medium text-gray-700 whitespace-nowrap">
                Từ ngày:
              </label>
              <input
                type="date"
                id="start-date"
                value={formatDateForInput(startDate)}
                onChange={(e) => handleStartDateChange(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <label htmlFor="end-date" className="text-sm font-medium text-gray-700 whitespace-nowrap">
                Đến ngày:
              </label>
              <input
                type="date"
                id="end-date"
                value={formatDateForInput(endDate)}
                onChange={(e) => handleEndDateChange(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <button
              onClick={handleClear}
              className="text-sm text-gray-500 hover:text-gray-700 px-2 py-1 rounded"
            >
              Clear
            </button>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowDateRange(false)}
                className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1 rounded border"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                className="bg-teal-500 hover:bg-teal-600 text-white px-3 py-1 rounded text-sm"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangeButton;