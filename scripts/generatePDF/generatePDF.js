// Helper: Converts image URL to Base64 for PDF embedding
async function imageToBase64(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.setAttribute('crossOrigin', 'anonymous');
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = (e) => reject(e);
        img.src = url;
    });
}

// Helper: safe number parsing (removes commas if present)
function parseCurrency(value) {
    if (!value) return 0;
    return parseFloat(value.toString().replace(/,/g, ''));
}

// Helper: format number with commas
function formatCurrency(value) {
    return value.toLocaleString('en-US');
}

export const generatePDFOfSummary = async () => {
    // 1. Gather Data from DOM
    const projectSelect = document.getElementById("project-name");
    const clientNameInput = document.getElementById("client-name");
    const propertyTypeSelect = document.getElementById("property-type");
    const itemFilterSelect = document.getElementById("property-item");
    const paymentMethodSelect = document.getElementById("payment-condition");
    const grossAreaInput = document.getElementById("gross-area");
    const totalPriceInput = document.getElementById("total-price");
    const installmentsInput = document.getElementById("number-of-installments");
    const downPaymentPercInput = document.getElementById("downpayment-percentage");
    const possessionPercInput = document.getElementById("possession-percentage");
    const possessionAmtInput = document.getElementById("possession-amount");
    const installmentAmtInput = document.getElementById("installment-amount");

    // Get raw text/values
    const projectName = projectSelect.options[projectSelect.selectedIndex].text;
    const clientName = clientNameInput.value;
    const propertyType = propertyTypeSelect.options[propertyTypeSelect.selectedIndex].text;
    const unitNumber = itemFilterSelect.options[itemFilterSelect.selectedIndex].text;
    const condition = paymentMethodSelect.options[paymentMethodSelect.selectedIndex].text;
    const grossArea = grossAreaInput.value;
    const totalPriceRaw = parseCurrency(totalPriceInput.value);
    
    // Calculate derived amounts for the PDF
    const dpPercent = parseCurrency(downPaymentPercInput.value);
    const dpAmount = (totalPriceRaw * dpPercent) / 100;
    
    const possAmountRaw = parseCurrency(possessionAmtInput.value);
    
    // Calculate remaining amount for installments (Total - DP - Possession)
    const remainingBalance = totalPriceRaw - dpAmount - possAmountRaw;

    // Prepare the Main Data Object (Standardized for the PDF logic)
    const currentCalculations = {
        projectName: projectName,
        clientName: clientName,
        propertyType: propertyType,
        unitNumber: unitNumber,
        condition: condition, // Expecting "Installment Plan"
        mode: 'custom-area', // Forced as requested
        netArea: grossArea,   // Using the direct input
        totalPrice: formatCurrency(totalPriceRaw),
        numberOfInstallments: parseInt(installmentsInput.value) || 0,
        monthlyInstallment: installmentAmtInput.value, // Assumed pre-formatted
        downPaymentPercent: dpPercent,
        downPayment: formatCurrency(dpAmount),
        possessionPercent: parseCurrency(possessionPercInput.value),
        possessionAmount: possessionAmtInput.value,
        remainingAmount: formatCurrency(remainingBalance)
    };

    // 2. Define Assets
    const projectAssets = {
        "River Courtyard": { logoUrl: "https://i.postimg.cc/FHNNkXGY/River-Courtyard.png", imageUrl: "https://i.postimg.cc/nz0Qg1zw/river-Small.png" },
        "Grand Galleria": { logoUrl: "https://i.postimg.cc/QdhhKZS7/Grand-Gallery.png", imageUrl: "https://i.postimg.cc/4dBhq1dq/grand-gallery-Small.png" },
        "Box Park II": { logoUrl: "https://i.postimg.cc/7ZwwJrXG/Box-Park.png", imageUrl: "https://i.postimg.cc/262BMx60/box-park-II-Small.jpg" },
        "Roman Grove": { logoUrl: "https://i.postimg.cc/jSttnYvW/Roman-Grove.png", imageUrl: "https://i.postimg.cc/NMprSxM4/roman-grove-1-Small.jpg" },
        "Buraq Heights": { logoUrl: "https://i.postimg.cc/vZbbxwXW/Buraq-Heights.png", imageUrl: "https://i.postimg.cc/C1mfX41P/buraq-height-Small.png" },
        "Grand Orchard": { logoUrl: "https://i.postimg.cc/SxkkYbV8/Grand-Orchard.png", imageUrl: "https://i.postimg.cc/50nFTm0P/DHA-Orchard-Night-Shot-01-Small.jpg" },
        "default": { logoUrl: "https://i.postimg.cc/SxkkYbV8/Grand-Orchard.png", imageUrl: "https://i.postimg.cc/50nFTm0P/DHA-Orchard-Night-Shot-01-Small.jpg" }
    };

    const assets = projectAssets[currentCalculations.projectName] || projectAssets.default;
    const companyLogoUrl = "https://i.postimg.cc/50n359N3/pci-logo-01-01.png";

    // 3. Initialize PDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();

    const pciBlue = '#003366';
    const pciGold = '#D4AF37';
    const textDark = '#343A40';
    const textLight = '#6C757D';
    const bgLight = '#F8F9FA';

    // --- PAGE 1: TITLE PAGE ---
    let currentY = 15;

    // Company Logo
    try {
        const premierLogoBase64 = await imageToBase64(companyLogoUrl);
        doc.addImage(premierLogoBase64, 'PNG', 15, currentY, 80, 20);
    } catch (error) {
        doc.setFontSize(16).text('Premier Choice', 15, currentY + 10);
    }

    // Project Logo
    try {
        const projectLogoBase64 = await imageToBase64(assets.logoUrl);
        doc.addImage(projectLogoBase64, 'PNG', pageW - 70, currentY, 55, 25);
    } catch (error) {
        doc.setFontSize(14).text(currentCalculations.projectName, pageW - 65, currentY + 10);
    }

    currentY += 40;
    
    // Header Info
    doc.setFontSize(12);
    doc.text('Prepared for', 15, currentY);
    doc.text(currentCalculations.clientName || 'Valued Client', 15, currentY + 7);
    doc.text(`Project: ${currentCalculations.projectName}`, 15, currentY + 17);
    doc.text(`Property Type: ${currentCalculations.propertyType}`, 15, currentY + 24);

    const rightColX = pageW - 65;
    const quoteNum = Math.floor(1000 + Math.random() * 9000); // Random Quote ID
    doc.text('Summary #', rightColX, currentY);
    doc.text(String(quoteNum), rightColX, currentY + 7);
    doc.text('Date Issued:', rightColX, currentY + 17);
    doc.text(new Date().toLocaleDateString('en-GB'), rightColX, currentY + 24);
    currentY += 40;

    // Main Image
    const imageY = currentY;
    const imageHeight = 80;
    try {
        const projectImageBase64 = await imageToBase64(assets.imageUrl);
        doc.setFillColor(bgLight);
        doc.roundedRect(15, imageY, pageW - 30, imageHeight, 5, 5, 'F');
        doc.addImage(projectImageBase64, 'JPEG', 15, imageY, pageW - 30, imageHeight, undefined, 'FAST');
    } catch (error) {
        doc.setDrawColor(pciBlue).roundedRect(15, imageY, pageW - 30, imageHeight, 5, 5, 'S');
        doc.text('Project Visualization', pageW / 2, imageY + imageHeight / 2, { align: 'center' });
    }
    currentY += imageHeight + 25;

    // Details Columns
    const detailsY = currentY;
    const colWidth = (pageW - 40) / 2;
    doc.setFontSize(16).setFont('helvetica', 'bold').setTextColor(pciBlue);
    doc.text('Project Details', 15, detailsY);
    doc.setFontSize(11).setFont('helvetica', 'normal').setTextColor(textDark);

    const projectDetails = [
        `Project: ${currentCalculations.projectName}`, 
        `Unit Type: ${currentCalculations.propertyType}`, 
        `Payment Plan: ${currentCalculations.condition}`
    ];
    
    projectDetails.forEach((line, index) => doc.text(line, 15, detailsY + 12 + (index * 6)));

    const dividerX = 15 + colWidth + 10;
    doc.setDrawColor(pciBlue).setLineWidth(0.5).line(dividerX, detailsY - 5, dividerX, detailsY + 40);
    doc.setFontSize(16).setFont('helvetica', 'bold').setTextColor(pciBlue);
    doc.text('Unit Details', dividerX + 10, detailsY);
    doc.setFontSize(11).setFont('helvetica', 'normal').setTextColor(textDark);
    
    const unitDetails = [
        `Unit Number: ${currentCalculations.unitNumber}`,
        `Floor / Type: ${currentCalculations.propertyType}`, 
        `Total Area: ${currentCalculations.netArea}`,
    ];

    unitDetails.forEach((line, index) => doc.text(line, dividerX + 10, detailsY + 12 + (index * 6)));

    // Page 1 Footer
    const footerY = pageH - 25;
    doc.setDrawColor(pciBlue).setLineWidth(0.5).line(15, footerY, pageW - 15, footerY);
    doc.setFontSize(9).setFont('helvetica', 'normal').setTextColor(textDark);
    doc.text('Premier Choice International', 15, footerY + 8);
    doc.text('www.premierchoiceint.com', 15, footerY + 14);


    // --- PAGE 2: SUMMARY & SCHEDULE ---
    doc.addPage();
    const pageW2 = doc.internal.pageSize.getWidth();
    const pageH2 = doc.internal.pageSize.getHeight();
    let finalY2 = 0;

    // Header Background
    doc.setFillColor(bgLight).rect(0, 0, pageW2, 55, 'F');
    doc.setFillColor(pciBlue).rect(0, 0, pageW2, 40, 'F');
    
    // Header Logo (White text fallback if image fails)
    try {
        const logoBase64 = await imageToBase64(companyLogoUrl);
        doc.addImage(logoBase64, 'PNG', 15, 12, 50, 15);
    } catch (error) {
        doc.setFontSize(24).setFont('helvetica', 'bold').setTextColor('#FFFFFF').text('Premier Choice', 15, 22);
    }
    doc.setFontSize(28).setFont('helvetica', 'bold').setTextColor('#FFFFFF').text('Investment Summary', pageW2 - 15, 28, { align: 'right' });

    // Summary Table
    doc.autoTable({
        startY: 65,
        theme: 'plain',
        tableWidth: pageW2 - 30,
        margin: { left: 15 },
        body: [
            [{ content: 'PREPARED FOR', styles: { textColor: textLight, fontSize: 10 } }, { content: 'SUMMARY #', styles: { halign: 'right', textColor: textLight, fontSize: 10 } }],
            [{ content: currentCalculations.clientName, styles: { textColor: textDark, fontStyle: 'bold', fontSize: 12 } }, { content: quoteNum, styles: { halign: 'right', textColor: textDark, fontStyle: 'bold', fontSize: 11 } }],
            [{ content: `Project: ${currentCalculations.projectName}\nProperty Type: ${currentCalculations.propertyType}`, styles: { textColor: textLight, fontSize: 9 } }, { content: `Date Issued: ${new Date().toLocaleDateString('en-GB')}`, styles: { halign: 'right', textColor: textLight, fontSize: 9 } }]
        ]
    });
    finalY2 = doc.autoTable.previous.finalY;

    // Schedule Table Construction
    let description = `Investment for ${currentCalculations.projectName}\n`;
    description += currentCalculations.unitNumber; // Using unit number as description
    
    const tableBody = [];
    // Row 1: Main Total
    tableBody.push(['1', description, currentCalculations.netArea, currentCalculations.totalPrice]);
    
    // Rows 2+: Installments (Only if condition contains 'Installment')
    // Note: Checking string loosely to catch "Installment Plan" or similar
    if (currentCalculations.condition.toLowerCase().includes('installment')) {
        for (let i = 1; i <= currentCalculations.numberOfInstallments; i++) {
            tableBody.push(['', `Installment #${i}`, '', currentCalculations.monthlyInstallment]);
        }
    }

    doc.autoTable({
        startY: finalY2 + 15,
        head: [['#', 'DESCRIPTION', 'DIMENSIONS', 'AMOUNT']],
        body: tableBody,
        theme: 'striped',
        headStyles: { fillColor: pciBlue, textColor: '#FFFFFF', fontStyle: 'bold' },
        columnStyles: { 0: { cellWidth: 10 }, 1: { cellWidth: 70 }, 3: { halign: 'right' } },
        didParseCell: (data) => {
            if (data.row.index === 0 && data.column.index === 1) data.cell.styles.fontStyle = 'bold';
            // Fade out the installment rows slightly
            if (data.row.index > 0 && data.column.index === 1) {
                data.cell.styles.textColor = textLight;
                data.cell.styles.fontSize = 9;
            }
        }
    });
    finalY2 = doc.autoTable.previous.finalY;

    // Totals Table (Bottom Right)
    let totalsBody = [];
    if (currentCalculations.condition.toLowerCase().includes('installment')) {
        totalsBody = [
            ['Total Price:', currentCalculations.totalPrice],
            [`Down Payment (${currentCalculations.downPaymentPercent}%):`, currentCalculations.downPayment]
        ];
        
        // Add possession if it exists
        if (currentCalculations.possessionPercent > 0) {
            totalsBody.push([`On Possession (${currentCalculations.possessionPercent}%):`, currentCalculations.possessionAmount]);
        }
        
        totalsBody.push(['Remaining For Installments:', currentCalculations.remainingAmount]);
    } else {
        totalsBody = [['Grand Total:', currentCalculations.totalPrice]];
    }

    doc.autoTable({
        startY: finalY2 + 8,
        theme: 'plain',
        body: totalsBody,
        columnStyles: { 0: { fontStyle: 'bold', halign: 'right' }, 1: { halign: 'right', fontStyle: 'bold', textColor: textDark } },
        margin: { left: 100 }
    });

    // Page 2 Footer
    const footerStartY = pageH2 - 25;
    doc.setDrawColor(pciGold).setLineWidth(0.5).line(15, footerStartY, pageW2 - 15, footerStartY);
    doc.setFontSize(8).setFont('helvetica', 'normal').setTextColor(textLight);
    doc.text('This is a computer-generated document. Prices are subject to change.', pageW2 / 2, footerStartY + 7, { align: 'center' });
    doc.setFontSize(10).setFont('helvetica', 'bold').setTextColor(pciBlue);
    doc.text('Premier Choice International | Inspiring Lifestyle', pageW2 / 2, footerStartY + 13, { align: 'center' });

    doc.save("summary.pdf");
};