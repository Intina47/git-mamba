//path: pages/api/randomAnimal.js
import {connectToDatabase, disconnectFromDatabase} from 'app/utils/db.js';
import { animalModel } from 'app/utils/models/Animal.js';

export default async function handler(req, res) {
 try {
  await connectToDatabase();
  // get a random animal from the database
  const randomAnimal = await animalModel.aggregate([{ $sample: { size: 1 } }]);
  console.log(randomAnimal);

  if(randomAnimal.length === 0){
   res.status(404).json({error: 'No animals found'});
   return;
  }

  const images = randomAnimal[0].links;
  if(images.length > 10){
   for(let i = images.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * i);
    const temp = images[i];
    images[i] = images[j];
    images[j] = temp;
   }
   images.length = 10;
  }

  await disconnectFromDatabase();
  res.status(200).json({images});
 } catch (error) {
  console.error('Error occured getting animal:', error);
  res.status(500).json({error: 'Error fetching animal images'});
 }
}