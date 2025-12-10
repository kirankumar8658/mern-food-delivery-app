// getting-started.js
import mongoose from "mongoose";

export async function connectDB() {
  await mongoose
    .connect(
      "mongodb+srv://kiransingh8658_db_user:pass%258658@cluster0.xy9gr59.mongodb.net"
    )
    .then(() => {
      console.log("DB Connected");
    })
    .catch((err) => console.log(err));
}
