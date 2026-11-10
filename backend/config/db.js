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

let isConnecting = false;
let retryTimer = null;

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri || uri === 'YOUR_MONGODB_CONNECTION_STRING') {
    console.warn('MongoDB Warning: MONGO_URI is not configured in .env (placeholder detected).');
    return;
  }

  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (isConnecting || mongoose.connection.readyState === 2) {
    return;
  }

  isConnecting = true;
  if (retryTimer) {
    clearTimeout(retryTimer);
    retryTimer = null;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000
    });
    console.log(`MongoDB Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${sanitizeError(error)}`);
    console.log('MongoDB will automatically retry connection in 5 seconds...');
    retryTimer = setTimeout(() => {
      connectDB();
    }, 5000);
  } finally {
    isConnecting = false;
  }
};

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected. Retrying connection in 5 seconds...');
  if (!retryTimer && !isConnecting && mongoose.connection.readyState === 0) {
    retryTimer = setTimeout(() => {
      connectDB();
    }, 5000);
  }
});

mongoose.connection.on('error', (err) => {
  console.error(`MongoDB connection event error: ${sanitizeError(err)}`);
});

module.exports = connectDB;
