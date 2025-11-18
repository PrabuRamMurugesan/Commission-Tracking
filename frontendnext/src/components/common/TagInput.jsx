import React, { useState } from "react";

const TagInput = ({ label, value, onChange }) => {
  const [input, setInput] = useState("");

  const handleAdd = (e) => {
    if (e.key === "Enter" && input.trim()) {
      onChange([...value, input.trim()]);
      setInput("");
    }
  };

  const removeTag = (tag) => {
    onChange(value.filter((item) => item !== tag));
  };

  return (
    <div className="mb-3">
      <label className="form-label">{label}</label>
      <div className="tags-container">
        {value.map((tag, idx) => (
          <span className="tag-pill" key={idx}>
            {tag}
            <button type="button" onClick={() => removeTag(tag)}>
              ×
            </button>
          </span>
        ))}
      </div>

      <input
        className="form-control mt-2"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleAdd}
        placeholder="Press Enter to add"
      />
    </div>
  );
};

export default TagInput;
