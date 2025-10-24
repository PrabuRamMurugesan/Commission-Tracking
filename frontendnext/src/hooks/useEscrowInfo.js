import { useEffect, useState } from "react";
import axiosInstance from "../../src/api/axiosInstance"; // ✅ Confirm this path is correct
import { useParams, Link, useNavigate } from "react-router-dom";

export default function useEscrowInfo() {
  const [escrowData, setEscrowData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  console.log("⏳ Fetching Escrow Info for:", id);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("authToken");
      console.log("🔑 Token before request:", token);

      try {
        console.log("⏳ Fetching Escrow Info for:", id);
        const res = await axiosInstance.get(`/invoices/${id}/escrowInfo`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true, // for CORS cookies if needed
        });

        console.log("✅ Escrow Info Response:", res.data);
        setEscrowData(res.data);
      } catch (error) {
        console.error("❌ Escrow Info Fetch Error:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  return { escrowData, loading, error };
}
