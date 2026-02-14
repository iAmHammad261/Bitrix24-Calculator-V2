export const changeTheFinanceFields = () => {

    const downPaymentPercentage = document.getElementById("downpayment-percentage").value;
    const onPossessionPercentage = document.getElementById("possession-percentage").value;
    const installmentPlan = document.getElementById("installment-duration").value;

    console.log("Down Payment Percentage:", downPaymentPercentage);
    console.log("On Possession Percentage:", onPossessionPercentage);
    console.log("Installment Plan:", installmentPlan);


  const formatter = new Intl.NumberFormat("en-US", {
    style: "decimal",

    currency: "USD",
  });

  const productPrice =
    parseFloat(
      document.getElementById("total-price").value.replace(/[^0-9.-]+/g, ""),
    ) || 0;

  const downPaymentAmount = parseFloat(
    (productPrice * downPaymentPercentage) / 100,
  ).toFixed(2);

  const onPossessionAmount = parseFloat(
    (productPrice * onPossessionPercentage) / 100,
  ).toFixed(2);

  const remainingAmountForInstallment = parseFloat(
    productPrice - downPaymentAmount - onPossessionAmount,
  ).toFixed(2);

  const installmentAmount = parseFloat(
    remainingAmountForInstallment / installmentPlan,
  ).toFixed(2);

  const downPaymentAmountField = document.getElementById("summary-downpayment");

  const onPossessionAmountField = document.getElementById(
    "summary-possession-amount",
  );

  const installmentAmountField = document.getElementById("summary-remaining");

  const installmentAmountPerInstallmentField = document.getElementById(
    "summary-installment",
  );

  const installmentUnitsField = document.getElementById(
    "summary-installments-no",
  );

  downPaymentAmountField.textContent = formatter.format(downPaymentAmount);
  onPossessionAmountField.textContent = formatter.format(onPossessionAmount);
  installmentAmountField.textContent = formatter.format(remainingAmountForInstallment);
  installmentAmountPerInstallmentField.textContent = formatter.format(installmentAmount);
  installmentUnitsField.textContent = installmentPlan;
};
