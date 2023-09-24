import puppeteer from 'puppeteer';
import pQueue from 'p-queue';
import path from 'path';
import fs from 'fs';

// Create a queue with a concurrency limit of 1
const queue = new pQueue({ concurrency: 1 });

export default async function handler(req, res) {
 const Animals = [
  'cats', 'funny cats', 'dogs', 'playful dogs', 'cute rabbits', 'parrots',
  'silly parrots', 'adorable hamsters', 'funny fish', 'happy turtles',
  'guinea pigs', 'horses', 'singing birds', 'laughing elephants', 'silly tigers',
  'dancing lions', 'giraffes', 'pandas', 'laughing koalas', 'playful otters',
  'happy dolphins', 'whales', 'penguins', 'playful owls', 'silly foxes',
  'sleeping bears', 'squirrels', 'colorful frogs', 'funny snakes',
  'butterflies', 'bees', 'happy hedgehogs', 'seals', 'sharks',
  'zebras', 'cheetahs', 'polar bears', 'meerkats', 'chameleons', 'kangaroos',
  'gorillas', 'rhinoceroses', 'peacocks', 'singing cockatoos', 'colorful macaws',
  'chickens', 'ducks', 'geese', 'turkeys', 'oink oink pigs', 'mooing cows',
  'baa baa goats', 'fluffy sheep', 'spiky hedgehogs', 'curious ferrets',
  'guinea fowls', 'giggling monkeys', 'cat looking into camera',
 ];
 const randomIndex = Math.floor(Math.random() * Animals.length);
 const randomAnimal = Animals[randomIndex];
 const customUserDataDir = path.join(__dirname, '../userDataDir');
 try {
  const result = await queue.add(async () => {
   const browser = await puppeteer.launch({
    userDataDir: customUserDataDir,
    headless: 'new'
   });
   const executablePath = puppeteer.executablePath();
   console.log('Chromium executable path:', executablePath);
   const page = await browser.newPage();
   const url = `https://www.pinterest.co.uk/search/pins/?q=${randomAnimal}`;
   await page.goto(url);

   // Wait for the images to load (you can adjust the selector and wait time as needed)
   await page.waitForSelector('img', { visible: true });

   const imageSrcs = await page.evaluate(() => {
    const imgElements = document.querySelectorAll('img');
    const imageSrcs = [];
    let imageCount = 0;
    imgElements.forEach((img) => {
     if (imageCount < 10) {
      const src = img.getAttribute('src');
      if (src) {
       imageSrcs.push(src);
       imageCount++;
      }
     }
    });
    return imageSrcs;
   });

   await browser.close();
   const jsonData = JSON.stringify(imageSrcs, null, 2);
   const filePath = path.join(process.cwd(), 'public', 'data.json');
   fs.writeFile(`${filePath}`, `${jsonData}`, function writeJSON(err){
    if (err){
     return console.log(err);
    } else {
     console.log('JSON file has been saved');
    }
   });
   return imageSrcs;
  });

  console.log('Image Srcs:', result);
  res.status(200).send();
 } catch (error) {
  console.error('Error scraping images:', error);
  res.status(500).json({ error: 'Error while scraping images' });
 }
}
