async function getFullExportReceipts() {
  const [receipts, accounts, customers, details, items] = await Promise.all([
    fetch('http://localhost:3004/exportReceipts').then(res => res.json()),
    fetch('http://localhost:3004/accounts').then(res => res.json()),
    fetch('http://localhost:3004/customers').then(res => res.json()),
    fetch('http://localhost:3004/exportReceiptDetails').then(res => res.json()),
    fetch('http://localhost:3004/productItems').then(res => res.json())
  ]);

  const fullData = receipts.map(receipt => {
    const staff = accounts.find(acc => acc.idStaff === receipt.idStaff);
    const customer = customers.find(cus => cus.idCustomer === receipt.idCustomer);
    const receiptDetails = details
      .filter(d => d.idExportReciept === receipt.idExportReciept)
      .map(detail => ({
        ...detail,
        productItems: items.filter(
          item =>
            item.idProductVersion === detail.idProductVersion &&
            item.idExportReciept === receipt.idExportReciept
        )
      }));

    return {
      ...receipt,
      staff,
      customer,
      details: receiptDetails
    };
  });

  return fullData;
}

// Gọi thử:
getFullExportReceipts().then(console.log);
