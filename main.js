import { populateFilters } from "./scripts/PopulateFilters/populateInitalFilters.js";
import { getTheProductWithFilter } from "./scripts/Bitrix24HelperFunctions/getTheProductWithFilter.js";
import { populateItemFilter } from "./scripts/PopulateFilters/populateItemFilter.js";

// A simple console log to verify connection
console.log('Script loaded successfully from the scripts folder!');

await populateFilters();


// Select DOM elements
const button = document.getElementById('myButton');
const outputText = document.getElementById('output-text');
const projectSelect = document.getElementById('project-name');
const propertyTypeSelect = document.getElementById('property-type');
const propertyCategorySelect = document.getElementById('property-category');


const handleFilterChange = async () => {
    const filters = {
        project: projectSelect.value,
        propertyType: propertyTypeSelect.value,
        propertyCategory: propertyCategorySelect.value
    }

    console.log("Current filters:", filters);

    if(filters){
        const productList = await getTheProductWithFilter(filters);
        if(productList && productList.length > 0){
            populateItemFilter(productList);
        }
    }

}




projectSelect.addEventListener('change', handleFilterChange);

propertyTypeSelect.addEventListener('change', handleFilterChange)

propertyCategorySelect.addEventListener('change', handleFilterChange);

