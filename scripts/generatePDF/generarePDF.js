const generatePDFOfSummary = () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text("Premier Choice",20,20)

    


}