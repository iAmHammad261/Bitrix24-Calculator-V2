import { getProjectList } from "../Bitrix24HelperFunctions/getProjectList.js";


export const populateFilters = async () => {

  // first fetch the project list and then populate the filters with the project names:

  const projectSelect = document.getElementById("project-name");
  if (!projectSelect) return;

  try {
    const projectList = await getProjectList();

    // Clear the "Loading..." message
    projectSelect.innerHTML = "";

    // Add a default blank option
    const defaultOpt = document.createElement("option");
    defaultOpt.value = "";
    defaultOpt.text = "Select a Project";
    defaultOpt.className = "text-black";
    projectSelect.appendChild(defaultOpt);

    // Loop through the data you shared
    projectList.forEach((project) => {
      const option = document.createElement("option");
      // We use the 'id' for the value because Bitrix needs IDs for updates
      option.value = project.id;
      // We use the 'value' string for the user to see
      option.text = project.value;
      option.className = "text-black";

      projectSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Failed to load projects:", error);
    projectSelect.innerHTML =
      '<option class="text-black">Error loading projects</option>';
  }


};
