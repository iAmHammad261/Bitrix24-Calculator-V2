export const createTableOfInstallments = () => {
  const plan = document.getElementById("payment-condition").value;

  if (plan == "full") {
    const tableBody = document.getElementById("installment-table-body");
    tableBody.innerHTML = "";
    return;
  }

  const formatter = new Intl.NumberFormat("en-US", {
    style: "decimal",
    currency: "USD", 
  });

  const getInstallmentNumber = parseInt(document.getElementById("installment-duration").value) || 0;
  const summaryInstallmentElement = document.getElementById("summary-installment");
  const installmentPerAmount = summaryInstallmentElement ? summaryInstallmentElement.textContent.replace(/[^0-9.-]+/g, "") : 0;

  // 1. GATHER ALL BALLOON PAYMENTS FROM THE DOM
  const balloonRows = document.querySelectorAll('.balloon-row');
  const balloonPayments = [];
  
  balloonRows.forEach(row => {
    const monthInput = parseInt(row.querySelector('.balloon-month').value);
    const amountInput = parseFloat(row.querySelector('.balloon-amount').value);
    
    // Only add if both fields have valid numbers
    if (!isNaN(monthInput) && monthInput > 0 && !isNaN(amountInput) && amountInput > 0) {
      balloonPayments.push({ month: monthInput, amount: amountInput });
    }
  });

  const tableBody = document.getElementById("installment-table-body");
  tableBody.innerHTML = "";

  // 2. LOOP THROUGH AND BUILD THE TABLE
  for (let i = 1; i <= getInstallmentNumber; i++) {
    // --- Standard Installment Row ---
    const row = document.createElement("tr");
    row.classList.add("bg-white", "border-b", "border-gray-200");

    const installmentCell = document.createElement("td");
    installmentCell.classList.add("px-6", "py-4", "whitespace-nowrap", "text-sm", "text-gray-900", "font-medium");
    installmentCell.textContent = `${i}`;

    const amountCell = document.createElement("td");
    amountCell.classList.add("px-6", "py-4", "whitespace-nowrap", "text-sm", "text-gray-900");
    amountCell.textContent = `${formatter.format(installmentPerAmount)}`;

    row.appendChild(installmentCell);
    row.appendChild(amountCell);
    tableBody.appendChild(row);

    // --- Balloon Payment Row(s) ---
    // Find if there are any balloon payments scheduled for this specific month (i)
    const balloonsForThisMonth = balloonPayments.filter(bp => bp.month === i);
    
    balloonsForThisMonth.forEach((balloon) => {
      const balloonRow = document.createElement("tr");
      // Giving it a subtle gray/blue background to differentiate it from standard installments
      balloonRow.classList.add("bg-slate-50", "border-b", "border-gray-300"); 

      const balloonInstallmentCell = document.createElement("td");
      balloonInstallmentCell.classList.add("px-6", "py-4", "whitespace-nowrap", "text-sm", "text-pci-blue", "font-bold", "italic");
      balloonInstallmentCell.textContent = `${i} - Balloon Payment`;

      const balloonAmountCell = document.createElement("td");
      balloonAmountCell.classList.add("px-6", "py-4", "whitespace-nowrap", "text-sm", "text-pci-blue", "font-bold");
      balloonAmountCell.textContent = `${formatter.format(balloon.amount)}`;

      balloonRow.appendChild(balloonInstallmentCell);
      balloonRow.appendChild(balloonAmountCell);
      tableBody.appendChild(balloonRow);
    });
  }
};