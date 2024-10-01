const bcrypt = require('bcrypt');

const passwordHashing = async (saltNum = 10, password) => {
  const salt = await bcrypt.genSalt(saltNum);
  if (!password) return;
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

const passwordCompare = async (password, hashedPassword) => {
  const isValid = await bcrypt.compare(password, hashedPassword);
  return isValid;
};

module.exports = { passwordHashing, passwordCompare };
