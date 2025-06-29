import React from "react";
import SupplierDialog from "./CreateSupplierDialog";

const EditSupplier = ({ open, onClose, onSubmit, supplierData }) => {
  return (
    <SupplierDialog
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      editData={supplierData}
    />
  );
};

export default EditSupplier;
