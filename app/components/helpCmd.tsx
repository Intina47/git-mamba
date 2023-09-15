import React from 'react';
import {helpCommands} from '../constants';

const helpCmd = () => {
 return (
  <div className="text-white font-mono">
   <ul className='list-disc list-inside'>
    {helpCommands.map((command, index) => (
     <li key={index}>
      <span className="text-yellow-500">{command.name}</span>
      <span className="text-white"> - {command.description}</span>
     </li>
    ))}
   </ul>
  </div>
 );
};

export default helpCmd;