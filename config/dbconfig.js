const mongoose = require("mongoose");

mongoose
  .connect(
    process.env.DB_URL,

    {
      useNewUrlParser: true,useUnifiedTopology:true
    }
  )
  .then(() => {
    console.log("Data base is connected successfully");
  })
  .catch((err) => {
    console.log(err);
  });
