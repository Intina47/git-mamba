//api route to contactme.md
import fs from 'fs/promises';
import path from 'path';
import MarkdownIt from 'markdown-it';
const md = new MarkdownIt();
export default async (req, res) => {
 try{
  let data= await fs.readFile(path.join(__dirname,'../contactme.md'),'utf8');
  let htmlContent = md.render(data);
  res.status(200).json({htmlContent});
 }catch(error){
  console.error('Error reading contactme.md: ', error);
  res.status(500).json({error: 'Error while reading the contactme.md file'});
 }
};