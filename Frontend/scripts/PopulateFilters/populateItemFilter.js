import { emptyFinanceFields } from "../changeFields.js/emptyTheFinanceFields.js";
import { destroyInstallmentTable } from "../CreateTableOfInstallments/destroyTheTableOfInstallment.js";

export const populateItemFilter = (projectlist) => {

    const itemFilterSelect = document.getElementById("property-item") 
    const generatePDFButton = document.getElementById("menu-download-pdf");
    const attachToLeadButton = document.getElementById("menu-attach-lead");

    // clear all the options first
    itemFilterSelect.innerHTML = "";

    if(!projectlist || projectlist.length === 0){


        console.warn("No products found to populate item filter.");
        // clear the select options and say no items found
        const itemFilterSelect = document.getElementById("property-item");
        itemFilterSelect.innerHTML = ""; // Clear existing options
        const defaultOpt = document.createElement("option");
        defaultOpt.value = "";
        defaultOpt.text = "No items found for selected filters";
        defaultOpt.className = "red-500";
        itemFilterSelect.appendChild(defaultOpt);

        // disable the generate PDF and attach to lead buttons since there's no item to select
        generatePDFButton.disabled = true;
        attachToLeadButton.disabled = true;
        emptyFinanceFields();
        destroyInstallmentTable();

        return;
    }

    

    // create default option
    const defaultOpt = document.createElement("option");
    defaultOpt.value = "";
    defaultOpt.text = "Select a Property Item";
    defaultOpt.className = "text-black";
    itemFilterSelect.appendChild(defaultOpt);

    projectlist.forEach((project) => {
        const option = document.createElement("option");
        option.value = project.ID;
        option.text = project.NAME;
        option.className = "text-black";
        itemFilterSelect.appendChild(option);
    });

    // enable the generate PDF and attach to lead buttons since there are items to select
    generatePDFButton.disabled = false;
    attachToLeadButton.disabled = false;

}