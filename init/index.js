const mongoose = require("mongoose");
const initData = require("./data.js");

const Listing = require("../models/listing.js");
// console.log(initData);
const MONGO_URl = "mongodb://127.0.0.1:27017/airbnnbb";

main().then(() =>{
    console.log("connect to db");
})
.catch(err =>{
    console.log(err);
})
async function main() {
  await mongoose.connect(MONGO_URl);
}

const initDB = async () => {
   await Listing.deleteMany({});
  initData.data= initData.data.map((obj)=>({...obj, owner:"6911d222ee2d0a9888e1b156"}));
  //  console.log(initData.data)

   await Listing.insertMany(initData.data);
   console.log("data was initialized");

};

initDB();