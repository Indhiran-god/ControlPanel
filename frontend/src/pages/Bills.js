import React, { useState } from 'react';

const Bills = () => {
  const [selectedDate, setSelectedDate] = useState('');

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
      <div className='bg-white py-2 px-4 flex justify-between items-center w-full max-w-md'>
        <h2 className='font-bold text-lg'>All Bills</h2>
      </div>
      <div className='bg-white py-4 px-6 mt-4 shadow-md rounded w-full max-w-md'>
        <select
          value={selectedDate}
          onChange={handleDateChange}
          className='border border-gray-300 rounded p-2 mb-4 w-full'
        >
          <option value=''>Select Bill</option>
          {/* Add your date options here */}
        </select>
        
        <ul className='mt-4'>
          {/* Render bills here based on selectedDate */}
          <li>No bills available.</li>
        </ul>
      </div>
    </div>
  );
};

export default Bills;
