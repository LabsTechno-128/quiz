export  const customSelectStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: "#f8fafc", // slate-50
      borderColor: state.isFocused ? "#6366f1" : "#f1f5f9", // indigo-500 : slate-100
      borderRadius: "1.5rem",
      padding: "0.5rem 1rem",
      boxShadow: state.isFocused ? "0 0 0 4px #e0e7ff" : "none", // indigo-100
      "&:hover": {
        borderColor: "#6366f1",
      },
      transition: "all 0.2s ease",
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#6366f1"
        : state.isFocused
          ? "#eef2ff"
          : "white",
      color: state.isSelected ? "white" : "#1e293b",
      padding: "0.75rem 1.25rem",
      borderRadius: "0.75rem",
      margin: "0.25rem 0.5rem",
      cursor: "pointer",
      width: "auto",
    }),
    menu: (provided: any) => ({
      ...provided,
      borderRadius: "1.5rem",
      padding: "0.5rem",
      boxShadow:
        "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
      border: "1px solid #f1f5f9",
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: "#94a3b8",
      fontSize: "0.875rem",
      fontWeight: "500",
    }),
  };