import cors from 'cors'
import express from 'express'
import router from './routes/router';

const app = express()
const port = 3000

app.use(cors({ origin: 'http://localhost:3000' }))

// This middleware adds the json header to every response
app.use("*", (req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  next();
});


// Assign Routes
app.use("/", router);

app.listen(port, () => console.log(`Listening on http://localhost:${port}`))