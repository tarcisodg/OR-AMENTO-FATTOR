import { jsPDF } from 'jspdf';

export interface CustomerBudgetPdfData {
  title?: string;
  orderNumber?: string;
  date?: string;
  clientName?: string;
  clientPhone?: string;
  jobDescription: string;
  dimensionsText: string;
  quantityText: string;
  material?: string;
  colors?: string;
  finishing?: string;
  subtotal?: number;
  discount?: number;
  totalCost: number;
  paymentMethod?: string;
  downPayment?: number;
  remainingValue?: number;
  observations?: string[];
}

export function generateCustomerBudgetPdf(data: CustomerBudgetPdfData): void {
  // Use jspdf instance
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 18;
  const contentWidth = pageWidth - margin * 2; // 174mm
  const rightEdge = pageWidth - margin;

  let y = margin;

  // 1. Decorative top accent bar
  doc.setFillColor(2, 132, 199); // Sky-600
  doc.rect(0, 0, pageWidth, 5, 'F');

  // 2. Header
  // Left: Document Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(15, 23, 42); // Slate-900
  doc.text('ORÇAMENTO', margin, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(100, 116, 139); // Slate-500
  doc.text('Proposta Comercial para Cliente', margin, y + 14);

  // Right: Meta Information
  const now = new Date();
  const dateStr = data.date || now.toLocaleDateString('pt-BR');
  const orderNum = data.orderNumber || `ORC-${Date.now().toString().slice(-6)}`;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(`Nº: ${orderNum}`, rightEdge, y + 5, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`Emissão: ${dateStr}`, rightEdge, y + 10.5, { align: 'right' });
  doc.text('Validade: 5 dias', rightEdge, y + 15, { align: 'right' });

  y += 22;

  // Divider
  doc.setDrawColor(226, 232, 240); // Slate-200
  doc.setLineWidth(0.5);
  doc.line(margin, y, rightEdge, y);

  y += 7;

  // 3. Client Box (Dados do Cliente)
  const hasClient = Boolean(data.clientName || data.clientPhone);
  doc.setFillColor(248, 250, 252); // Slate-50
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, y, contentWidth, 22, 2.5, 2.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(2, 132, 199); // Sky-600
  doc.text('CLIENTE / DESTINATÁRIO', margin + 5, y + 6);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  const clientDisplayName = data.clientName && data.clientName.trim() ? data.clientName.trim() : 'Cliente';
  doc.text(clientDisplayName, margin + 5, y + 13);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  const phoneText = data.clientPhone && data.clientPhone.trim() ? `WhatsApp / Contato: ${data.clientPhone}` : 'Contato: Não informado';
  doc.text(phoneText, margin + 5, y + 18);

  y += 29;

  // 4. Item / Product Table Section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('DETALHAMENTO DO SERVIÇO', margin, y);

  y += 4;

  // Table Header
  const col1W = 75; // Produto / Descrição
  const col2W = 32; // Formato / Medidas
  const col3W = 40; // Acabamento / Material
  const col4W = 27; // Quantidade

  doc.setFillColor(15, 23, 42); // Slate-900
  doc.rect(margin, y, contentWidth, 8, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text('PRODUTO / SERVIÇO', margin + 4, y + 5.5);
  doc.text('TAMANHO', margin + col1W + 2, y + 5.5);
  doc.text('ACABAMENTO / MAT.', margin + col1W + col2W + 2, y + 5.5);
  doc.text('QTD', margin + col1W + col2W + col3W + 2, y + 5.5);

  y += 8;

  // Table Body Row
  const itemDesc = data.jobDescription && data.jobDescription.trim() ? data.jobDescription.trim() : 'Impressão Gráfica';
  const itemDim = data.dimensionsText || 'Sob consulta';
  
  let itemSpec = data.material || '';
  if (data.finishing && data.finishing !== 'Nenhum') {
    itemSpec = itemSpec ? `${itemSpec} (${data.finishing})` : data.finishing;
  }
  if (data.colors) {
    itemSpec = itemSpec ? `${itemSpec} - ${data.colors}` : data.colors;
  }
  if (!itemSpec) {
    itemSpec = 'Padrão';
  }

  const itemQty = data.quantityText || '1 un';

  // Calculate row height based on text wrapping
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  const descLines = doc.splitTextToSize(itemDesc, col1W - 6);
  const specLines = doc.splitTextToSize(itemSpec, col3W - 4);
  const maxLines = Math.max(descLines.length, specLines.length, 1);
  const rowHeight = Math.max(16, maxLines * 5 + 8);

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.rect(margin, y, contentWidth, rowHeight, 'FD');

  // Print row texts
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.text(descLines, margin + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  doc.text(itemDim, margin + col1W + 2, y + 6);
  doc.text(specLines, margin + col1W + col2W + 2, y + 6);
  
  doc.setFont('helvetica', 'bold');
  doc.text(itemQty, margin + col1W + col2W + col3W + 2, y + 6);

  y += rowHeight + 8;

  // 5. Financial Summary (Sem dados internos, apenas cliente)
  const leftColW = 85;
  const rightColW = 80;
  const summaryBoxX = rightEdge - rightColW;

  // Payment Details (Left side)
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, leftColW, 36, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(2, 132, 199);
  doc.text('CONDIÇÕES DE PAGAMENTO', margin + 4, y + 6.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  const paymentText = data.paymentMethod || 'A combinar';
  doc.text(`Forma: ${paymentText}`, margin + 4, y + 13.5);

  if (data.downPayment && data.downPayment > 0) {
    doc.text(`Entrada (Sinal): R$ ${data.downPayment.toFixed(2).replace('.', ',')}`, margin + 4, y + 20);
    const rem = data.remainingValue !== undefined ? data.remainingValue : Math.max(0, data.totalCost - data.downPayment);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(180, 83, 9); // Amber-700
    doc.text(`Restante na entrega: R$ ${rem.toFixed(2).replace('.', ',')}`, margin + 4, y + 27);
  } else {
    doc.setTextColor(100, 116, 139);
    doc.text('Pagamento integral na aprovação / entrega.', margin + 4, y + 20);
  }

  // Total Summary (Right side)
  doc.setFillColor(240, 253, 244); // Green-50
  doc.setDrawColor(134, 239, 172); // Green-300
  doc.roundedRect(summaryBoxX, y, rightColW, 36, 2, 2, 'FD');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(22, 101, 52); // Green-800

  let rightY = y + 7;
  if (data.discount && data.discount > 0) {
    doc.text('Desconto Especial:', summaryBoxX + 5, rightY);
    doc.text(`- R$ ${data.discount.toFixed(2).replace('.', ',')}`, rightEdge - 5, rightY, { align: 'right' });
    rightY += 6;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(22, 101, 52);
  doc.text('VALOR TOTAL:', summaryBoxX + 5, rightY + 3);

  doc.setFontSize(16);
  doc.setTextColor(21, 128, 61); // Green-700
  const formattedTotal = data.totalCost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  doc.text(formattedTotal, rightEdge - 5, rightY + 11, { align: 'right' });

  y += 44;

  // 6. Observations & Terms for Customer
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, y, contentWidth, 34, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('INFORMAÇÕES E OBSERVAÇÕES IMPORTANTES', margin + 5, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);

  const defaultObs = [
    '• Prazo de produção: 2 a 4 dias úteis após confirmação e aprovação final da arte.',
    '• As tonalidades e corte podem sofrer variação técnica de até 5% a 10% dependendo do lote e da mídia.',
    '• Orçamento válido por 5 dias corridos a partir da data de emissão.',
    '• Arquivos fornecidos pelo cliente devem estar com textos convertidos em curvas e imagens em boa resolução.',
  ];

  const obsList = data.observations && data.observations.length > 0 ? data.observations : defaultObs;
  let obsY = y + 12;
  obsList.slice(0, 4).forEach((obs) => {
    doc.text(obs, margin + 5, obsY);
    obsY += 5;
  });

  y += 44;

  // 7. Signature area & Approval (Aprovação do Cliente)
  const sigLineY = pageHeight - 32;
  doc.setDrawColor(148, 163, 184); // Slate-400
  doc.setLineWidth(0.4);
  doc.line(pageWidth / 2 - 45, sigLineY, pageWidth / 2 + 45, sigLineY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('Assinatura do Cliente / De Acordo', pageWidth / 2, sigLineY + 4, { align: 'center' });

  // 8. Bottom Footer
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, pageHeight - 15, rightEdge, pageHeight - 15);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('Agradecemos a sua preferência! Ficamos à total disposição para produzir o seu pedido.', pageWidth / 2, pageHeight - 10, { align: 'center' });

  // Save the PDF
  const safeClient = clientDisplayName.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
  const filename = `orcamento_${safeClient || 'cliente'}_${orderNum}.pdf`;
  doc.save(filename);
}
