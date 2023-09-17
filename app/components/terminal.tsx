'use client';
import React, { useEffect, useState } from 'react';
import { useInterval } from '../utils/blinkerIntervals';
import {isMobileDevice} from '../utils/responsiveness';
import {fetchMdFiles} from '../utils/fetchmdfiles';
import BootUpSequence from './bootupSequence';
import { helpCommands, lsfliles } from '../constants';
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
 const [readProjectsFile, setReadProjectsfile] = useState('');
 const [readSkillsFile, setReadSkillsfile] = useState('');
 const mobile = isMobileDevice();
 // sanitize to remove trailing spaces and convert into small letters
 let sanitizedInput = inputValue.trim().toLowerCase();
 let filename = '';

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
  fetchMdFiles('/api/readme').then((data) => {
   if (data) {
    setReadmeHtml(data.htmlContent);
   }
  });
 }, []);
 useEffect(() => {
  fetchMdFiles('/api/projects').then((data) => {
   if (data) {
    setReadProjectsfile(data.htmlContent);
   }
  });
 }, []);
 useEffect(() => {
  fetchMdFiles('api/skills').then((data) => {
   if (data) {
    setReadSkillsfile(data.htmlContent);
   }
  });
 },[]);

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

 // Handle user input submission
 const handleInputSubmit = (e: { preventDefault: () => void }) => {
  e.preventDefault();
  if (inputValue.trim() === '') return;
  // Create a unique key for the new JSX element
  const uniqueKey = new Date().getTime().toString();
  let helpString: string | number | boolean | React.JSX.Element | Iterable<React.ReactNode> | React.PromiseLikeOfReactNode | null | undefined;
  let errorString: string | number | boolean | React.JSX.Element | Iterable<React.ReactNode> | React.PromiseLikeOfReactNode | null | undefined;
  let aboutmeString: string | number | boolean | React.JSX.Element | Iterable<React.ReactNode> | React.PromiseLikeOfReactNode | null | undefined;
  let listOfFiles: string | number | boolean | React.JSX.Element | Iterable<React.ReactNode> | React.PromiseLikeOfReactNode | null | undefined;

  // Sanitize the input for display (makes sure user inputs are treated as plain text)
  const sanitizedInputForDisplay = escapeHtml(sanitizedInput);
  // white list [a list of allowed patterns]
  const allowedPattern = /^[a-zA-Z0-9\s\-._]+$/;
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

  const inputString = (
   <p className='text-white font-mono' key={uniqueKey + '-input'}>
    <span className='text-red-500'>guest</span>
    <span className='text-yellow-500'>@</span>
    <span className='text-blue-500'>mamba.sh</span>
    <span className='text-yellow-500'> ~ $ </span>
    {sanitizedInput}
   </p>
  );
  setOutputText((prevOutput) => [...prevOutput, inputString]);

  //   extract cat from the cat command only make sure sanitizedInput takes only cat to the switch
  if (sanitizedInput.startsWith('cat')) {
   filename = sanitizedInput.split(' ')[1];
   sanitizedInput = 'cat';
  }
  console.log('Sanitized Input2: ', sanitizedInput);
  console.log('file name: ', filename);

  // Switch statement to handle the different commands
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
  case 'whoami':
   aboutmeString = (
    <div className='mt-2' dangerouslySetInnerHTML={{__html: readReadmeHtml}} />
   );
   setOutputText((prevOutput) => [...prevOutput, aboutmeString]);
   break;
  case 'ls':
   listOfFiles = (
    <div className='text-white text-sm font-light' key={uniqueKey + '-output'}>
     <p className='text-sm text-green-500 font-light mb-1'>use cat FILENAME to explore each file below</p>
     <ul className='list-disc list-inside'>
      {lsfliles.map((command, index) => (
       <li key={index}>
        <span className='text-yellow-500'>{command.name}</span>
        <span className='text-white'> - {command.description}</span>
       </li>
      ))}
     </ul>
    </div>
   );
   setOutputText((prevOutput) => [...prevOutput, listOfFiles]);
   break;
  case 'cat':
   if (filename === 'projects.md') {
    // aboutmeString = (<AboutMe />);
    aboutmeString = (
     <div className='mt-2' dangerouslySetInnerHTML={{__html: readProjectsFile}} />
    );
    setOutputText((prevOutput) => [...prevOutput, aboutmeString]);
   } else if (filename === 'readme.md') {
    aboutmeString = (
     <div className='mt-2' dangerouslySetInnerHTML={{__html: readReadmeHtml}} />
    );
    setOutputText((prevOutput) => [...prevOutput, aboutmeString]);
   } else if (filename == 'skills.md') {
    aboutmeString = (
     <div className='mt-2' dangerouslySetInnerHTML={{__html: readSkillsFile}} />
    );
    setOutputText((prevOutput) => [...prevOutput, aboutmeString]);
   }else {
    errorString = (
     <p className='text-red-500 font-mono' key={uniqueKey + '-output'}>
      {filename}: does not exist
     </p>
    );
    setOutputText((prevOutput) => [...prevOutput, errorString]);
   }
   break;
  case 'clear':
   clearTerminal();
   break;
  default:
   errorString = (
    <><p className='text-red-500 font-mono' key={uniqueKey + '-output'}>
     {sanitizedInputForDisplay}: command not found
    </p><ul className="list-disc list-inside text-sm font-light mt-1">
     <h2 className='text-green-500 font-light text-sm'>Try one of the following:</h2>
     <li><span className='text-yellow-500'>help</span> - discover list of commands to help you get around</li>
     <li><span className='text-yellow-500'>clear</span> - clear the terminal</li>
     <li><span className='text-yellow-500'>whoami</span> - learn more about me</li>
    </ul></>
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
