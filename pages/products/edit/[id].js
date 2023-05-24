import FormLayout from "@/components/FormLayout";
import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EditProductPage() {
  const router = useRouter();
  const [data, setData] = useState();
  const { id } = router.query;
  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get("/api/products?id=" + id).then((response) => {
      setData(response.data);
    });
  }, [id]);
  return (
    <Layout>
      <h1>Edit product</h1>
      {data && <FormLayout {...data} />}
    </Layout>
  );
}
