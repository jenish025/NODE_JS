const fs = require('fs');
const file = 'input.txt';

fs.readFile(file, 'utf8', (err, data) => {
  if (err) {
    return console.error(`Error reading file: ${err}`);
  }
  console.log('Before Update Text:', data);

  fs.writeFile(file, 'Hello, Node i have add new data!', (err) => {
    if (err) {
      return console.error(`Error appending file: ${err}`);
    }
    fs.readFile(file, 'utf8', (err, updatedData) => {
      if (err) {
        return console.error(`Error reading file: ${err}`);
      }
      console.log('After Update Text:', updatedData);
    });
  });
});
