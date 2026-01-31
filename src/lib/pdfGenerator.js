import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generatePDFReport = (store, health, action = 'download') => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  
  // Helper for centered text
  const centerText = (text, y) => {
    const textWidth = doc.getStringUnitWidth(text) * doc.internal.getFontSize() / doc.internal.scaleFactor;
    const x = (pageWidth - textWidth) / 2;
    doc.text(text, x, y);
  };

  // --- Header ---
  doc.setFillColor(79, 70, 229); // Indigo-600
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  centerText("Immersify Brand Health Report", 20);
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  centerText(`Generated on: ${new Date().toLocaleDateString()}`, 30);

  // --- Executive Summary ---
  let yPos = 55;
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Executive Summary", 14, yPos);
  
  yPos += 10;
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Overall Brand Health Score: ${health.overallScore}%`, 14, yPos);
  yPos += 7;
  doc.text(`Current Brand Tier: ${health.tier}`, 14, yPos);
  
  // --- Pillar Breakdown Table ---
  yPos += 15;
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Pillar Performance", 14, yPos);
  
  yPos += 5;
  const tableData = Object.entries(health.pillarScores).map(([key, score]) => [
    key.replace('_', ' ').toUpperCase(),
    `${score}%`,
    score < 30 ? "Critical" : score < 80 ? "Optimizing" : "Strong"
  ]);

  doc.autoTable({
    startY: yPos,
    head: [['Pillar', 'Score', 'Status']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [79, 70, 229] },
    styles: { fontSize: 11 },
  });

  yPos = doc.lastAutoTable.finalY + 20;

  // --- Critical Actions ---
  if (health.topPriorities && health.topPriorities.length > 0) {
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Recommended Actions", 14, yPos);
    yPos += 10;
    
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    health.topPriorities.forEach((priority, index) => {
        const text = `${index + 1}. ${priority.text} (${priority.section})`;
        const splitText = doc.splitTextToSize(text, 180);
        doc.text(splitText, 14, yPos);
        yPos += (splitText.length * 7);
    });
    
    yPos += 10;
  }

  // --- Visual Analysis (if available) ---
  if (store.visualAnalysis) {
      if (yPos > 250) {
          doc.addPage();
          yPos = 20;
      }
      
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Visual Consistency Analysis", 14, yPos);
      yPos += 10;
      
      const analysis = store.visualAnalysis;
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      
      doc.text(`Visual Score: ${analysis.score}/100`, 14, yPos);
      yPos += 7;
      doc.text(`Status: ${analysis.status}`, 14, yPos);
      yPos += 10;
      
      const summary = `Analysis: ${analysis.analysis}`;
      const splitSummary = doc.splitTextToSize(summary, 180);
      doc.text(splitSummary, 14, yPos);
      yPos += (splitSummary.length * 7) + 5;
      
      if (analysis.improvements && analysis.improvements.length > 0) {
          doc.text("Key Improvements:", 14, yPos);
          yPos += 7;
          analysis.improvements.forEach(imp => {
              const impText = `- ${imp}`;
              const splitImp = doc.splitTextToSize(impText, 175);
              doc.text(splitImp, 18, yPos);
              yPos += (splitImp.length * 7);
          });
      }
  }

  // --- Strategy (if available) ---
  if (store.strategy) {
      doc.addPage();
      yPos = 20;
      
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Generated Brand Strategy", 14, yPos);
      yPos += 10;
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      
      // Since strategy might be raw markdown or structured, we'll try to dump a simplified version
      // Or just the main points if we can parse it.
      // Assuming it's a JSON object with keys like 'taglines', 'mission', etc.
      
      Object.entries(store.strategy).forEach(([key, value]) => {
          if (typeof value === 'string') {
              doc.setFont("helvetica", "bold");
              doc.text(key.toUpperCase(), 14, yPos);
              yPos += 7;
              
              doc.setFont("helvetica", "normal");
              const splitVal = doc.splitTextToSize(value, 180);
              doc.text(splitVal, 14, yPos);
              yPos += (splitVal.length * 5) + 10;
              
              if (yPos > 270) {
                  doc.addPage();
                  yPos = 20;
              }
          } else if (Array.isArray(value)) {
               doc.setFont("helvetica", "bold");
               doc.text(key.toUpperCase(), 14, yPos);
               yPos += 7;
               
               doc.setFont("helvetica", "normal");
               value.forEach(item => {
                   const itemText = `- ${item}`;
                   const splitItem = doc.splitTextToSize(itemText, 180);
                   doc.text(splitItem, 14, yPos);
                   yPos += (splitItem.length * 5);
               });
               yPos += 10;
          }
      });
  }

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - 30, doc.internal.pageSize.height - 10);
    doc.text("Immersify - AI Brand Assistant", 14, doc.internal.pageSize.height - 10);
  }

  if (action === 'preview') {
    window.open(doc.output('bloburl'), '_blank');
  } else {
    doc.save('Immersify_Brand_Report.pdf');
  }
};
