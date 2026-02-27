export const emptyFinanceFields = () => {
  const fields = [
    "summary-downpayment",
    "summary-possession-amount",
    "summary-remaining",
    "summary-installment",
    "summary-installments-no",
    "summary-total-price"
  ];

  fields.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = ''; 
    }
  });
};