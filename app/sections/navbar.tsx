// path: app/sections/navbar.tsx
import React from 'react';

const Navbar = () => {
 return (
  <nav className="flex justify-between items-center p-4 bg-gray-800 text-white font-mon0">
   <div
    className="flex items-center cursor-pointer"
   >
    <svg
     xmlns="http://www.w3.org/2000/svg"
     className="h-6 w-6 mr-2 "
     fill="none"
     viewBox="0 0 24 24"
     stroke="currentColor"
    >
     <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 19l-7-7m0 0l7-7m-7 7h18"
     />
    </svg>
    <span className="text-sm font-mono">Back</span>
   </div>
   <div className="flex items-center cursor-pointer">
    <span className="text-sm font-mono">Add Note</span>
    <svg
     xmlns="http://www.w3.org/2000/svg"
     className="h-6 w-6 ml-2"
     fill="none"
     viewBox="0 0 24 24"
     stroke="currentColor"
    >
     <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
     />
     <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 14v5m0 0v-5m0 5h-5m5 0h5"
     />
    </svg>
   </div>
  </nav>
 );
};

export default Navbar;
