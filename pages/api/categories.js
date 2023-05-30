import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/categories";
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function handle(req, res, next) {
  const { method } = req;
  await mongooseConnect();
  await isAdminRequest(req, res);s

  if (method === "POST") {
    const { categoryName, categoryOption, properties } = req.body;
    const response = await Category.create({
      categoryName,
      parent: categoryOption,
      properties: properties,
    });
    res.json(response);
  }
  if (method === "GET") {
    if (req.query.id) {
      res.json(await Category.findOne({ _id: req.query.id }));
    } else {
      res.json(await Category.find().populate("parent"));
    }
  }

  if (method === "PUT") {
    const { categoryName, categoryOption, _id, properties } = req.body;
    const categoryDoc = await Category.updateOne(
      { _id },
      { categoryName, parent: categoryOption, properties }
    );
    res.json(categoryDoc);
  }
  if (method === "DELETE") {
    await Category.deleteOne({ _id: req.query.id });
    res.json(true);
  }
}
