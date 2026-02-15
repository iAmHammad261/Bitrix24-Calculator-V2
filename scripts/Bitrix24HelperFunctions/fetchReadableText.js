import { callBX24Method } from "./callBX24Method.js"

export const fetchReadableText = async (propertyId) => {

    try{
     const value =  await callBX24Method("catalog.productPropertyEnum.get", { id: propertyId })
     return value;
    }
    catch(error){
        console.error("Error fetching readable text:", error);
        return null;
    }

}