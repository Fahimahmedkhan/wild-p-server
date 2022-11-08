const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const app = express();

// middle wares
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Wild-p server is running')
})

app.listen(port, () => {
    console.log(`Wild-p server running on ${port}`);
})