import React, { useEffect, useState } from "react";
import { getCommissions } from "../api";

const CommissionList = () => {
  const [commissions, setCommissions] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getCommissions();
      setCommissions(data);
    }
    fetchData();
  }, []);

  return (
    <div>
      <h2>Commission List</h2>
      {commissions.map((item) => (
        <p key={item._id}>{item.agent}: ${item.amount}</p>
      ))}
    </div>
  );
};

export default CommissionList;
