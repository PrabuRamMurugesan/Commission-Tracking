import React, { useEffect, useState } from "react";
import axios from "axios";

const ProductLoginLogViewer = ({ productId }) => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    axios
      .get(`/api/product/logs?productId=${productId}`)
      .then((res) => setLogs(res.data.logs));
  }, [productId]);

  return (
    <div>
      <h5>Product Log</h5>
      <ul>
        {logs.map((log, i) => (
          <li key={i}>
            {log.fileName} - {log.status} -{" "}
            {new Date(log.createdAt).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductLoginLogViewer;
