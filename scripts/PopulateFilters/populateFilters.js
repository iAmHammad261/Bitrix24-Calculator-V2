import { getProjectList } from "../Bitrix24HelperFunctions/getProjectList.js";
import { getPlacementInfo } from "../Bitrix24HelperFunctions/getPlacementInfo.js";
import { getLeadData } from "../Bitrix24HelperFunctions/getLeadData.js";


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
    projectList.productPropertyEnums.forEach((project) => {
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


  // get the lead title and populate the lead title filter:
  const placementInfo = await getPlacementInfo();
  const leadId = placementInfo['options']['ID'];

  const leadData = await getLeadData(leadId);
  const leadTitle = leadData['TITLE'];

  const leadTitleInput = document.getElementById("client-name");
    if (leadTitleInput) {
        leadTitleInput.value = leadTitle;
    }

};
