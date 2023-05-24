import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/categories";

export default async function handle(req, res, next) {
  const { method } = req;
  await mongooseConnect();

  if (method === "POST") {
    const { categoryName } = req.body;
    const response = await Category.create({ categoryName });
    res.json(response);
  }
  if (method === "GET") {
    res.json(await Category.find());
  }
}
