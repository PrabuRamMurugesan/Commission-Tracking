import React from "react";

const Step8Review = ({ form }) => {
  return (
    <div>
      <h4>Review & Submit</h4>
      <p className="mt-3">
        Please review the beneficiary details before submitting.
      </p>

      <div className="review-box mt-3">
        {Object.entries(form).map(([key, value]) => (
          <div
            key={key}
            className="d-flex justify-content-between border-bottom py-2"
          >
            <strong>{key}</strong>
            <span>
              {Array.isArray(value)
                ? value.join(", ")
                : value && value.name
                ? value.name
                : value?.toString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Step8Review;
