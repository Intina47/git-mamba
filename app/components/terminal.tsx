'use client';
import React, { useEffect, useState } from 'react';
import { useInterval } from '../utils/blinkerIntervals';
import {isMobileDevice} from '../utils/responsiveness';
import {fetchMdFiles} from '../utils/fetchmdfiles';
import BootUpSequence from './bootupSequence';
import { helpCommands, lsfliles,promt } from '../constants';
import PromptConfiguration from './PromptConfiguration';
import './styles-for-mobile.css';
import classNames from 'classnames';
import { escapeHtml } from 'markdown-it/lib/common/utils';
import Footer from './footer';
// env
import dotenv from 'dotenv';
dotenv.config();

const TerminalLayout = () => {
 const [blink, setBlink] = useState(false);
 const [booting, setBooting] = useState(true);
 const [userCount, setUserCount] = useState(0);
 const [lastLoginTime, setLastLoginTime] = useState('');
 const [outputText, setOutputText] = useState<React.ReactNode[]>([]);
 const endOfTerminalRef = React.useRef<HTMLDivElement>(null);
 const [readReadmeHtml, setReadmeHtml] = useState('');
 const [readProjectsFile, setReadProjectsfile] = useState('');
 const [readSkillsFile, setReadSkillsfile] = useState('');
 const [images, setImages] = useState([]);
 const [loading, setLoading] = useState(true);
 const [triggerApiCall, setTriggerApiCall] = useState(false);
 const mobile = isMobileDevice();
 // Create a state variable to store the history of commands
 const [commandHistory, setCommandHistory] = useState<string[]>([]);
 // Create a state variable to store the current input value
 const [inputValue, setInputValue] = useState<string>('');

 // sanitize to remove trailing spaces and convert into small letters
 let sanitizedInput = inputValue.trim().toLowerCase();
 let filename = '';

 // Scroll to the end of the terminal
 const scrollToBottom = () => {
  if (endOfTerminalRef.current) {
   endOfTerminalRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }
 };

 const openCV = () => {
  // Open the CV in a new tab
  window.open('/isaiahNtina.pdf', '_blank');
 };

 // Clear terminal
 const clearTerminal = () => {
  setOutputText([]);
 };

 useEffect(() => {
  if (triggerApiCall) {
   setLoading(true); // Set loading state to true initially

   fetch('/api/randomAnimal')
    .then((response) => {
     if (!response.ok) {
      throw new Error('Network response was not ok');
     }
     return response.json();
    })
    .then((data) => {
     setImages(data.images);
     setLoading(false); // Set loading state to false on success
    })
    .catch((error) => {
     console.error('An Error Occurred:', error);
     setLoading(false); // Set loading state to false on error
    });

   setTriggerApiCall(false);
  }
 }, [triggerApiCall]);

 // Function that handles file uploads
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

 //   fun.js endpoint

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
  const value = e.target.value;
  setInputValue(value);
 };

 // Add an event listener to listen for the keydown event
 useEffect(() => {
  const handleKeyDown = (event: KeyboardEvent) => {
   if (event.keyCode === 38) { // Check if the pressed key is the arrow up key
    event.preventDefault();
    if (commandHistory.length > 0) { // Check if the history of commands is not empty
     const lastCommand = commandHistory[commandHistory.length - 1]; // Get the last command from the history array
     setInputValue(lastCommand); // Set the last command as the current input value
    }
   }
  };

  window.addEventListener('keydown', handleKeyDown);

  return () => {
   window.removeEventListener('keydown', handleKeyDown);
  };
 }, [commandHistory]);

 // Handle user input submission
 const handleInputSubmit = (e: { preventDefault: () => void }) => {
  e.preventDefault();
  if (inputValue.trim() === '') return;
  if (inputValue.trim() === 'guesswhat'){
   setTriggerApiCall(true);
   //    triggerApiCallToUpdateDataJson();
  }
  // Create a unique key for the new JSX element
  const uniqueKey = new Date().getTime().toString();
  let helpString: string | number | boolean | React.JSX.Element | Iterable<React.ReactNode> | React.PromiseLikeOfReactNode | null | undefined;
  let errorString: string | number | boolean | React.JSX.Element | Iterable<React.ReactNode> | React.PromiseLikeOfReactNode | null | undefined;
  let aboutmeString: string | number | boolean | React.JSX.Element | Iterable<React.ReactNode> | React.PromiseLikeOfReactNode | null | undefined;
  let listOfFiles: string | number | boolean | React.JSX.Element | Iterable<React.ReactNode> | React.PromiseLikeOfReactNode | null | undefined;
  let guesswhat: string | number | boolean | React.JSX.Element | Iterable<React.ReactNode> | React.PromiseLikeOfReactNode | null | undefined;

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
   //    <p className='text-white font-mono' key={uniqueKey + '-input'}>
   //     <span className='text-red-500'>${base[0].privilage}</span>
   //     <span className='text-yellow-500'>${base[0].connector}</span>
   //     <span className='text-blue-500'>${base[].username}</span>
   //     <span className='text-yellow-500'> ~ ${base.endofline} </span>
   //     {sanitizedInput}
   //    </p>
   <PromptConfiguration uniqueKey={uniqueKey} sanitizedInput={sanitizedInput} />
  );
  setOutputText((prevOutput) => [...prevOutput, inputString]);

  if (sanitizedInput.startsWith('cat')) {
   filename = sanitizedInput.split(' ')[1];
   if (!filename){
    errorString= (
     <p  className="text-red-600" >
       Please enter file name to cat.
      <p className="text-green-500 ml-1">Example: cat readme.md</p>
     </p>);
    setOutputText((prevOutput) => [...prevOutput, errorString]);
    setInputValue('');
    return;
   }
   sanitizedInput = 'cat';
  }

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
  case 'email':
   aboutmeString = (
    <p className='text-white font-mono' key={uniqueKey + '-output'}>
     <span className='text-yellow-500'>Email:</span> {process.env.NEXT_PUBLIC_EMAIL}
    </p>
   );
   setOutputText((prevOutput) => [...prevOutput, aboutmeString]);
   break;
   //    guesswhat, create a list of animals pick one animal in random from the list and send it to the scrapper for it to get the images
  case 'guesswhat':
   // open close
   if (loading) {
    guesswhat = (
     <div>
      <p className='text-white font-mono' key={uniqueKey + '-output'}>
       <span className='text-yellow-500'>🤔 Thinking:</span> Please wait{' '}
       <span className="animate-pulse"> .... </span>
      </p>
     </div>
    );

    // Set a timer to remove the loading message after a certain time (e.g., 5 seconds)
    setTimeout(() => {
     // Remove the loading message from outputText
     setOutputText((prevOutput) => prevOutput.filter(item => item !== guesswhat));

     // Show the "Taking longer than expected" message
     const errorMessage = (
      <p className='text-white font-mono'>
       <span className='text-red-500'>😞 This is taking longer than expected, can you enter the command again 😞 </span> {' '}
       <span className="animate-pulse"> .... </span>
      </p>
     );

     setOutputText((prevOutput) => [...prevOutput, errorMessage]);

     // Set a timer to remove the error message after a certain time (e.g., 5 seconds)
     setTimeout(() => {
      // Remove the error message from outputText
      setOutputText((prevOutput) => prevOutput.filter(item => item !== errorMessage));
     }, 10000); // 5000 milliseconds (5 seconds) for the error message
    }, 5000); // 5000 milliseconds (5 seconds) for the loading message
   }  else {
    guesswhat = (
     <div className='mt-2'>
      <div className='flex flex-wrap justify-center'>
       {images.map((image, index) => (
        <div key={index} className='w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-2'>
         <img src={image} alt='animal' className='rounded-lg' />
        </div>
       ))}
      </div>
     </div>
    );
   }

   setOutputText((prevOutput) => [...prevOutput, guesswhat]);
   break;

  case 'cat':
   if (filename === 'projects.md') {
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
    if(filename === ''){
     errorString = (
      <p className='text-red-500 font-mono' key={uniqueKey + '-output'}>
                     Please enter a valid filename
       <p className="text-green-500 ml-1">Usage example: cat readme.md</p>
      </p>
     );
    } else {
     errorString = (
      <p className='text-red-500 font-mono' key={uniqueKey + '-output'}>
       {filename}: Sorry! No such file exists
       <p className="text-green-500 ml-1">Type <span className='text-yellow-500 px-1 rounded'>&lsquo;ls&lsquo;</span> to see all files available</p>
      </p>
     );
    }
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
     <li><span className='text-yellow-500'>ls</span> - list of files eg.projects, cv.pdf</li>
     <li><span className='text-yellow-500'>email</span> - get my email</li>
    </ul></>
   );
   setOutputText((prevOutput) => [...prevOutput, errorString]);
   break;
  }
  // Add the entered command to the history
  setCommandHistory((prevHistory) => [...prevHistory, inputValue]);
  setInputValue('');
 };

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
     {/* mamba.sh and say hi badge at the far right */}
     <div className='flex justify-between items-center mb-4'>
      <p className='text-green-500 text-2xl font-mono'>mamba.sh</p>
      <button className='bg-green-500 text-white px-4 py-2 rounded' onClick={openCV}>View CV</button>
     </div>

     <hr className='border-gray-600 my-4' />
     <p className='text-gray-600 text-xs font-mono mb-1'>
            Last login: {lastLoginTime} on {formatUserCount()}{' '}
     </p>
     <p className='text-white font-mono'>Hi!</p>
     <p className='text-white font-mono mb-4'>
            I&apos;m Ntina, am currently a 4th year computing student at the Univerisity of Dundee
     </p>
     <div className='mt-2' dangerouslySetInnerHTML={{__html: readReadmeHtml}} />
     <hr className='border-gray-600 my-4' />
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
      <div className={classNames('flex items-baseline', { 'mobile-styles': mobile })} ref={endOfTerminalRef}>
       <p className='text-white font-mono'>
        <span className='text-red-500'>{promt[0].privilage}</span>
        <span className='text-yellow-500'>{promt[0].connector}</span>
        <span className='text-blue-500'>{promt[0].username}</span>
        <span className='text-yellow-500'> ~ {promt[0].endofline} </span>
       </p>
       <input
        type='text'
        // text input caret the blinking curson
        className='bg-transparent text-white outline-none ml-2'
        value={inputValue}
        onChange={handleInputChange}
        autoFocus
        placeholder='type here..'
        autoComplete='off'
       />
      </div>
     </form>
     <hr className='border-gray-600 my-0 mt-10' />
     <Footer />
    </>
   )}
  </div>
 );
};

export default TerminalLayout;
