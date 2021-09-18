const fs = require('fs');
const path = require('path');

exports.dump = (obj) => JSON.stringify(obj, null, 2);

exports.icon = (name) =>
  fs.readFileSync(path.join(__dirname, `./public/images/icons/${name}.svg`));

exports.sitename = 'Smoothies for ninjas';
