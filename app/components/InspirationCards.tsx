import React from 'react';
import Inspocard from './inspoComponent';

interface Quote {
    quote: string;
    source: string;
    sourceUrl?: string;
    }

const InspirationCards = () => {
 const [quotes, setQuotes] = React.useState<Quote[]>([]);
 React.useEffect(() => {
  fetch('/api/get_quotes')
   .then((res) => res.json())
   .then((data) => {
    setQuotes(data);
   });
 }, []);

 return (
  <div className="flex flex-wrap justify-center gap-4 mt-1 mb-1">
   {quotes.length > 0 ? (
    quotes.map((quote, index) => (
     <Inspocard
      key={index}
      quote={quote.quote}
      source={quote.source}
      sourceUrl={quote.sourceUrl}
     />
    ))
   ) : (
    <div className="text-center text-gray-600">
                    No quotes available at the moment. Check back later!
    </div>
   )}
  </div>
 );
};

export default InspirationCards;
