import { populateFilters } from "./scripts/PopulateFilters/populateInitialFilters.js";
import { getTheProductWithFilter } from "./scripts/Bitrix24HelperFunctions/getTheProductWithFilter.js";
import { populateItemFilter } from "./scripts/PopulateFilters/populateItemFilter.js";
import { changeTheItemFields } from "./scripts/changeFields.js/changeTheItemFeilds.js";
import { hideFilterFields } from "./scripts/changeVisibiltyOfFilterFeilds/hideFilterFeilds.js";
import { unhideFilterFields } from "./scripts/changeVisibiltyOfFilterFeilds/unhideFilterFeilds.js";
import { changeTheFinanceFields } from "./scripts/changeFields.js/changeTheFinanceFeilds.js";
import { createTableOfInstallments } from "./scripts/CreateTableOfInstallments/createTableOfInstallments.js";
import { generatePDFOfSummary } from "./scripts/generatePDF/generatePDF.js";
import { getPlacementInfo } from "./scripts/Bitrix24HelperFunctions/getPlacementInfo.js";
import { attachFileToLead } from "./scripts/attachFileToLead/attachFileToLead.js";

// A simple console log to verify connection
console.log("Script loaded successfully from the scripts folder!");

await populateFilters();

// Select DOM elements
const button = document.getElementById("myButton");
const outputText = document.getElementById("output-text");
const projectSelect = document.getElementById("project-name");
const propertyTypeSelect = document.getElementById("property-type");
const propertyCategorySelect = document.getElementById("property-category");
const itemFilterSelect = document.getElementById("property-item");
const paymentMethodSelect = document.getElementById("payment-condition");
const downPaymentPercentageSelect = document.getElementById(
  "downpayment-percentage",
);
const onPossessionPercentageSelect = document.getElementById(
  "possession-percentage",
);
const installmentPlanSelect = document.getElementById("installment-duration");
const downloadButtonSelect = document.getElementById("menu-download-pdf");
const attachPDFButtonSelect = document.getElementById("menu-attach-lead");

const handleFilterChange = async () => {
  const filters = {
    project: projectSelect.value,
    propertyType: propertyTypeSelect.value,
    propertyCategory: propertyCategorySelect.value,
  };

  console.log("Current filters:", filters);

  if (filters) {
    const productList = await getTheProductWithFilter(filters);
    populateItemFilter(productList);
  }
};

const handleItemChange = async () => {
  downloadButtonSelect.disabled = false;
  const selectedItemId = itemFilterSelect.value;
  await changeTheItemFields(selectedItemId);
  changeTheFinanceFields();
  createTableOfInstallments();
};

const handlePaymentMethodChange = () => {
  const selectedPaymentMethod = paymentMethodSelect.value;

  console.log("Selected payment method:", selectedPaymentMethod);

  if (selectedPaymentMethod == "full") {
    hideFilterFields(["installment-options-container"]);
    changeTheFinanceFields();
    createTableOfInstallments();
  }
  if (selectedPaymentMethod == "installment") {
    unhideFilterFields(["installment-options-container"]);
    changeTheFinanceFields();
    createTableOfInstallments();
  }
};

// handle the change of the downpayment percentage,on possession percentage, and installment plans
const handlechangeOfFinanceValues = () => {
  changeTheFinanceFields();
  createTableOfInstallments();
};

const downloadPDFSummary = async () => {
  const pdfDoc = await generatePDFOfSummary();
  pdfDoc.save("summary.pdf");
};

const attachPDFToLead = async () => {
  console.log("[Attach PDF] Starting process to attach PDF to Lead...");

  const leadID = getPlacementInfo()["options"]["ID"];

  const file = await generatePDFOfSummary();

  const pdfBlob = file.output("blob");

  pdfBlob.name = `Payment-Plan-${leadID}.pdf`;

  attachFileToLead(leadID, pdfBlob);

  console.log(`[Attach PDF] Retrieved Lead ID from placement info: ${leadID}`);

  // const pdfDoc = await generatePDFOfSummary();

  // // convert to base64 String
  // const fullDataUri = await pdfDoc.output('datauristring');
  // const base64String = fullDataUri.split(',')[1];

  // await attachFileToLead(leadId, base64String);
};

projectSelect.addEventListener("change", handleFilterChange);

propertyTypeSelect.addEventListener("change", handleFilterChange);

propertyCategorySelect.addEventListener("change", handleFilterChange);

itemFilterSelect.addEventListener("change", handleItemChange);

paymentMethodSelect.addEventListener("change", handlePaymentMethodChange);

downPaymentPercentageSelect.addEventListener(
  "change",
  handlechangeOfFinanceValues,
);

onPossessionPercentageSelect.addEventListener(
  "change",
  handlechangeOfFinanceValues,
);

installmentPlanSelect.addEventListener("change", handlechangeOfFinanceValues);

downloadButtonSelect.addEventListener("click", downloadPDFSummary);

attachPDFButtonSelect.addEventListener("click", attachPDFToLead);
