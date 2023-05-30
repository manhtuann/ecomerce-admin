import Layout from "@/components/Layout";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";

function Categories({ swal }) {
  const [categoryName, setCategoryName] = useState();
  const [dataTable, setDataTable] = useState([]);
  const [categoryOption, setCategoryOption] = useState();
  const [editCategory, setEditCategory] = useState(null);
  const [loading, setloading] = useState(false);
  const [properties, setProperties] = useState([]);

  const fetchCategory = () => {
    axios.get("/api/categories").then((response) => {
      setDataTable(response);
    });
  };
  const onSaveCategory = async (e) => {
    e.preventDefault();
    const data = {
      categoryName,
      categoryOption,
      properties: properties.map((p) => ({
        name: p.name,
        value: p.value.split(","),
      })),
    };
    if (!editCategory) {
      await axios.post("/api/categories", data);
    } else {
      await axios.put("/api/categories", {
        ...data,
        _id: editCategory._id,
      });
      setloading(true);
    }
    setloading(false);
    setCategoryName("");
    setCategoryOption("");
    fetchCategory();
    setProperties([]);
    setEditCategory(null);
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  const onDeleteCategory = async (item) => {
    swal
      .fire({
        title: "Are you sure?",
        text: `Do you want to delete ${item.categoryName}`,
        showCancelButton: true,
        cancelButtonText: "cancel",
        confirmButtonText: "oke",
        confirmButtonColor: "#d55",
      })
      .then((result) => {
        if (result.isConfirmed) {
          axios.delete("api/categories?id=" + item._id);
          fetchCategory();
        }
      });
  };

  const onEditCategory = async (item) => {
    setCategoryName(item.categoryName);
    setEditCategory(item);
    setCategoryOption(item.parent?._id);
    setProperties(
      item.properties.map(({ name, value }) => ({
        name,
        value: value.join(","),
      }))
    );
  };
  function onAddProperties() {
    setProperties((prev) => {
      return [...prev, { name: "", value: "" }];
    });
  }
  function onRemoveProperties(index) {
    const newData = properties.filter(
      (property) => properties.indexOf(property) !== index
    );
    setProperties(newData);
  }
  function onHandleNameProperty(index, property, newName) {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].name = newName;
      return properties;
    });
  }
  function onHandleValueProperty(index, property, newValue) {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].value = newValue;
      return properties;
    });
  }
  return (
    <Layout>
      <h1>Categories</h1>
      {!editCategory ? (
        <label>New Category name</label>
      ) : (
        <label>Edit Category name</label>
      )}
      <form onSubmit={onSaveCategory} className="mt-4 mb-4">
        <div className="flex gap-1">
          <input
            type="text"
            placeholder="categories name..."
            onChange={(e) => setCategoryName(e.target.value)}
            value={categoryName}
          />
          <select
            className="mx-2 rounded-lg cursor-pointer w-64 "
            value={categoryOption}
            onChange={(e) => setCategoryOption(e.target.value)}
          >
            <option>No parent category</option>
            {dataTable?.data?.length > 0 &&
              dataTable?.data?.map((category) => (
                <option
                  value={category._id}
                  key={category._id}
                  className="text-black"
                >
                  {category.categoryName}
                </option>
              ))}
          </select>
        </div>
        <div className="mb-2 ">
          <label className="block">Properties</label>
          <button
            onClick={onAddProperties}
            type="button"
            className="btn-default text-sm"
          >
            Add new properties
          </button>
          {properties.length > 0 &&
            properties.map((property, index) => (
              <div key={index} className="flex gap-1 mt-2">
                <input
                  type="text"
                  placeholder="properties name (example: color)"
                  value={property.name}
                  onChange={(e) =>
                    onHandleNameProperty(index, property, e.target.value)
                  }
                />
                <input
                  type="text"
                  placeholder="value (example: red,green)"
                  value={property.value}
                  onChange={(e) =>
                    onHandleValueProperty(index, property, e.target.value)
                  }
                />
                <button
                  type="button"
                  className="btn-default "
                  onClick={() => onRemoveProperties(index)}
                >
                  Remove
                </button>
              </div>
            ))}
        </div>
        {editCategory && (
          <button
            className="btn-default py-1"
            type="button"
            onClick={() => {
              setEditCategory(null);
              setCategoryName("");
              setCategoryOption("");
            }}
          >
            Cancel
          </button>
        )}
        <button
          className="btn-primary py-1 bg-blue-900 text-white"
          type="submit"
        >
          Save
        </button>
      </form>

      {!editCategory && (
        <table className="mt-2">
          <thead>
            <tr>
              <td>Categry Name</td>
              <td>Parent Name</td>
              <td>Property</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {dataTable?.data?.map((item, index) => (
              <tr key={index}>
                <td>{item.categoryName}</td>
                <td>{item?.parent?.categoryName}</td>
                <td></td>
                <td className="flex">
                  <button
                    onClick={() => onEditCategory(item)}
                    className="flex text-white"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDeleteCategory(item)}
                    className="text-white"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
}
export default withSwal(({ swal }, ref) => <Categories swal={swal} />);
