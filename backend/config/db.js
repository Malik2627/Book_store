const mongoose = require('mongoose');
const dns = require('dns');

// Configure reliable DNS servers on Windows to resolve MongoDB Atlas SRV records
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Fallback to system default if setting custom servers is restricted
}

const sanitizeError = (err) => {
  if (!err) return '';
  const msg = typeof err === 'string' ? err : err.message || '';
  return msg.replace(/:([^:@\s]+)@/g, ':****@');
};

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri || uri === 'YOUR_MONGODB_CONNECTION_STRING') {
    console.warn('MongoDB Warning: MONGO_URI is not configured in .env (placeholder detected).');
    return;
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${sanitizeError(error)}`);
  }
};

module.exports = connectDB;
