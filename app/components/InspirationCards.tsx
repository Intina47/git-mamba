import React from 'react';
import Inspocard from './inspoComponent';

const InspirationCards = () => {
 const quotes = [
  {
   quote: '\'Design isn\'t finished until somebody is using it.\'',
   source: 'Brenda Laurel',
   sourceUrl: 'Independent Scholar',
  },
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
