const express = require('express');

const app = express();

require('./init/config')(app);
require('./init/routes')(app);
require('./init/db')();
require('./init/logging')();

