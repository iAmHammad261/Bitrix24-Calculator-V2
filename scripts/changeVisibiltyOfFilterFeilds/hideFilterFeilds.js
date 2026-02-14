export const hideFilterFields = (fieldsToHide) => {

    hideFilterFields.forEach(fieldId => {
        const fieldElement = document.getElementById(fieldId);
        if (fieldElement) {
            fieldElement.style.display = 'none';
        }
    });

}