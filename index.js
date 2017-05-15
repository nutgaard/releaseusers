const compression = require('compression');
const express = require('express');

const PORT = 8000;

const app = express();
app.use(compression());
app.use(express.static('public'));

app.listen(PORT, () => {
    console.log(`Server started on ${PORT}`);
});