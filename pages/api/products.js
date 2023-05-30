import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/products";
import React from "react";
import reactDom from "react-dom";
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function handle(req, res, next) {
  const { method } = req;
  await mongooseConnect();
  await isAdminRequest(req, res);
  if (method === "GET") {
    if (req.query.id) {
      res.json(await Product.findOne({ _id: req.query.id }));
    } else {
      res.json(await Product.find());
    }
  }
  if (method === "POST") {
    const { title, description, price, category } = req.body;
    const productDocument = await Product.create({
      title,
      description,
      price,
      category,
    });
    res.json(productDocument);
  }
  if (method === "PUT") {
    const { title, description, price, _id, category } = req.body;
    await Product.updateOne({ _id }, { title, description, price, category });
    res.json(true);
  }
  if (method === "DELETE") {
    if (req.query?.id) {
      await Product.deleteOne({ _id: req.query?.id });
      res.json(true);
    }
  }
}
