const fs = require('fs');
const idl = require('./target/idl/anchorapp.json');

fs.writeFileSync('./app/src/idl.json', JSON.stringify(idl));