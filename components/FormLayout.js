import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export default function FormLayout({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  images: existingImages,
  category: existingCategory,
}) {
  const [title, setTitle] = useState(existingTitle);
  const [description, setDescription] = useState(existingDescription || "");
  const [price, setPrice] = useState(existingPrice || "");
  const [images, setImages] = useState(existingImages);
  const [categories, setCategories] = useState([]);
  console.log("🚀 ~ file: FormLayout.js:18 ~ categories:", categories);
  const [category, setCategory] = useState(existingCategory || "");

  const [goToProduct, setGoToProduct] = useState(false);
  const router = useRouter();
  const addProduct = async (e) => {
    e.preventDefault();
    const data = { title, description, price, category };
    if (_id) {
      await axios.put("/api/products", { ...data, _id });
    } else {
      await axios.post("/api/products", data);
    }
    setGoToProduct(true);
  };
  if (goToProduct) {
    router.push("/products");
  }
  async function uploadImage(e) {
    console.log(e?.target?.files);
    const files = e.target?.files;
    if (files.length > 0) {
      const data = new FormData();
      for (const file of files) {
        data.append("file", file);
      }
      const res = await axios.post("/api/upLoadFile", data);
      setImages((pre) => {
        return [...pre, ...res.data.links];
      });
    }
  }
  useEffect(() => {
    axios.get("/api/categories").then((response) => {
      setCategories(response.data);
    });
  }, []);

  const propertiesFill = [];

  if (categories?.length > 0 && category) {
    let newData = categories.find((c) => c._id === category);
    console.log("🚀 ~ file: FormLayout.js:60 ~ newData:", newData);
    propertiesFill.push(...newData.properties);
    console.log(newData.parent._id, "abc");
    // while (newData?.parent?._id) {
    // const parentCat = categories.find((c) => c._id === newData.parent._id);
    // propertiesFill.push(...parentCat.properties);
    // newData = parentCat;
    // }
  }
  console.log("🚀 ~ file: FormLayout.js:57 ~ propertiesFill:", propertiesFill);

  return (
    <form className="m-4" onSubmit={addProduct}>
      <label>Name</label>
      <input
        type="text"
        placeholder="Name..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <div className="flex flex-col gap-1">
        <label>Category</label>
        <select
          className="mb-0 rounded-lg h-7 cursor-pointer"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>unOption</option>
          {categories?.map((category) => (
            <option key={category._id} value={category._id}>
              {category?.categoryName}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col">
        {propertiesFill.length > 0 &&
          propertiesFill.map((item) => {
            return (
              <div key={item.name} className="flex flex-col">
                <label className="font-medium">{item.name} :</label>
                <input type="text" value={item.value} />
              </div>
            );
          })}
      </div>
      <label>Photos</label>
      <div className="mb-2">
        {!!images?.length && images.map((link) => <div key={link}>{link}</div>)}
        <label className="w-24 h-24 cursor-pointer flex items-center justify-center round flex-col text-gray-500 bg-gray-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15"
            />
          </svg>
          <div>Upload</div>
          <input type="file" onChange={uploadImage} className="hidden" />
        </label>
        {!images?.length && <div>no photos is the product</div>}
      </div>
      <label>price</label>
      <input
        type="number"
        placeholder="price..."
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <label>Description</label>
      <textarea
        type="text"
        placeholder="Description..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>
      <button className="bg-blue-900 text-white" type="submit">
        Add
      </button>
    </form>
  );
}
