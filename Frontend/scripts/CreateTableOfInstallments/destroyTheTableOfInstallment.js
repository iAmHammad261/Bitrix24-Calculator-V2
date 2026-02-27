export const destroyInstallmentTable = () => {
  const tableBody = document.getElementById("installment-table-body");
  if (tableBody) {
    tableBody.innerHTML = "";
  }
};