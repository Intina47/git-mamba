import fs from 'fs/promises'
import path from 'path'
import MarkdownIt from 'markdown-it';

export default async function handler(res){
    try{
        const statsPath = path.resolve(process.cwd(), 'public/languageStats.md');
        const stats = await fs.readFile(statsPath, 'utf-8');

        const md = new MarkdownIt();
        const htmlContent = md.render(stats);
        console.log("========GOT STATS===========");
        console.log(htmlContent);
        console.log("========GOT STATS===========");
        
        if (res && typeof res.status === 'function') {
            res.status(200).json({htmlContent});
        } else {
            console.log('Error Getting stats:=========\n', 'Invalid response object');
            res.status(500).json({error: 'Invalid response object'});
        }
    }catch (error){
        console.log('Error Getting stats:=========\n', error);
        
        if (res && typeof res.status === 'function') {
            res.status(500).json({error: 'Error reading stats'});
        } else {
            console.log('Error Getting stats:=========\n', 'Invalid response object');
            res.status(500).json({error: 'Invalid response object'});
        }
    }
}