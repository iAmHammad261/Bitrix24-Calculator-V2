import { populateFilters } from "./PopulateFilters/populateFilters.js";

// A simple console log to verify connection
console.log('Script loaded successfully from the scripts folder!');

populateFilters();


// Select DOM elements
const button = document.getElementById('myButton');
const outputText = document.getElementById('output-text');

// Add an event listener
button.addEventListener('click', () => {
    outputText.textContent = "You clicked the button! JavaScript is working.";
    console.log("Button clicked.");
});