import React, { useEffect, useState } from 'react';

const Inspocard = ({ quote, source, sourceUrl }: { quote: string; source: string; sourceUrl?: string }) => {
  const [previewData, setPreviewData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSourcePreview = async (url: string) => {
    const response = await fetch(`https://api.microlink.io/?url=${url}`);
    console.log("Response: ", response);
    const data = await response.json();
    return data;
  };

  useEffect(() => {
    const fetchPreview = async () => {
      if (sourceUrl) {
        setIsLoading(true);
        try {
          const preview = await fetchSourcePreview(sourceUrl);
          if (preview.data) {
            setPreviewData(preview.data);
            console.log("Preview data found on url: ", sourceUrl);
            return;
          }else{
            console.log("No preview data found");
          }
          setPreviewData(preview);
        } catch (error) {
          console.error("Error fetching source preview:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchPreview();
  }, [sourceUrl]);

  // Function to determine if the quote should be displayed in one line
  const isShortQuote = (text: string) => {
    return text.split(" ").length <= 10; // Adjust this value based on your needs
  };

  return (
    <div className="relative bg-gradient-to-r from-teal-500 to-blue-500 rounded-lg overflow-hidden shadow-md hover:shadow-xl">
      <div className="p-6 text-white">
        {isShortQuote(quote) ? (
          <span className="text-sm font-bold leading-relaxed inline">
            {source ? `${quote} - ${source}` : quote}
          </span>
        ) : (
          <p className="text-xl font-bold leading-relaxed">
            {quote.length > 100 ? `${quote.substring(0, 100)}...` : quote}
          </p>
        )}
        {sourceUrl && (
          <div className="mt-2 block">
            {isLoading ? (
              <p className="text-blue-600">Loading source preview...</p>
            ) : previewData ? (
              previewData.type === 'image' ? (
                <img src={previewData.url} alt="Source preview" className="w-full h-24 object-cover rounded-lg" />
              ) : (
                <p className="text-blue-600">{previewData.text}</p>
              )
            ) : (
              <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                Source
              </a>
            )}
          </div>
        )}
      </div>
      <div className="absolute inset-x-0 bottom-0 h-1/5 bg-gradient-to-b from-teal-500 to-blue-500 animate-pulse"></div>
    </div>
  );
};

export default Inspocard;
