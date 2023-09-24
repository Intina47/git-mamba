// pages/api/data.js

import fs from 'fs/promises';
import path from 'path';

export default async (req, res) => {
 try {
  // Read the JSON data from public/data.json
  const filePath = path.join(process.cwd(), 'public', 'data.json');
  const jsonData = await fs.readFile(filePath, 'utf-8');

  // Parse the JSON data and send it as the API response
  const data = JSON.parse(jsonData);
  res.status(200).json(data);
 } catch (error) {
  console.error('Error reading JSON data:', error);
  res.status(500).json({ error: 'Error reading JSON data' });
 }
};
