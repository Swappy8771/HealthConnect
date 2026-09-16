// Shared schema validators.

// Deliberately permissive: enough to catch a typo, not an attempt to implement
// RFC 5322. Real confirmation that an address exists is a verification email,
// which this app does not yet send.
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const emailField = (label = 'Email') => ({
  type: String,
  required: [true, `${label} is required`],
  unique: true,
  lowercase: true,
  trim: true,
  match: [EMAIL_REGEX, 'Please provide a valid email address'],
});

// Minimum length for a *plaintext* password. Note this cannot live on the
// schema: the model only ever sees the bcrypt hash, which is always 60
// characters, so a schema-level minlength would always pass. Routes check this
// before assigning.
const MIN_PASSWORD_LENGTH = 8;

const validatePassword = (password) => {
  if (typeof password !== 'string' || password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
  }
  if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
    return 'Password must contain at least one letter and one number';
  }
  return null;
};

module.exports = { EMAIL_REGEX, emailField, MIN_PASSWORD_LENGTH, validatePassword };
