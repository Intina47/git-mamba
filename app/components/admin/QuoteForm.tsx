// path: app/components/admin/QuoteForm.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/20/solid';

interface FormData {
    quote: string;
    source?: string;
    sourceUrl?: string;
  }

interface QuoteFormProps {
    onSubmit: (data: FormData) => Promise<void>;
  }

const QuoteForm = ({ onSubmit }: QuoteFormProps) => {
 const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();
 const [submitting, setSubmitting] = useState(false);
 const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

 const handleFormSubmit = async (data: FormData) => {
  setSubmitting(true);
  try {
   console.log('Submitting form data:', data); // Debugging
   await onSubmit(data);
   console.log('Form submission successful'); // Debugging
   setSubmitStatus('success');
   setTimeout(() => {
    setSubmitStatus('success');
    setSubmitting(false);
    reset();
   }, 5000);
  } catch (error) {
   console.error('Error submitting form:', error); // Debugging
   setSubmitStatus('error');
   setTimeout(() => {
    setSubmitStatus('error');
    setSubmitting(false);
   }, 5000);
  }
 };

 return (
  <div className="mx-auto max-w-lg px-4">
   <form onSubmit={handleSubmit(handleFormSubmit)} className="mt-4 bg-black p-4 rounded-lg shadow-md">
    <div className="mb-4">
     <label htmlFor="quote" className="block text-sm font-medium text-gray-500">Quote</label>
     <textarea
      {...register('quote', { required: true })}
      onChange={() => setSubmitting(false)}
      id="quote"
      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm text-white font-mono rounded-md py-2 px-3 bg-gray-500 focus:outline-none"
      rows={5}
     />
     {errors.quote && <p className="text-red-500 text-xs mt-1">Quote is required.</p>}
    </div>
    <div className="mb-4">
     <label htmlFor="source" className="block text-sm font-medium text-gray-500">Source (Optional)</label>
     <input
      {...register('source')}
      type="text"
      id="source"
      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm text-white font-mono rounded-md py-2 px-3 bg-gray-500 focus:outline-none"
     />
    </div>
    <div className="mb-4">
     <label htmlFor="sourceUrl" className="block text-sm font-medium text-gray-500">Source URL (Optional)</label>
     <input
      {...register('sourceUrl')}
      type="url"
      id="sourceUrl"
      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm text-white font-mono rounded-md py-2 px-3 bg-gray-500 focus:outline-none"
     />
    </div>
    <div className="mt-4">
     <button
      type="submit"
      className={`w-full py-2 px-4 bg-blue-300 rounded-md font-mono text-white focus:outline-none ${
       submitting ? 'bg-blue-300 hover:bg-blue-300' : 'bg-indigo-500 hover:bg-blue-300'
      }`}
      disabled={submitting}
     >
      {submitting ? (
       <>
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
                Submitting...
       </>
      ) : submitStatus === 'success' ? (
       <span className="flex items-center">
        <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                Submitted!
       </span>
      ) : submitStatus === 'error' ? (
       <span className="flex items-center">
        <ExclamationCircleIcon className="h-5 w-5 text-red-500 mr-2" />
                Error Sending!
       </span>
      ) : (
       'Submit'
      )}
     </button>
    </div>
   </form>
  </div>
 );
};

export default QuoteForm;
