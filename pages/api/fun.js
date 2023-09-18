import puppeteer from 'puppeteer';

export default async function handler(req, res) {
 const Animals = [
  'cats', 'funny cats', 'dogs', 'playful dogs', 'cute rabbits', 'parrots',
  'silly parrots', 'adorable hamsters', 'funny fish', 'happy turtles',
  'guinea pigs', 'horses', 'singing birds', 'laughing elephants', 'silly tigers',
  'dancing lions', 'giraffes', 'pandas', 'laughing koalas', 'playful otters',
  'happy dolphins', 'whales', 'penguins', 'playful owls', 'silly foxes',
  'sleeping bears', 'squirrels', 'colorful frogs', 'funny snakes',
  'butterflies', 'bees', 'happy hedgehogs', 'seals', 'octopuses', 'sharks',
  'zebras', 'cheetahs', 'polar bears', 'meerkats', 'chameleons', 'kangaroos',
  'gorillas', 'rhinoceroses', 'peacocks', 'singing cockatoos', 'colorful macaws',
  'chickens', 'ducks', 'geese', 'turkeys', 'oink oink pigs', 'mooing cows',
  'baa baa goats', 'fluffy sheep', 'spiky hedgehogs', 'curious ferrets',
  'guinea fowls', 'giggling monkeys'
 ];
 const randomIndex = Math.floor(Math.random() * Animals.length);
 const randomAnimal = Animals[randomIndex];
 try {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const url = `https://www.pinterest.co.uk/search/pins/?q=${randomAnimal}`;
  await page.goto(url);

  // Wait for the images to load (you can adjust the selector and wait time as needed)
  await page.waitForSelector('img', { visible: true });

  const images = await page.evaluate(() => {
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

  console.log('Image Srcs:', images);
  res.status(200).json({ images });
 } catch (error) {
  console.error('Error scraping images:', error);
  res.status(500).json({ error: 'Error while scraping images' });
 }
}
