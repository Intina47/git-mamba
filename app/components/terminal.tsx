'use client';
import React, { useEffect, useState } from 'react';
import { useInterval } from '../utils/blinkerIntervals';
import {isMobileDevice} from '../utils/responsiveness';
import BootUpSequence from './bootupSequence';
import { helpCommands } from '../constants';
import './styles-for-mobile.css';
import classNames from 'classnames';
import { escapeHtml } from 'markdown-it/lib/common/utils';

const TerminalLayout = () => {
 const [blink, setBlink] = useState(false);
 const [booting, setBooting] = useState(true);
 const [userCount, setUserCount] = useState(0);
 const [lastLoginTime, setLastLoginTime] = useState('');
 const [inputValue, setInputValue] = useState('');
 const [outputText, setOutputText] = useState<React.ReactNode[]>([]);
 const endOfTerminalRef = React.useRef<HTMLDivElement>(null);
 const [readReadmeHtml, setReadmeHtml] = useState('');
 const mobile = isMobileDevice();

 // Scroll to the end of the terminal
 const scrollToBottom = () => {
  if (endOfTerminalRef.current) {
   endOfTerminalRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }
 };

 // Clear terminal
 const clearTerminal = () => {
  setOutputText([]);
 };

 useEffect(() => {
  async function fetchReadme() {
   try {
    const response = await fetch('/api/readme');
    console.log('Fetching from read me');
    if (response.ok) {
     console.log('fetch was succefull');
     const data = await response.json();
     setReadmeHtml(data.htmlContent);
    } else {
     console.error('[loop] Error fetching README: ', response.statusText);
    }
   } catch (error) {
    console.error('[catch] Error fetching README: ', error);
   }
  }
  fetchReadme();
 }, []);
 // Scroll to the end of the terminal when the outputText changes
 useEffect(() => {
  scrollToBottom();
 }, [outputText]);

 // Simulate the boot-up process
 useEffect(() => {
  if (typeof window !== 'undefined') {
   // Retrieve the count from localStorage
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
 }, []);

 useInterval(() => {
  setBlink(!blink);
 }, 500);

 // Handle user input
 const handleInputChange = (e: { target: { value: React.SetStateAction<string> } }) => {
  setInputValue(e.target.value);
 };
 //  const logFilePath = path.join(__dirname, 'user_activity.log');
 // Handle user input submission
 const handleInputSubmit = (e: { preventDefault: () => void }) => {
  e.preventDefault();
  if (inputValue.trim() === '') return;
  // Create a unique key for the new JSX element
  const uniqueKey = new Date().getTime().toString();
  let helpString: string | number | boolean | React.JSX.Element | Iterable<React.ReactNode> | React.PromiseLikeOfReactNode | null | undefined;
  let errorString: string | number | boolean | React.JSX.Element | Iterable<React.ReactNode> | React.PromiseLikeOfReactNode | null | undefined;
  let aboutmeString: string | number | boolean | React.JSX.Element | Iterable<React.ReactNode> | React.PromiseLikeOfReactNode | null | undefined;
  // TO_DO
  // Send an event with the current time as a parameter so that we can track how long each command takes in our analytics dashboards
  // sanitize to remove trailing spaces and convert into small letters
  const sanitizedInput = inputValue.trim().toLowerCase();
  // Sanitize the input for display (makes sure user inputs are treated as plain text)
  const sanitizedInputForDisplay = escapeHtml(sanitizedInput);
  // white list [a list of allowed patterns]
  const allowedPattern = /^[a-zA-Z0-9\s\-_]+$/;
  const blacklist = [';', '|', '&', '$', '&&', '||', '`', '>', '<', '(', ')', '{', '}'];
  // Check if the input contains any blacklisted characters
  const containsBlacklistedChars = blacklist.some((char) => sanitizedInput.includes(char));
  // Check if the input contains any characters that are not whitelisted
  const containsNonWhitelistedChars = !allowedPattern.test(sanitizedInput);
  // If the input contains any blacklisted characters, or any characters that are not whitelisted, return early
  if (containsBlacklistedChars || containsNonWhitelistedChars) {
   errorString = (
    <p className='text-red-700 font-mono' key={uniqueKey + '-output'}>
     {sanitizedInputForDisplay}: command not Allowed
    </p>
   );
   setOutputText((prevOutput) => [...prevOutput, errorString]);
   setInputValue('');
   return;
  }
  // const outputMessage = `${sanitizedInput} is ${Math.floor((Math.random()*2)+3)}`;
  // const logEntry = `[${lastLoginTime}] User "${sanitizedInput}" says "${outputMessage}".\n`;

  // Add the user input as a string
  const inputString = (
   <p className='text-white font-mono' key={uniqueKey + '-input'}>
    <span className='text-red-500'>guest</span>
    <span className='text-yellow-500'>@</span>
    <span className='text-blue-500'>mamba.sh</span>
    <span className='text-yellow-500'> ~ $ </span>
    {sanitizedInput}
   </p>
  );

  // Combine both arrays and set the state
  setOutputText((prevOutput) => [...prevOutput, inputString]);

  // Handle user input using a switch
  switch (sanitizedInput) {
  case 'help':
   helpString = (
    <div className='text-white text-sm font-light' key={uniqueKey + '-output'}>
     <p className='text-sm text-green-500 font-light mb-1'>use the commands below to get around:</p>
     <ul className='list-disc list-inside'>
      {helpCommands.map((command, index) => (
       <li key={index}>
        <span className='text-yellow-500'>{command.name}</span>
        <span className='text-white'> - {command.description}</span>
       </li>
      ))}
     </ul>
    </div>
   );
   setOutputText((prevOutput) => [...prevOutput, helpString]);
   break;
  case 'clear':
   clearTerminal();
   break;
  case 'whoami':
   aboutmeString = (
    <div className='mt-2' dangerouslySetInnerHTML={{__html: readReadmeHtml}} />
   );
   setOutputText((prevOutput) => [...prevOutput, aboutmeString]);
   break;
  default:
   errorString = (
    <p className='text-red-500 font-mono' key={uniqueKey + '-output'}>
     {sanitizedInputForDisplay}: command not found
    </p>
   );
   setOutputText((prevOutput) => [...prevOutput, errorString]);
   break;
  }

  // Clear the input field
  setInputValue('');
 };

 // Function to format the user count as "imnssxxx"
 const formatUserCount = () => {
  const paddedCount = String(userCount).padStart(3, '0');
  return `imnss${paddedCount}`;
 };
 return (
  <div className='w-full md:w-1/2 bg-black text-green-500 p-6 rounded-lg shadow-lg mx-auto'>
   {booting ? (
    <BootUpSequence />
   ) : (
    <>
     {/* mamba.sh heading */}
     <p className='text-green-500 text-2xl font-mono'>mamba.sh</p>

     <hr className='border-gray-600 my-4' />
     <p className='text-gray-600 text-xs font-mono mb-1'>
            Last login: {lastLoginTime} on {formatUserCount()}{' '}
     </p>
     <p className='text-white font-mono'>Hi!</p>
     <p className='text-white font-mono mb-4'>
            I&apos;m Ntina, am currently a 4th year computing student at the Univerisity of Dundee
     </p>
     <p className='text-white font-mono'>
            Type <span className='text-yellow-500 px-1 rounded'>&lsquo;help&lsquo;</span> to see a list of commands.
     </p>
     <hr className='border-gray-600 my-4' />

     {/* Display terminal output */}
     <div className='mb-2'>
      {outputText.map((line, index) => (
       <p key={index} className='text-white font-mono'>
        {line}
       </p>
      ))}
     </div>

     <form onSubmit={handleInputSubmit}>
      {/* md:flex-col md:flex-wrap md:items-baseline */}
      <div className={classNames('flex items-baseline', { 'mobile-styles': mobile })} ref={endOfTerminalRef}>
       <p className='text-white font-mono'>
        <span className='text-red-500'>guest</span>
        <span className='text-yellow-500'>@</span>
        <span className='text-blue-500'>mamba.sh</span>
        <span className='text-yellow-500'> ~ $</span>
       </p>
       <input
        type='text'
        // text input caret the blinking curson
        className='bg-transparent text-white outline-none ml-2'
        value={inputValue}
        onChange={handleInputChange}
        autoFocus
        placeholder='type here..'
       />
      </div>
     </form>
    </>
   )}
  </div>
 );
};

export default TerminalLayout;
