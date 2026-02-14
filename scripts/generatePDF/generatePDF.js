export const generatePDFOfSummary = () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    //  add the heading to the PDF
    doc.setFontSize(22);
    doc.text("Premier Choice",20,20)

    // get the project field
    const projectField = document.getElementById("project-name");

    // add the next heading in the same row
    doc.text(`{projectField.value}`, 150, 20);




    doc.save("summary.pdf")
}