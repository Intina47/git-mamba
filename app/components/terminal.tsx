'use client';
import React, { useEffect, useState } from 'react';
import { useInterval } from '../utils/blinkerIntervals';
import BootUpSequence from './bootupSequence';
import {helpCommands} from '../constants';

const TerminalLayout = () => {
 const [blink, setBlink] = useState(false);
 const [booting, setBooting] = useState(true);
 const [userCount, setUserCount] = useState(0);
 const [lastLoginTime, setLastLoginTime] = useState('');
 const [inputValue, setInputValue] = useState('');
 const [outputText, setOutputText] = useState<React.ReactNode[]>([]);
 const endOfTerminalRef = React.useRef<HTMLDivElement>(null);

 // scroll to the end of the terminal
 const scrollToBottom = () => {
  if (endOfTerminalRef.current) {
   endOfTerminalRef.current.scrollIntoView({ behavior: 'smooth', block: 'end'});
  }
 };
 //  clear terminal
 const clearTerminal = () => {
  setOutputText([]);
 };
  // scroll to the end of the terminal when the outputText changes
 useEffect(() => {
  scrollToBottom();
 }
 ,[outputText]);
 //  simulate the boot-up process
 useEffect(() => {
  if (typeof window !== 'undefined') {
   // retrieve the count from the localStorage
   const storedUserCount = localStorage.getItem('userCount');
   if (storedUserCount) {
    setUserCount(parseInt(storedUserCount, 10));
   } else {
    setUserCount(0);
   }
   // Get the timestamp when the component first loads
   const loginTime = new Date().toUTCString();
   setLastLoginTime(loginTime);
   // Increment the user count and store it
   const newUserCount = userCount + 1;
   setUserCount(newUserCount);
   localStorage.setItem('userCount', newUserCount.toString());

   const timer = setTimeout(() => {
    setBooting(false);
   }, 5000);
   return () => clearTimeout(timer);
  }
 },[]);

 useInterval(() => {
  setBlink(!blink);
 }
 , 500);
 // handle user input
 const handleInputChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
  setInputValue(e.target.value);
 };
 // handle user input submission
 const handleInputSubmit = (e: { preventDefault: () => void; }) => {
  e.preventDefault();
  if (inputValue.trim() === '') return;

  // create a unique key for the new jsx element
  const uniqueKey = new Date().getTime().toString();
  // add the user input as a string
  const inputString = (
   <p className='text-white font-mono' key={uniqueKey + '-input'}>
    <span className='text-red-500'>guest</span>
    <span className='text-yellow-500'>@</span>
    <span className='text-blue-500'>mamba.sh</span>
    <span className='text-yellow-500'> ~ $ </span>
    {inputValue}
   </p>
  );

  // Combine both arrays and set the state
  setOutputText((prevOutput) => [...prevOutput, inputString]);
  // handle user input
  if (inputValue.trim() === 'help') {
   const helpOutput: React.ReactNode[] = [];
   helpOutput.push(<div key="help-heading" className="text-yellow-500 font-light text-sm mb-1">Use the commands below to get around:</div>);
   helpCommands.forEach((command) => {
    helpOutput.push(
     <div key={command.name} className="text-white font-light text-sm">
      <span className="text-yellow-500">{command.name}</span> - {command.description}
     </div>
    );
   });
   setOutputText((prevOutput) => [...prevOutput, ...helpOutput]);
  } else if (inputValue.trim() === 'clear'){
   clearTerminal();
  } else {
   const errorString = (
    <p className='text-red-500 font-mono' key={uniqueKey + '-error'}>
     {inputValue}: command not found
    </p>
   );
   setOutputText((prevOutput) => [...prevOutput, errorString]);
  }
  // clear the input field
  setInputValue('');
 };
 // Function to format the user count as "imnssxxx"
 const formatUserCount = () => {
  const paddedCount = String(userCount).padStart(3, '0');
  return `imnss${paddedCount}`;
 };

 return (
  <div className="w-full md:w-1/2 bg-black text-green-500 p-6 rounded-lg shadow-lg mx-auto">
   {
    booting ? <BootUpSequence /> :
     <>
      {/* mamba.sh heading */}
      <p className="text-green-500 text-2xl font-mono">mamba.sh</p>

      <hr className="border-gray-600 my-4"/>
      <p className="text-gray-600 text-xs font-mono mb-1">Last login: {lastLoginTime} on {formatUserCount()} </p>
      <p className="text-white font-mono">Hi!</p>
      <p className="text-white font-mono mb-4">I&apos;m Ntina, am currently a 4th year computing student at the Univerisity of Dundee</p>
      <p className="text-white font-mono">Type <span className="text-yellow-500 px-1 rounded">&lsquo;help&lsquo;</span> to see a list of commands.</p>
      <hr className="border-gray-600 my-4"/>

      {/* Display terminal output */}
      <div className="mb-2" ref={endOfTerminalRef}>
       {outputText.map((line, index) => (
        <p key={index} className="text-white font-mono">
         {line}
        </p>
       ))}
      </div>

      <form onSubmit={handleInputSubmit}>
       {/* md:flex-col md:flex-wrap md:items-baseline */}
       <div className="flex items-baseline" ref={endOfTerminalRef}>
        <p className="text-white font-mono">
         <span className="text-red-500">guest</span>
         <span className="text-yellow-500">@</span>
         <span className="text-blue-500">mamba.sh</span>
         <span className="text-yellow-500"> ~ $</span>
        </p>
        <input
         type="text"
         className="bg-transparent text-white outline-none ml-2"
         value={inputValue}
         onChange={handleInputChange}
         autoFocus
        />
       </div>
      </form>
     </>
   }
  </div>
 );

};

export default TerminalLayout;