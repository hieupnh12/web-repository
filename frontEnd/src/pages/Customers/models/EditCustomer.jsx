import React from "react";
import CustomerDialog from "./AddCustomer";

const EditCustomer = ({ open, onClose, onSubmit, customerData }) => {
  return (
    <CustomerDialog
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      editData={customerData}
    />
  );
};

export default EditCustomer;
