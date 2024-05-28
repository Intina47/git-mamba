import React from 'react';

import QuoteForm from '../app/components/admin/QuoteForm';
import '../app/globals.css';

export default function QuoteFormPage() {
 const handleQuoteSubmission = async (quoteData) => {
  console.log('Received quote data:', quoteData);
  const { quote, source, sourceUrl } = quoteData;
  const newQuote = {
   quote: quote,
   source: source,
   sourceUrl: sourceUrl,
   isApproved: false
  };
  const response = await fetch('/api/quotes', {
   method: 'POST',
   headers: {
    'Content-Type': 'application/json'
   },
   body: JSON.stringify(newQuote)
  });
  if (!response.ok) {
   throw new Error('Error saving quote');
  }
  const data = await response.json();
  console.log('Server response:', data);
  return data;
 };

 return (
  <QuoteForm onSubmit={handleQuoteSubmission} />
 );
}

