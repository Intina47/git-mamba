'use client';
import React, { useState, useEffect } from 'react';
import TerminalLayout from './components/terminal';

const Home = () => {
 const [showTalkToMe, setShowTalkToMe] = useState(true);
 //  const [timeoutId, setTimeoutId] = useState(null);
 const [timeoutId, setTimeoutId] = useState<
    number | NodeJS.Timeout | undefined
  >(undefined);
 useEffect(() => {
  // Function to hide the "Talk to me" button after 5 seconds of inactivity
  const hideTalkToMe = () => {
   setShowTalkToMe(false);
  };

  const resetTimer = () => {
   // Clear the previous timeout
   clearTimeout(timeoutId);
   // Set a new timeout
   const newTimeoutId = setTimeout(hideTalkToMe, 5000); // 5000 milliseconds = 5 seconds
   setTimeoutId(newTimeoutId);
  };

  // Add event listeners for user activity
  window.addEventListener('mousemove', resetTimer);
  window.addEventListener('mousedown', resetTimer);
  window.addEventListener('keypress', resetTimer);
  window.addEventListener('touchmove', resetTimer);

  // Initial setup to hide the "Talk to me" button after 5 seconds
  resetTimer();

  // Clean up event listeners when component unmounts
  return () => {
   window.removeEventListener('mousemove', resetTimer);
   window.removeEventListener('mousedown', resetTimer);
   window.removeEventListener('keypress', resetTimer);
   window.removeEventListener('touchmove', resetTimer);
   // Clear the timeout when component unmounts
   clearTimeout(timeoutId);
  };
 }, [timeoutId]);

 return (
  <main className="flex min-h-screen bg-gray-500 flex-col items-center justify-between p-2 md:p-2 overflow-hidden relative">
   <TerminalLayout />
   {showTalkToMe && (
    <div className="fixed bottom-4 right-4">
     <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
            coming soon
     </button>
    </div>
   )}
  </main>
 );
};

export default Home;
