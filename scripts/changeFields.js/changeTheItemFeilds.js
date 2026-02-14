import { callBX24Method } from "../Bitrix24HelperFunctions/callBX24Method.js";

export const changeTheItemFields = async (productID) => {

    console.log("Changing fields for product ID:", productID);

    const productData = await callBX24Method('catalog.product.get', {id: productID});

    console.log("Fetched product data:", productData);

    const baseRate = productData.product.property115.value || 0;
    const grossarea = productData.product.property113.value || 0;

    const valuesToSet = {
        totalPrice: Number((Number(baseRate.replace(/,/g, '')) * Number(grossarea.replace(/,/g, ''))).toFixed(2))
    }

    console.log("Calculated values to set:", valuesToSet);



    const priceField = document.getElementById('total-price');

    priceField.innerHTML = ''; 

    priceField.value = valuesToSet.totalPrice || '';
}