// Path: pages/api/%5Bname%5D.js
import fs from 'fs/promises';
import path from 'path';
import MarkdownIt from 'markdown-it';
const md = new MarkdownIt();
export default async function handler(req, res) {
 try{
  const { name } = req.query;
  const filePath = path.resolve(process.cwd(), `public/${name}`);
  const fileContents = await fs.readFile(filePath, 'utf-8');
  const htmlContent = md.render(fileContents);
  res.status(200).json({htmlContent});
 }
 catch(error){
  console.error('Error reading file: ', error);
  res.status(500).json({error: 'Error while reading the file'});
 }
}