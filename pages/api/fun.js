// path: pages/api/fun.js
import puppeteer from 'puppeteer';
import pQueue from 'p-queue';
// import path from 'path';
import {connectToDatabase, disconnectFromDatabase} from 'app/utils/db.js';
import { animalModel } from 'app/utils/models/Animal.js';
// Create a queue with a concurrency limit of 1
const queue = new pQueue({ concurrency: 1 });

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
// scraper function
async function scrapePinterest(randomAnimal) {
 const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
  executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
 });
 const page = await browser.newPage();
 const url = `https://www.pinterest.co.uk/search/pins/?q=${randomAnimal}`;
 await page.goto(url);
 // Wait for the images to load (you can adjust the selector and wait time as needed)
 await page.waitForSelector('img', { visible: true });
 const imageSrcs = await page.$$eval('img', async (imgs) => {
  const imageSrcs = [];
  for (const img of imgs.slice(0, 100)) {
   const src = img.getAttribute('src');
   if (src !== null) {
    imageSrcs.push(src);
   }
  }
  return imageSrcs;
 });
 await browser.close();
 return imageSrcs;
}
async function updateDatabase(randomAnimal, imageSrcs) {
 const animal = {
  name: randomAnimal,
  links: imageSrcs,
 };

 try {
 // const collection = await animalModel.collection('animals');
  const collection = await animalModel;
  const duplicate = await collection.findOne({ name: randomAnimal });

  if (duplicate) {
   console.log('Duplicate found');
   const duplicateLinks = duplicate.links;
   const newLinks = imageSrcs.filter((link) => !duplicateLinks.includes(link));

   if (newLinks.length > 0) {
    console.log('New links found');
    const updatedLinks = [...duplicateLinks, ...newLinks];
    const updatedAnimal = {
     name: randomAnimal,
     links: updatedLinks,
    };
    // const filter = { name: randomAnimal };
    // const update = { $set: updatedAnimal };
    // const result = await collection.updateOne(filter, update);
    const result = await collection.updateOne({ name: randomAnimal }, { $set: updatedAnimal });

    if (result.modifiedCount > 0) {
     console.log('Animal updated in db');
    } else {
     console.log('Animal not updated in db');
    }
   } else {
    console.log('No new links found');
   }
  } else {
   await collection.create(animal);
   console.log('Animal added to db');
  }
 } catch (err) {
  console.log(err);
 }
}

export default async function handler(req, res) {

 //  const randomIndex = Math.floor(Math.random() * Animals.length);
 //  const randomAnimal = Animals[randomIndex];
 //  const customUserDataDir = path.join(__dirname, '../userDataDir');
 try {
  await connectToDatabase();
  for(const animal of Animals){
   const imageSrcs = await queue.add(async () => {
    return await scrapePinterest(animal);
   });
   console.log('Image Srcs:', imageSrcs);
   await updateDatabase(animal, imageSrcs);
  }
  await disconnectFromDatabase();
  res.status(200).send();
 } catch (error) {
  console.error('Error scraping images:', error);
  res.status(500).json({ error: 'Error while scraping images' });
 }
}