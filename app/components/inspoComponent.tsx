import React from 'react';

const Inspocard = ({ quote, source, sourceUrl }: { quote: string; source: string; sourceUrl?: string }) => {
 return (
  <div className="relative bg-gradient-to-r from-teal-500 to-blue-500 rounded-lg overflow-hidden shadow-md hover:shadow-xl">
   <div className="p-6 text-white">
    {quote.length > 30 ? (
     <p className="text-xl font-bold leading-relaxed">
      {quote}
     </p>
    ) : (
     <span className="text-sm font-bold leading-relaxed">
      {quote}
     </span>
    )}
    <div className="mt-4 flex items-center justify-between text-sm">
     <span>{source}</span>
     {sourceUrl && (
      <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="text-black bg-gradient-to-r from-blue-500 to-blue-500">
            Source
      </a>
     )}
    </div>
   </div>
   <div className="absolute inset-x-0 bottom-0 h-1/5 bg-gradient-to-b from-teal-500 to-blue-500 animate-pulse"></div>
  </div>
 );
};

export default Inspocard;