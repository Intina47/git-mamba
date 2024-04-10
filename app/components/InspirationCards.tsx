import React from 'react';
import Inspocard from './inspoComponent';

const InspirationCards = () => {
 const quotes = [
  {
   quote: '"What i can not create, i do not understand."',
   source: 'Richard Feynman',
   sourceUrl: 'https://www.britannica.com/biography/Richard-P-Feynman',
  },
  {
   quote: '"The only way to do great work is to love what you do."',
   source: 'Steve Jobs',
   sourceUrl: 'https://www.britannica.com/biography/Steve-Jobs',
  },
  {
   quote: '"You are never too old to set another goal or to dream a new dream."',
   source: 'C.S. Lewis',
   sourceUrl: 'https://www.britannica.com/biography/C-S-Lewis'
  },
  {
   quote: '"The mind is everything. What you think you become."',
   source: 'Buddha',
   sourceUrl: 'https://www.britannica.com/biography/Buddha',
  },
  {
   quote: '"The only person you are destined to become is the person you decide to be."',
   source: 'Ralph Waldo Emerson',
   sourceUrl: 'https://www.britannica.com/biography/Ralph-Waldo-Emerson',
  },
 ];

 return (
  <div className="flex flex-wrap justify-center gap-4 mt-1 mb-1">
   {quotes.map((quote, index) => (
    <Inspocard
     key={index}
     quote={quote.quote}
     source={quote.source}
     sourceUrl={quote.sourceUrl}
    />
   ))}
  </div>
 );
};

export default InspirationCards;
