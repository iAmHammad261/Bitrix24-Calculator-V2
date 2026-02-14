export const populateItemFilter = (projectlist) => {

    const itemFilterSelect = document.getElementById("property-item") 

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

}