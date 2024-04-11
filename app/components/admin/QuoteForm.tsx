import React, { useState } from 'react';
import { useForm } from 'react-hook-form'; // Form validation library (optional)

interface QuoteFormProps {
  onSubmit: (quote: string, source?: string, sourceUrl?: string) => void;
}

const QuoteForm = ({ onSubmit }: QuoteFormProps) => {
 const { register, handleSubmit, formState: { errors } } = useForm();
 const [quote, setQuote] = useState('');
 const [source, setSource] = useState('');
 const [sourceUrl, setSourceUrl] = useState('');

 const handleQuoteChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
  setQuote(event.target.value);
 };

 const handleSourceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setSource(event.target.value);
 };

 const handleSourceUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setSourceUrl(event.target.value);
 };

 const handleFormSubmit = (data: { quote: string, source?: string, sourceUrl?: string }) => {
    onSubmit(data.quote, data.source, data.sourceUrl);
    setQuote('');
    setSource('');
    setSourceUrl('');
 };

 return (
  <div className="mx-auto max-w-lg px-4">
   <form onSubmit={handleSubmit(handleFormSubmit)} className="mt-4 bg-white p-4 rounded-lg shadow-md">
    <div className="mb-4">
     <label htmlFor="quote" className="block text-sm font-medium text-gray-700">
            Quote
     </label>
     <textarea
      {...register('quote', { required: true })}
      id="quote"
      value={quote}
      onChange={handleQuoteChange}
      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm rounded-md py-2 px-3 bg-gray-100 focus:outline-none"
      rows={5}
     />
     {errors.quote && <p className="text-red-500 text-xs mt-1">Quote is required.</p>}
    </div>
    <div className="mb-4">
     <label htmlFor="source" className="block text-sm font-medium text-gray-700">
            Source (Optional)
     </label>
     <input
      type="text"
      id="source"
      value={source}
      onChange={handleSourceChange}
      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm rounded-md py-2 px-3 bg-gray-100 focus:outline-none"
     />
    </div>
    <div className="mb-4">
     <label htmlFor="sourceUrl" className="block text-sm font-medium text-gray-700">
            Source URL (Optional)
     </label>
     <input
      type="url"
      id="sourceUrl"
      value={sourceUrl}
      onChange={handleSourceUrlChange}
      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm rounded-md py-2 px-3 bg-gray-100 focus:outline-none"
     />
    </div>
    <button
     type="submit"
     className="inline-flex items-center px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
          Submit
    </button>
   </form>
  </div>
 );

};

export default QuoteForm;