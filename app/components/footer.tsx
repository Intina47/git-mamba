// path: app/components/footer.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const YOUR_PAT = process.env.GITHUB_PAT;

type CommitData = {
    latestCommit: string;
    commitmessage: string;
};

const Footer = () => {
 const [Commit, setLatestCommit] = useState<CommitData>({ latestCommit: '', commitmessage: '' });

 useEffect(() => {
  const fetchLatestCommit = async () => {
   try {
    const response = await axios.get('/api/latest-commit', {
     headers: {
      Authorization: `Bearer ${YOUR_PAT}`,
     },
    });
    setLatestCommit(response.data);
   } catch (error) {
    throw new Error(`Error: ${error}`);
   }
  };

  fetchLatestCommit();
 }, []);

 return (
  <div className="footerm">
   {/* add my nanéu, my discord jobs bot to your server */}
   <div className='footer-right mt-2 mb-2'>
    <h1 className="text-white text-md font-bold">Meet Nanéu,</h1>
    <p className="text-white mb-1 text-sm">A discord jobs bot. Invite Nanéu to your server and add it to your jobs channel. You can configure it to your own job preferences.</p>
    <p className="text-yellow-500 text-sm">
     <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' type='button'>
      <a href="https://discord.com/oauth2/authorize?client_id=1217949022275506176" className='no-underline text-white' target="_blank" rel="noopener noreferrer">
                Invite Nanéu to your server
      </a>
     </button>
    </p>

   </div>
   <div className="footer-left">
    <p className="text-white mb-1 text-sm">Current Project, Latest Github Commit</p>
    <p className="text-yellow-500 text-sm">
     <a id='latestrepo' href="https://github.com/Intina47/nan-u" className="no-underline text-current">
      {Commit.latestCommit.slice(0, 12)}
     </a>
      :{' '}
     <span className="text-white font-light text-sm">{Commit.commitmessage.length > 10 ? `${Commit.commitmessage.slice(0, 70)}...` : Commit.commitmessage}</span>
    </p>
   </div>
  </div>
 );
};

export default Footer;
