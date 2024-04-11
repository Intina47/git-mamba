//path: app/utils/models/Animal.js
import mongoose from 'mongoose';

const animalSchema = new mongoose.Schema({
 name: {
  type: String,
  required: true,
  unique: true
 },
 links: {
  type: [String],
  required: true,
  default: [],
 },
});

const quoteSchema = new mongoose.Schema<Quote>({
 quote: {
  type: String,
  required: true,
 },
 source: {
  type: String,
 },
 sourceUrl: {
  type: String,
 },
});

export const QuoteModel = mongoose.models.Quote || mongoose.model('quotes', quoteSchema);
export const animalModel = mongoose.models.Animal || mongoose.model('animals', animalSchema);
