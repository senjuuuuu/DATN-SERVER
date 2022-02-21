const mongoose = require('mongoose');

module.exports = async function connectDb() {
  try {
    const connectionParams = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    await mongoose.connect(process.env.DB_URL, connectionParams);
    console.log('Connected to DATABASE. Server is running!!!');
  } catch (error) {
    console.log(error);
    console.log('Could not connect to DATABASE');
  }
};
