// connect to mongodb
import mongoose from 'mongoose';

let isConnected = false;
const connectToDatabase = async () => {
 if (isConnected) {
  console.log('=> using existing database connection');
  return Promise.resolve();
 }

 try{
  const mongoURI = process.env.MONGODB_URI;
  const mongooseOptions = {
   useNewUrlParser: true,
   useUnifiedTopology: true,
  };
  await mongoose.connect(mongoURI, mongooseOptions);
  isConnected = mongoose.connection.readyState;
  console.log('=> using new database connection');
  return Promise.resolve();
 } catch (err) {
  console.log(err);
  return Promise.reject();
 }
};

const disconnectFromDatabase = async () => {
 if (!isConnected) {
  console.log('=> no connection to close');
  return Promise.resolve();
 }
 try {
  await mongoose.disconnect();
  isConnected = false;
  console.log('=> connection closed');
  return Promise.resolve();
 } catch (err) {
  console.log(err);
  return Promise.reject();
 }
};

export { connectToDatabase, disconnectFromDatabase };