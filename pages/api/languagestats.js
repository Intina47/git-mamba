import fs from 'fs/promises';
import path from 'path';
import MarkdownIt from 'markdown-it';

export default async function handler(req,res) {
 try{
  const readmePath = path.resolve(process.cwd(), 'public/languageStats.md');
  const readme = await fs.readFile(readmePath, 'utf-8');

  // use markdown html to reander the readme content to html
  const md = new MarkdownIt();
  const htmlContent = md.render(readme);

  res.status(200).json({htmlContent});
 } catch (error) {
  console.error('Error reading README.md: ', error);
  res.status(500).json({error: 'Error while reading the README.md file'});
 }
}