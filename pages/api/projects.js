import fs from 'fs/promises';
import path from 'path';
import MarkdownIt from 'markdown-it';

export default async function handler(req, res) {
 try {
  const pathtoproject = path.resolve(process.cwd(), 'public/projects.md');
  const projects = await fs.readFile(pathtoproject, 'utf-8');

  // use markdown html to reander the readme content to html
  const md = new MarkdownIt();
  const htmlContent = md.render(projects);

  res.status(200).json({ htmlContent });
 } catch (error) {
  console.error('Error reading file: ', error);
  res.status(500).json({ error: 'Error while reading the file' });
 }
}
