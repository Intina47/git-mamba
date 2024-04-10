import React from 'react';
import Inspocard from './inspoComponent';

const InspirationCards = () => {
    const quotes = [
        {
          quote: `"The mind is everything. What you think you become."`,
          source: 'Buddha',
          sourceUrl: 'https://www.britannica.com/biography/Buddha',
        },
        { quote: 'Progress.', source: '', sourceUrl: '' },
        { quote: 'Dream Big.', source: '', sourceUrl: '' },
        { quote: 'Stay Positive.', source: '', sourceUrl: '' },
        { quote: 'Believe in Yourself.', source: '', sourceUrl: '' },
        {
          quote: `"The only person you are destined to become is the person you decide to be."`,
          source: 'Ralph Waldo Emerson',
          sourceUrl: 'https://www.britannica.com/biography/Ralph-Waldo-Emerson',
        },
      ];

 return (
  <div className="flex flex-wrap justify-center gap-4 mt-10">
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
