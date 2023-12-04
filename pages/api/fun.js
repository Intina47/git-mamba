// import puppeteer from 'puppeteer-core';
import pQueue from 'p-queue';
// import chromium from 'chrome-aws-lambda';
import puppeteer from 'chrome-aws-lambda';
// import puppeteerDev from 'puppeteer';

// Path to the Chrome executable
// const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

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

 try {
  const imageSrcs = await queue.add(async () => {
   const browser = process.env.NODE_ENV === 'production'
    ? await puppeteer.launch({
     args: [...puppeteer.args, '--no-sandbox'],
     executablePath: await puppeteer.executablePath,
     headless: puppeteer.headless,
     ignoreHTTPSErrors: true,
     ignoreDefaultArgs: ['--disable-extensions'],
    })
    : await puppeteer.launch({
     headless: true,
     args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
   const page = await browser.newPage();
   const url = `https://www.pinterest.co.uk/search/pins/?q=${randomAnimal}`;
   await page.goto(url);

   // Wait for the images to load (you can adjust the selector and wait time as needed)
   await page.waitForSelector('img', { visible: true });

   const imageSrcs = await page.$$eval('img', (imgs) => {
    const srcs = [];
    for (const img of imgs.slice(0, 10)) {
     const src = img.getAttribute('src');
     if (src !== null) {
      srcs.push(src);
     }
    }
    return srcs;
   });

   await browser.close();
   return imageSrcs;
  });

  console.log('Image Srcs:', imageSrcs);
  res.status(200).json({ images: imageSrcs });
 } catch (error) {
  console.error('Error scraping images:', error);
  res.status(500).json({ error: 'Error while scraping images' });
 }
}

// import puppeteer from 'puppeteer-core';
// import pQueue from 'p-queue';
// import path from 'path';
// import * as tf from '@tensorflow/tfjs-node';
// import * as mobilenet from '@tensorflow-models/mobilenet';

// // Create a queue with a concurrency limit of 1
// const queue = new pQueue({ concurrency: 1 });

// export default async function handler(req, res) {
//   const Animals = [
//     'cats', 'funny cats', 'dogs', 'playful dogs', 'cute rabbits', 'parrots',
//     'silly parrots', 'adorable hamsters', 'funny fish', 'happy turtles',
//     'guinea pigs', 'horses', 'singing birds', 'laughing elephants', 'silly tigers',
//     'dancing lions', 'giraffes', 'pandas', 'laughing koalas', 'playful otters',
//     'happy dolphins', 'whales', 'penguins', 'playful owls', 'silly foxes',
//     'sleeping bears', 'squirrels', 'colorful frogs', 'funny snakes',
//     'butterflies', 'bees', 'happy hedgehogs', 'seals', 'sharks',
//     'zebras', 'cheetahs', 'polar bears', 'meerkats', 'chameleons', 'kangaroos',
//     'gorillas', 'rhinoceroses', 'peacocks', 'singing cockatoos', 'colorful macaws',
//     'chickens', 'ducks', 'geese', 'turkeys', 'oink oink pigs', 'mooing cows',
//     'baa baa goats', 'fluffy sheep', 'spiky hedgehogs', 'curious ferrets',
//     'guinea fowls', 'giggling monkeys', 'cat looking into camera',
//   ];
//   const randomIndex = Math.floor(Math.random() * Animals.length);
//   const randomAnimal = Animals[randomIndex];
//   const customUserDataDir = path.join(__dirname, '../userDataDir');

//   try {
//     const imageSrcs = await queue.add(async () => {
//       const browser = await puppeteer.launch({
//         userDataDir: customUserDataDir,
//         headless: process.env.NODE_ENV === 'production',
//         args: ['--no-sandbox', '--disable-setuid-sandbox'],
//         executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
//       });
//       const page = await browser.newPage();
//       const url = `https://www.pinterest.co.uk/search/pins/?q=${randomAnimal}`;
//       await page.goto(url);

//       // Wait for the images to load (you can adjust the selector and wait time as needed)
//       await page.waitForSelector('img', { visible: true });

//       const imageSrcs = await page.$$eval('img', async (imgs) => {
//         const model = await mobilenet.load();
//         const imageSrcs = [];

//         for (const img of imgs.slice(0, 10)) {
//           const src = img.getAttribute('src');
//           if (src !== null) {
//             const image = await tf.node.decodeImage(await fetch(src));
//             const predictions = await model.classify(image);
//             const isAnimal = predictions.some((prediction) => {
//               return prediction.className.includes('animal');
//             });
//             if (isAnimal) {
//               imageSrcs.push(src);
//             }
//           }
//         }

//         return imageSrcs;
//       });

//       await browser.close();
//       return imageSrcs;
//     });

//     console.log('Image Srcs:', imageSrcs);
//     res.status(200).json({ imageSrcs });
//   } catch (error) {
//     console.error('Error scraping images:', error);
//     res.status(500).json({ error: 'Error while scraping images' });
//   }
// }

// import puppeteer from 'puppeteer';
// import pQueue from 'p-queue';
// import path from 'path';
// import fs from 'fs';

// // Create a queue with a concurrency limit of 1
// const queue = new pQueue({ concurrency: 1 });

// export default async function handler(req, res) {
//  const Animals = [
//   'cats', 'funny cats', 'dogs', 'playful dogs', 'cute rabbits', 'parrots',
//   'silly parrots', 'adorable hamsters', 'funny fish', 'happy turtles',
//   'guinea pigs', 'horses', 'singing birds', 'laughing elephants', 'silly tigers',
//   'dancing lions', 'giraffes', 'pandas', 'laughing koalas', 'playful otters',
//   'happy dolphins', 'whales', 'penguins', 'playful owls', 'silly foxes',
//   'sleeping bears', 'squirrels', 'colorful frogs', 'funny snakes',
//   'butterflies', 'bees', 'happy hedgehogs', 'seals', 'sharks',
//   'zebras', 'cheetahs', 'polar bears', 'meerkats', 'chameleons', 'kangaroos',
//   'gorillas', 'rhinoceroses', 'peacocks', 'singing cockatoos', 'colorful macaws',
//   'chickens', 'ducks', 'geese', 'turkeys', 'oink oink pigs', 'mooing cows',
//   'baa baa goats', 'fluffy sheep', 'spiky hedgehogs', 'curious ferrets',
//   'guinea fowls', 'giggling monkeys', 'cat looking into camera',
//  ];
//  const randomIndex = Math.floor(Math.random() * Animals.length);
//  const randomAnimal = Animals[randomIndex];
//  const customUserDataDir = path.join(__dirname, '../userDataDir');
//  try {
//   const result = await queue.add(async () => {
//    const browser = await puppeteer.launch({
//     userDataDir: customUserDataDir,
//     headless: 'new'
//    });
//    const executablePath = puppeteer.executablePath();
//    console.log('Chromium executable path:', executablePath);
//    const page = await browser.newPage();
//    const url = `https://www.pinterest.co.uk/search/pins/?q=${randomAnimal}`;
//    await page.goto(url);

//    // Wait for the images to load (you can adjust the selector and wait time as needed)
//    await page.waitForSelector('img', { visible: true });

//    const imageSrcs = await page.evaluate(() => {
//     const imgElements = document.querySelectorAll('img');
//     const imageSrcs = [];
//     let imageCount = 0;
//     imgElements.forEach((img) => {
//      if (imageCount < 10) {
//       const src = img.getAttribute('src');
//       if (src) {
//        imageSrcs.push(src);
//        imageCount++;
//       }
//      }
//     });
//     return imageSrcs;
//    });

//    await browser.close();
//    const jsonData = JSON.stringify(imageSrcs, null, 2);
//    const filePath = path.join(process.cwd(), 'public', 'data.json');
//    fs.writeFile(`${filePath}`, `${jsonData}`, function writeJSON(err){
//     if (err){
//      return console.log(err);
//     } else {
//      console.log('JSON file has been saved');
//     }
//    });
//    return imageSrcs;
//   });

//   console.log('Image Srcs:', result);
//   res.status(200).send();
//  } catch (error) {
//   console.error('Error scraping images:', error);
//   res.status(500).json({ error: 'Error while scraping images' });
//  }
// }
