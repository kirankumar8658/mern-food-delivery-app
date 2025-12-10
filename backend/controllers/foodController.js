import foodModel from "../models/foodModel.js";
import fs from "fs/promises";
import path from "path";

//add food item
export const addfood = async (req, res) => {
  const image_filename = req.file.filename;

  const food = new foodModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    image: image_filename,
  });
  try {
    await food.save();
    res.json({ success: true, message: "Food Added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

//List food
export const listfood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

//remove food item

export const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);

    if (!food) {
      return res.json({ success: false, message: "Food not found" });
    }
    const imagePath = path.join(process.cwd(), "uploads", food.image);
    try {
      await fs.unlink(imagePath);
    } catch (fileError) {
      console.log(
        "Error deleting file (allowing database delete to proceed):",
        fileError.message
      );
    }

    // Delete database record
    await foodModel.findByIdAndDelete(req.body.id);

    res.json({ success: true, message: "Food Removed" });
  } catch (error) {
    // This catch block handles database or other errors
    console.log("Error deleting food or database record:", error);
    res.json({ success: false, message: "Error" });
  }
};
