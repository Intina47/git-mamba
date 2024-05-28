import React from 'react';

const Inspocard = ({ quote, source, sourceUrl }: { quote: string; source: string; sourceUrl?: string }) => {
 return (
  <div className="relative bg-gradient-to-r from-teal-500 to-blue-500 rounded-lg overflow-hidden shadow-md hover:shadow-xl">
   <div className="p-6 text-white">
    {quote.length > 30 ? (
     <p className="text-sm font-mono leading-relaxed">
      {quote}
     </p>
    ) : (
     <span className="text-sm font-bold leading-relaxed">
      {quote}
     </span>
    )}
    <div className="mt-4 flex items-center justify-between text-sm z-10">
     <span>{source}</span>
     {sourceUrl && (
      <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="text-black bg-inherit">
            Source
      </a>
     )}
    </div>
   </div>
   <div className="absolute inset-x-0 bottom-0 mt-1 h-1/8 rounded-bl-lg rounded-br-lg bg-gradient-to-b from-teal-500 to-blue-500 animate-pulse z-0"></div>
  </div>
 );
};

export default Inspocard;