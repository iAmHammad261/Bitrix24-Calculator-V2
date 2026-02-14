export const generatePDFOfSummary = () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    //  add the heading to the PDF
    doc.setFontSize(18);
    doc.text("Premier Choice",20,20)

    // get the project field
    const projectText = projectSelect.options[projectSelect.selectedIndex].text;

    // add the next heading in the same row
    doc.text(`${projectText}`, 150, 20);




    doc.save("summary.pdf")
}