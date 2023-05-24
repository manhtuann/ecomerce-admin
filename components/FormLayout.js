import axios from "axios";
import { useRouter } from "next/router";
import React, { useState } from "react";

export default function FormLayout({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  images: existingImages,
}) {
  const [title, setTitle] = useState(existingTitle);
  const [description, setDescription] = useState(existingDescription);
  const [price, setPrice] = useState(existingPrice);
  const [images, setImages] = useState(existingImages);
  const [goToProduct, setGoToProduct] = useState(false);
  const router = useRouter();
  const addProduct = async (e) => {
    e.preventDefault();
    const data = { title, description, price };
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
      console.log("🚀 ~ file: FormLayout.js:39 ~ uploadImage ~ res:", res.data);
      setImages((pre) => {
        return [...prev, ...res.data.links];
      });
    }
  }
  return (
    <form className="m-4" onSubmit={addProduct}>
      <label>Name</label>
      <input
        type="text"
        placeholder="Name..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
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
