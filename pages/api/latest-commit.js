// pages/api/latest-commit.js
import axios from 'axios';

const YOUR_PAT = process.env.GITHUB_PAT;
const OWNER = process.env.OWNER;
const REPO = process.env.REPO;

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
