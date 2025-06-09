import React from 'react'
import { useNavigate } from "react-router-dom";

const TaxationSettings = () => {
      const navigate = useNavigate();
    
  return (
    <div>
      <h2 className="mb-4 p-4">Taxation Settings</h2>
      <button
        onClick={() => {
          navigate("/gst-fillingAssitant");
        }}
      >
        GSTFillingAssistant
      </button>
      <button
        onClick={() => {
          navigate("/admin-tax-setting");
        }}
      >
        AdminTaxSettingsPage
      </button>
      <button
        onClick={() => {
          navigate("/cbav-tax");
        }}
      >
        CbavTaxSettingsPage
      </button>
      <button
        onClick={() => {
          navigate("/franchisee-tax");
        }}
      >
        franchiseeTaxSettingsPage
      </button>
      <button
        onClick={() => {
          navigate("/agent-tax");
        }}
      >
        AgentTaxSettingsPage
      </button>
      <button
        onClick={() => {
          navigate("/vendor-tax");
        }}
      >
        VendorTaxSettingsPage
      </button>
      <button
        onClick={() => {
          navigate("/territory-tax");
        }}
      >
        TerritoryTaxSettingsPage
      </button>
    </div>
  );
}

export default TaxationSettings