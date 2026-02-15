import { callBX24Method } from "../Bitrix24HelperFunctions/callBX24Method.js";

/**
 * Converts a File or Blob object to a Base64 string (raw content only)
 */
const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const base64String = reader.result.split(',')[1];
            resolve(base64String);
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(blob);
    });
};

export const attachFileToLead = async (leadId, file) => {
    const FILE_FIELD = "UF_CRM_1758688640";
    const ENTITY_TYPE_ID = 1; // 1 = Lead

    try {
        // 1. Fetch existing files
        // Since your wrapper returns result.data(), 'data' here is the object { item: { ... } }
        const data = await callBX24Method('crm.item.get', {
            entityTypeId: ENTITY_TYPE_ID,
            id: leadId,
            select: [FILE_FIELD]
        });

        const item = data?.item;
        if (!item) throw new Error("Could not find lead data.");

        // Map existing files to the required format: [{id: 123}, {id: 124}]
        const existingFiles = Array.isArray(item[FILE_FIELD]) 
            ? item[FILE_FIELD].map(f => ({ id: f.id })) 
            : [];

        // 2. Prepare the new file
        const base64Content = await blobToBase64(file);
        
        // Bitrix format for adding a new file to a multiple-file field: [filename, base64]
        const newFilePayload = [file.name, base64Content];

        // 3. Merge and Update
        const finalPayload = [...existingFiles, newFilePayload];

        // Your wrapper rejects on error, so we can just await the update
        const updateResult = await callBX24Method('crm.item.update', {
            entityTypeId: ENTITY_TYPE_ID,
            id: leadId,
            fields: {
                [FILE_FIELD]: finalPayload
            }
        });

        return updateResult; // Returns the updated item data

    } catch (error) {
        // Since your wrapper rejects with result.error(), 'error' is the error object/string
        console.error("Failed to attach file to Lead:", error);
        throw error;
    }
};