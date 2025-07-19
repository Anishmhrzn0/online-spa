// server.js (Node backend)
import axios from 'axios';
import express from 'express';

const app = express();
const PORT = 5000;

app.get("/", (req, res) => {
  res.send(`Server is running on port ${PORT}`);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);

  // Axios request (triggered once server starts)
  axios.get('http://localhost:4000')
    .then(response => console.log("Response from 4000:", response.data))
    .catch(error => console.error("Error:", error.message));
});
