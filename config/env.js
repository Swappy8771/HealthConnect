// Central environment loader.
//
// Loads .env once and refuses to start if anything required is missing, so the
// app can never fall back to an insecure default. Require this instead of
// reading process.env directly.

const dotenv = require('dotenv');

dotenv.config();

const REQUIRED = ['MONGO_URI', 'JWT_SECRET'];

const missing = REQUIRED.filter((key) => !process.env[key] || !process.env[key].trim());

if (missing.length) {
  console.error(`❌ Missing required environment variable(s): ${missing.join(', ')}`);
  console.error('   Set them in backend/.env — see .env.example — then start again.');
  process.exit(1);
}

module.exports = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
};
