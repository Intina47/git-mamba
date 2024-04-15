import {connectToDatabase, disconnectFromDatabase} from 'app/utils/db.js';
import { quoteModel } from 'app/utils/models/Quote.js';

export default async function handler(req, res) {
 try {
  await connectToDatabase();
  const { method } = req;
  if(method === 'POST'){
   const newQuote = new quoteModel(req.body);
   await newQuote.save();
   await disconnectFromDatabase();
   res.status(201).json(newQuote);
  } else {
   res.setHeader('Allow', ['POST']);
   res.status(405).json({error: `Method ${method} Not Allowed`});
  }
 } catch (error) {
  console.error('Error occured saving quote:', error);
  res.status(500).json({error: 'Error saving quote'});
 }
}