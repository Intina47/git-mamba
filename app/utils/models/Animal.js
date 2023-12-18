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

export const animalModel = mongoose.models.Animal || mongoose.model('animals', animalSchema);
