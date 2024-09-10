// Function for addition
function add(a, b) {
  return a + b;
}

// Function for subtraction
function subtract(a, b) {
  return a - b;
}

// Function for multiplication
function multiply(a, b) {
  return a * b;
}

// Function for division
function divide(a, b) {
  if (b === 0) {
    console.log('Division by zero is not allowed');
    throw new Error('Division by zero is not allowed');
  }
  return a / b;
}

// Export the functions
module.exports = {
  add,
  subtract,
  multiply,
  divide,
};
