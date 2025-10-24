import React, { useEffect, useState } from "react";
import axios from "axios";

const FlaggedProductsPage = () => {
  const [flagged, setFlagged] = useState([]);

  useEffect(() => {
    axios
      .get("/api/admin/flagged-products")
      .then((res) => setFlagged(res.data.flagged));
  }, []);

  return (
    <div className="container mt-4">
      <h3>Flagged Products</h3>
      <ul className="list-group">
        {flagged.map((item, i) => (
          <li className="list-group-item" key={i}>
            {item.productId?.productName} - Reason: {item.reason} - Vendor:{" "}
            {item.vendorId?.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FlaggedProductsPage;
