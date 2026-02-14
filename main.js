import { populateFilters } from "./scripts/PopulateFilters/populateFilters.js";

// A simple console log to verify connection
console.log('Script loaded successfully from the scripts folder!');

await populateFilters();


// Select DOM elements
const button = document.getElementById('myButton');
const outputText = document.getElementById('output-text');
const projectSelect = document.getElementById('project-name');
const propertyTypeSelect = document.getElementById('property-type');
const propertyCategorySelect = document.getElementById('property-category');


// Add an event listener
button.addEventListener('click', () => {
    // outputText.textContent = "You clicked the button! JavaScript is working.";
    console.log("Button clicked.");
});

projectSelect.addEventListener('change', () => {
    // outputText.textContent = `Selected project: ${projectSelect.value}`;
    console.log("Project selected:", projectSelect.value);
});

propertyTypeSelect.addEventListener('change', () => {
    // outputText.textContent = `Selected property type: ${propertyTypeSelect.value}`;
    console.log("Property type selected:", propertyTypeSelect.value);
})

propertyCategorySelect.addEventListener('change', () => {
    // outputText.textContent = `Selected property category: ${propertyCategorySelect.value}`;
    console.log("Property category selected:", propertyCategorySelect.value);
});

