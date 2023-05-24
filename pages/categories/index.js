import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Categories() {
  const [categoryName, setCategoryName] = useState();
  const [dataTable, setDataTable] = useState([]);
  console.log("🚀 ~ file: index.js:7 ~ Categories ~ categoryName:", dataTable);

  const onSaveCategory = async (e) => {
    e.preventDefault();
    await axios.post("/api/categories", { categoryName });
  };
  useEffect(() => {
    axios.get("/api/categories").then((response) => {
      setDataTable(response);
    });
  }, []);
  return (
    <Layout>
      <h1>Categories</h1>
      <label>New Category name</label>
      <form onSubmit={onSaveCategory} className="m-4">
        <div className="flex">
          <input
            type="text"
            name="categoryName"
            placeholder="categories name"
            onChange={(e) => setCategoryName(e.target.value)}
            value={categoryName}
          />
          <select className="mx-2 rounded-lg cursor-pointer w-50 ">
            <option>no vlaue</option>
          </select>
          <button
            className="btn-primary py-1 bg-blue-900 text-white"
            type="submit"
          >
            Save
          </button>
        </div>
      </form>

      <table className="mt-2">
        <thead>
          <tr>
            <td>Categry Name</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {dataTable?.data?.map((item, index) => (
            <tr key={index}>
              <td>{item.categoryName}</td>
              <td></td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
}
