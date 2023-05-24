import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function DeleteProduct() {
  const router = useRouter();
  const [dataProduct, setDataProduct] = useState();
  const { id } = router.query;
  useEffect(() => {
    if (!id) {
      return;
    } else {
      axios
        .get("/api/products?id=" + id)
        .then((response) => setDataProduct(response.data));
    }
  }, [id]);
  const deleteProduct = async () => {
    await axios.delete("/api/products?id=" + id);
    goBack();
  };
  function goBack() {
    router.push("/products");
  }
  return (
    <Layout>
      <div className="text-center">
        <h1>
          Do you want delete product <b>{dataProduct?.title} </b>?{" "}
        </h1>
        <button className="btn-red" onClick={() => deleteProduct()}>
          Yes
        </button>
        <button className="btn-default" onClick={() => goBack()}>
          No
        </button>
      </div>
    </Layout>
  );
}
