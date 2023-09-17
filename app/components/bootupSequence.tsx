import React, { useEffect, useState } from 'react';

const BootUpSequence = () => {
 const [text, setText] = useState('');
 const fullText = 'Booting up';

 useEffect(() => {
  let i = 0;
  const typing = setInterval(() => {
   if (i < fullText.length) {
    setText(fullText.slice(0, i+1));
    i++;
   } else {
    clearInterval(typing);
   }
  }, 100);
  return () => clearInterval(typing);
 }, []);

 return (
  <pre className="text-green-500 font-mono whitespace-pre-wrap">
   {text}
   <span className="animate-pulse">....</span>
  </pre>
 );
};

export default BootUpSequence;
