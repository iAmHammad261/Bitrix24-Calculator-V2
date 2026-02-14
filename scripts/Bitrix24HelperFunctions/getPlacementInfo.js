import { callBX24Method } from "./callBX24Method";


export const getPlacementInfo = async () => {
    try {
        const placementInfo = await callBX24Method('BX24.placement.info', {});
        return placementInfo;
    }
    catch (error) {
        console.error('Error fetching placement info:', error);
    }
}