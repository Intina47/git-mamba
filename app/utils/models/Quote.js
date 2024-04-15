import mongoose from 'mongoose';

const quoteSchema = new mongoose.Schema({
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
 isApproved: {
  type: Boolean,
  default: false,
 },
});

const quoteModel = mongoose.models.quotes || mongoose.model('quotes', quoteSchema);

export { quoteModel };