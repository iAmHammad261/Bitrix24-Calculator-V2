import { populateFilters } from "./scripts/PopulateFilters/populateInitialFilters.js";
import { getTheProductWithFilter } from "./scripts/Bitrix24HelperFunctions/getTheProductWithFilter.js";
import { populateItemFilter } from "./scripts/PopulateFilters/populateItemFilter.js";
import { changeTheItemFields } from "./scripts/changeFields.js/changeTheItemFeilds.js";
import { hideFilterFields } from "./scripts/changeVisibiltyOfFilterFeilds/hideFilterFeilds.js";
import { unhideFilterFields } from "./scripts/changeVisibiltyOfFilterFeilds/unhideFilterFeilds.js";
import { changeTheFinanceFields } from "./scripts/changeFields.js/changeTheFinanceFeilds.js";
import { createTableOfInstallments } from "./scripts/CreateTableOfInstallments/createTableOfInstallments.js";

// A simple console log to verify connection
console.log('Script loaded successfully from the scripts folder!');

await populateFilters();


// Select DOM elements
const button = document.getElementById('myButton');
const outputText = document.getElementById('output-text');
const projectSelect = document.getElementById('project-name');
const propertyTypeSelect = document.getElementById('property-type');
const propertyCategorySelect = document.getElementById('property-category');
const itemFilterSelect = document.getElementById("property-item");
const paymentMethodSelect = document.getElementById("payment-condition");
const downPaymentPercentageSelect = document.getElementById("downpayment-percentage");
const onPossessionPercentageSelect = document.getElementById("possession-percentage");
const installmentPlanSelect = document.getElementById("installment-duration");

const handleFilterChange = async () => {
    const filters = {
        project: projectSelect.value,
        propertyType: propertyTypeSelect.value,
        propertyCategory: propertyCategorySelect.value
    }

    console.log("Current filters:", filters);

    if(filters){
        const productList = await getTheProductWithFilter(filters);
            populateItemFilter(productList);
    }

}

const handleItemChange = async () => {
    const selectedItemId = itemFilterSelect.value;
    await changeTheItemFields(selectedItemId);
    changeTheFinanceFields();
    createTableOfInstallments();
}

const handlePaymentMethodChange = () => {

    const selectedPaymentMethod = paymentMethodSelect.value;

    console.log("Selected payment method:", selectedPaymentMethod);

    if( selectedPaymentMethod == "full"){
        hideFilterFields(["installment-options-container"])
        changeTheFinanceFields();
        createTableOfInstallments();
    }
    if(selectedPaymentMethod == "installment"){
        unhideFilterFields(["installment-options-container"])
         changeTheFinanceFields();
        createTableOfInstallments();
    }

}


// handle the change of the downpayment percentage,on possession percentage, and installment plans
const handlechangeOfFinanceValues = () => {
   changeTheFinanceFields();
   createTableOfInstallments();
}



projectSelect.addEventListener('change', handleFilterChange);

propertyTypeSelect.addEventListener('change', handleFilterChange)

propertyCategorySelect.addEventListener('change', handleFilterChange);

itemFilterSelect.addEventListener('change', handleItemChange);

paymentMethodSelect.addEventListener('change', handlePaymentMethodChange);

downPaymentPercentageSelect.addEventListener('change', handlechangeOfFinanceValues);

onPossessionPercentageSelect.addEventListener('change', handlechangeOfFinanceValues);

installmentPlanSelect.addEventListener('change', handlechangeOfFinanceValues);






