export const createTableOfInstallments = () => {
    
    const getInstallmentNumber = document.getElementById('installment-duration').value;
    const installmentPerAmount = document.getElementById('summary-installment').textContent.replace(/[^0-9.-]+/g, "") || 0;


    const tableBody = document.getElementById('installment-table-body');
    tableBody.innerHTML = '';

    for (let i = 1; i <= getInstallmentNumber; i++) {
        const row = document.createElement('tr');
        row.classList.add('bg-white/10', 'border-b', 'border-white/20');
        const installmentCell = document.createElement('td');
        installmentCell.classList.add('px-6', 'py-4', 'whitespace-nowrap', 'text-sm', 'text-gray-300');
        installmentCell.textContent = `Installment ${i}`;

        const amountCell = document.createElement('td');
        amountCell.classList.add('px-6', 'py-4', 'whitespace-nowrap', 'text-sm', 'text-gray-300');
        amountCell.textContent = `$${installmentPerAmount}`;

        row.appendChild(installmentCell);
        row.appendChild(amountCell);
        tableBody.appendChild(row);
    }


}