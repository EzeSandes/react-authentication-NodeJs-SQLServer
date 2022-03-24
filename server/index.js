require('dotenv').config({ path: './config.env' });
const app = require('./app');

// 3001 is the server in the proxy of the react-app
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(process.env.DB_USER);
  console.log(process.env.DB_SERVER);
  console.log(process.env.DB_PASSWORD);
  console.log(`App running on port ${PORT}`);
});
