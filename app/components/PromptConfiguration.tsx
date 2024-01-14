import React from 'react';
import { promt } from '../constants';

interface PromptConfigurationProps {
    uniqueKey: string;
    sanitizedInput: string;
}

const PromptConfiguration: React.FC<PromptConfigurationProps> = ({ uniqueKey, sanitizedInput }) => {
 return (
  <div>
   <p className='text-white font-mono' key={uniqueKey + '-input'}>
    <span className='text-red-500'>{promt[0].privilage}</span>
    <span className='text-yellow-500'>{promt[0].connector}</span>
    <span className='text-blue-500'>{promt[0].username}</span>
    <span className='text-yellow-500'> ~ {promt[0].endofline} </span>
    {sanitizedInput}
   </p>
  </div>
 );
};

export default PromptConfiguration;