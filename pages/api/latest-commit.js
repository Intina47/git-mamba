// pages/api/latest-commit.js
import axios from 'axios';

const YOUR_PAT = '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';
const OWNER = 'INtina47';
const REPO = 'git-mamba';

export default async function handler(req, res) {
 try {
  const response = await axios.get(`https://api.github.com/repos/${OWNER}/${REPO}/commits`, {
   headers: {
    Authorization: `Bearer ${YOUR_PAT}`,
   },
  });

  const latestCommit = response.data[0].sha;
  const commitmessage = response.data[0].commit.message;

  res.status(200).json({ latestCommit, commitmessage });
 } catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Internal Server Error' });
 }
}
