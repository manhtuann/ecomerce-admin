import { models } from "mongoose";

const { Schema, model } = require("mongoose");

const CategorySchema = new Schema({
  categoryName: { type: String, required: true },
});
export const Category = models?.Category || model("Category", CategorySchema);
