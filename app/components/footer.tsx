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
   <div className="footer-left">
    <p className="text-white">Current Project, Github Latest Commit</p>
    <p className="text-yellow-500 text-sm">
     <a id='latestrepo' href="https://github.com/Intina47/git-mamba" className="no-underline text-current">
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