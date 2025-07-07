import React, { useEffect, useState } from 'react'
import { fetchFullImportReceipts } from '../../services/importService';

export default function ImportStock() {

    const [tableData, setTableData] = useState([]);
    const importReceipt = async () => {
        try {
            const resp = await fetchFullImportReceipts();
            console.log(resp);
            
        } catch (error) {
            console.log("lỗi import", error);
        }
    }

    useEffect(() => {
        importReceipt();
    }, []);

  return (
    <div>ImportStock</div>
  )
}
