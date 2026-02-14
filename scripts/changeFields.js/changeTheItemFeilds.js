import { callBX24Method } from "../Bitrix24HelperFunctions/callBX24Method.js";

export const changeTheItemFields = async (productID) => {

    const productData = await callBX24Method('catalog.product.get', {id: productID});

    const baseRate = productData.property115;
    const grossarea = productData.property113;

    const valuesToSet = {
        totalPrice: Number((Number(baseRate) * Number(grossarea)).toFixed(2))
    }



    const priceField = document.getElementById('total-price');

    priceField.innerHTML = ''; 

    priceField.value = valuesToSet.totalPrice || '';
}