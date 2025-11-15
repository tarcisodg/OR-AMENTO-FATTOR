import React, { useState, useRef } from 'react';
import type { CalculationResults, BudgetResult } from '../types';
import VisualizationGrid from './VisualizationGrid';
import PrintableOrder from './PrintableOrder';

// @ts-ignore
const { jsPDF } = window.jspdf;
// @ts-ignore
declare const html2canvas: any;


interface ResultsDisplayProps {
  results: CalculationResults;
  budgetResult: BudgetResult | null;
  jobDescription: string;
  paperType: string;
  objectDimensions: { width: number, height: number };
  areaDimensions: { width: number, height: number };
  gap: number;
  desiredQuantity: string;
  colors: string;
  finishing: string;
  clientName: string;
  clientPhone: string;
  clientFolder: string;
  paymentMethod: string;
  downPayment: string;
  remainingValue: number;
}

const BestFitBadge: React.FC = () => (
    <span className="absolute -top-3 -right-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
        MELHOR OPÇÃO
    </span>
);

const TieBadge: React.FC = () => (
    <span className="absolute -top-3 -right-3 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
        EMPATE
    </span>
);

const CopyIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const CloseIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const PrintIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H7a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm2-9V5a2 2 0 012-2h2a2 2 0 012 2v3" />
    </svg>
);

const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

const FattorprintLogo: React.FC<{ className?: string, isPrint?: boolean }> = ({ className, isPrint }) => {
    const orange = "#F26522";
    const blue = "#0F2D4A";
    const fontFamily = isPrint ? "'Helvetica', 'Arial', sans-serif" : "'Inter', sans-serif";

    return (
        <svg
            viewBox="0 0 380 160"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-label="Fattorprint Gráfica Digital Logo"
        >
            <path d="M0 0 H380 V80 C350 70 340 80 310 80 S290 70 260 70 S230 80 200 80 S170 70 140 70 S110 80 80 80 S50 70 20 70 C10 70 0 80 0 80 Z" fill={orange}/>
            <text x="190" y="110" fontFamily={fontFamily} fontSize="48" fontWeight="800" fill={blue} textAnchor="middle">
                FATTORPRINT
            </text>
            <text x="190" y="145" fontFamily={fontFamily} fontSize="24" fontWeight="500" fill={blue} textAnchor="middle">
                GRÁFICA DIGITAL
            </text>
        </svg>
    );
};

const MoneyIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414-.336.75-.75.75h-1.5m1.5 0v.375c0 .621-.504 1.125-1.125 1.125h-17.25c-.621 0-1.125-.504-1.125-1.125V6.75m19.5 0v9m-18-9h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v1.5a1.5 1.5 0 001.5 1.5m16.5 0h.75a.75.75 0 01.75.75v.75m0 0v.375c0 .621-.504 1.125-1.125 1.125H3.75c-.621 0-1.125-.504-1.125-1.125V12m18 0v-3.375c0-.621-.504-1.125-1.125-1.125H3.75c-.621 0-1.125-.504-1.125 1.125V12m0 0h18" />
    </svg>
);

const FinishingIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.562L16.25 21.75l-.648-1.188a2.25 2.25 0 01-1.47-1.47l-1.188-.648 1.188-.648a2.25 2.25 0 011.47-1.47l.648-1.188.648 1.188a2.25 2.25 0 011.47 1.47l1.188.648-1.188.648a2.25 2.25 0 01-1.47 1.47z" />
    </svg>
);


const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ 
    results, 
    budgetResult, 
    jobDescription, 
    paperType, 
    objectDimensions, 
    areaDimensions, 
    gap,
    desiredQuantity, 
    colors, 
    finishing,
    clientName,
    clientPhone,
    clientFolder,
    paymentMethod,
    downPayment,
    remainingValue
}) => {
    const { vertical, horizontal, bestOrientation } = results;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
    const [copyButtonText, setCopyButtonText] = useState('Copiar Texto e Fechar');
    const [isDownloading, setIsDownloading] = useState(false);
    const orderModalContentRef = useRef<HTMLDivElement>(null);
    const productionOrderRef = useRef<HTMLDivElement>(null);
    const orderNumber = useRef(`OS-${Date.now().toString().slice(-6)}`);


    const isVerticalBest = bestOrientation === 'vertical';
    const isHorizontalBest = bestOrientation === 'horizontal';
    const isTie = bestOrientation === 'tie';

    const downPaymentValue = parseFloat(downPayment) || 0;
    const budgetText = `Olá, ${clientName || 'tudo bem'}! Conforme sua solicitação, segue orçamento para aprovação.

Impressão de ${desiredQuantity || 'N/A'} ${jobDescription || 'item(ns)'}
Tamanho: ${objectDimensions.width}x${objectDimensions.height} cm
Tipo de Papel: ${paperType}
Cores: ${colors}
Acabamento: ${finishing || 'Não especificado'}

Valor Total: ${budgetResult?.totalCost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'N/A'}
Forma de Pagamento: ${paymentMethod}
${downPaymentValue > 0 ? `Entrada: ${downPaymentValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\n` : ''}${downPaymentValue > 0 ? `Restante: ${remainingValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\n` : ''}
*Observações:*
- Produção 2 a 4 dias úteis
- O corte e cores podem sofrer variação de 5%
- Orçamento válido por 5 dias

*Aguardamos sua confirmação para darmos início à impressão!*`;


    const handleCopyAndClose = () => {
        navigator.clipboard.writeText(budgetText).then(() => {
            setCopyButtonText('Copiado!');
            setTimeout(() => {
                setIsModalOpen(false);
                setCopyButtonText('Copiar Texto e Fechar'); // Reset for next time
            }, 1500);
        }).catch(err => {
            console.error('Falha ao copiar texto: ', err);
            setCopyButtonText('Erro ao copiar');
             setTimeout(() => {
                setCopyButtonText('Copiar Texto e Fechar');
            }, 2000);
        });
    };

    let orientationText = 'Não aplicável';
    if (bestOrientation === 'vertical') {
        orientationText = `Vertical (${vertical.itemsPerWidth} x ${vertical.itemsPerHeight} por folha)`;
    } else if (bestOrientation === 'horizontal') {
        orientationText = `Horizontal (${horizontal.itemsPerWidth} x ${horizontal.itemsPerHeight} por folha)`;
    } else if (bestOrientation === 'tie') {
        orientationText = `Empate (${vertical.total} por folha)`;
    }

    const handleDownloadPdf = async () => {
        if (!orderModalContentRef.current) return;
        
        setIsDownloading(true);

        try {
            const canvas = await html2canvas(orderModalContentRef.current, {
                scale: 2, // Aumenta a resolução da imagem
                useCORS: true,
                backgroundColor: '#ffffff',
                windowWidth: orderModalContentRef.current.scrollWidth,
                windowHeight: orderModalContentRef.current.scrollHeight,
            });
            const imgData = canvas.toDataURL('image/png');
            
            const pdf = new jsPDF({
                orientation: 'p',
                unit: 'mm',
                format: 'a4'
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            
            const imgProps= pdf.getImageProperties(imgData);
            const ratio = imgProps.height / imgProps.width;

            let imgWidth = pdfWidth - 20; // 10mm margem
            let imgHeight = imgWidth * ratio;
            
            if (imgHeight > pdfHeight - 20) {
                imgHeight = pdfHeight - 20;
                imgWidth = imgHeight / ratio;
            }

            const x = (pdfWidth - imgWidth) / 2;
            const y = 10;
            
            pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
            pdf.save(`os_${clientName.replace(/\s/g, '_') || orderNumber.current}.pdf`);

        } catch (error) {
            console.error("Erro ao gerar PDF:", error);
            alert("Ocorreu um erro ao gerar o PDF. Tente novamente.");
        } finally {
            setIsDownloading(false);
        }
    };

    const handlePrint = () => {
        if (!orderModalContentRef.current) return;

        const printWindow = window.open('', '_blank', 'height=800,width=800');
        if (!printWindow) {
            alert('Por favor, permita pop-ups para este site para poder imprimir.');
            return;
        }

        const contentToPrint = orderModalContentRef.current.outerHTML;
        
        printWindow.document.write(`
            <html>
                <head>
                    <title>Ordem de Serviço</title>
                    <script src="https://cdn.tailwindcss.com"></script>
                    <link rel="stylesheet" href="https://rsms.me/inter/inter.css">
                    <style>
                        body {
                           font-family: 'Inter', sans-serif;
                           -webkit-print-color-adjust: exact !important;
                           color-adjust: exact !important;
                        }
                        @page {
                            size: A4;
                            margin: 1cm;
                        }
                    </style>
                </head>
                <body>
                    ${contentToPrint}
                </body>
            </html>
        `);

        printWindow.document.close();

        setTimeout(() => {
            printWindow.focus();
            printWindow.print();
            printWindow.close();
        }, 1000);
    };
    
    const handlePrintProductionOrder = () => {
        if (!productionOrderRef.current) return;

        const printWindow = window.open('', '_blank', 'height=800,width=800');
        if (!printWindow) {
            alert('Por favor, permita pop-ups para este site para poder imprimir.');
            return;
        }

        const contentToPrint = productionOrderRef.current.innerHTML;
        
        printWindow.document.write(`
            <html>
                <head>
                    <title>Ordem de Produção</title>
                    <script src="https://cdn.tailwindcss.com"></script>
                     <link rel="stylesheet" href="https://rsms.me/inter/inter.css">
                    <style>
                        body {
                           font-family: 'Inter', sans-serif;
                           -webkit-print-color-adjust: exact !important;
                           color-adjust: exact !important;
                        }
                        @page {
                            size: A4;
                            margin: 1.5cm;
                        }
                    </style>
                </head>
                <body class="bg-white">
                    ${contentToPrint}
                </body>
            </html>
        `);

        printWindow.document.close();

        setTimeout(() => {
            printWindow.focus();
            printWindow.print();
            printWindow.close();
        }, 1000);
    };


    return (
        <>
        <div className="mt-12">
            <h2 className="text-3xl font-bold text-center text-slate-800 mb-8 dark:text-slate-200">Resultados</h2>

            {budgetResult && (
              <>
                <div className="max-w-3xl mx-auto bg-sky-50 p-6 rounded-xl shadow-md mb-8 border border-sky-200 dark:bg-sky-900/20 dark:border-sky-800">
                    <h3 className="text-xl font-semibold text-sky-800 mb-4 text-center dark:text-sky-300">Detalhes da Produção</h3>
                     <div className="space-y-3 text-lg">
                        <div className="flex justify-between items-center">
                            <span className="text-slate-600 dark:text-slate-400">Páginas necessárias:</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200">{budgetResult.totalPages}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-600 dark:text-slate-400">Itens por página (melhor encaixe):</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200">{budgetResult.itemsPerPage}</span>
                        </div>
                    </div>
                </div>

                <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-lg border-2 border-sky-500 mb-8 dark:bg-slate-800/50 dark:border-sky-700">
                    <h3 className="text-2xl font-semibold text-sky-700 mb-4 text-center dark:text-sky-400">Resumo do Orçamento</h3>
                    
                    <div className="mb-4 border-b border-slate-200 pb-4 space-y-3 dark:border-slate-700">
                        {jobDescription && (
                            <div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Descrição do Trabalho</p>
                                <p className="text-slate-700 whitespace-pre-wrap dark:text-slate-300">{jobDescription}</p>
                            </div>
                        )}
                         {paperType && (
                            <div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Tipo de Papel</p>
                                <p className="text-slate-700 font-semibold dark:text-slate-300">{paperType}</p>
                            </div>
                        )}
                    </div>
                    
                    <div className="space-y-4">
                        <div className="flex items-center justify-between text-lg">
                            <div className="flex items-center text-slate-600 dark:text-slate-400">
                                <MoneyIcon className="w-5 h-5 mr-2 text-slate-400" />
                                <span>Subtotal (impressão):</span>
                            </div>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{budgetResult.subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                        </div>
                        <div className="flex items-center justify-between text-lg">
                             <div className="flex items-center text-slate-600 dark:text-slate-400">
                                <FinishingIcon className="w-5 h-5 mr-2 text-slate-400" />
                                <span>Custo extra:</span>
                            </div>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{budgetResult.extraCost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                        </div>
                         <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4 flex justify-between items-center dark:bg-green-900/20 dark:border-green-800">
                            <span className="text-xl font-bold text-green-800 dark:text-green-300">Custo Total:</span>
                            <span className="text-3xl font-extrabold text-green-700 dark:text-green-400">
                                {budgetResult.totalCost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </span>
                        </div>
                    </div>
                    <div className="mt-8 flex justify-center flex-wrap gap-4">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-slate-100 text-slate-800 font-semibold py-2 px-5 rounded-lg shadow hover:bg-slate-200 transition-all duration-300 flex items-center justify-center w-full sm:w-auto dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                        >
                            <CopyIcon className="w-5 h-5 mr-2" />
                            Copiar Orçamento
                        </button>
                         <button
                            onClick={handlePrintProductionOrder}
                            className="bg-slate-700 text-white font-semibold py-2 px-5 rounded-lg shadow hover:bg-slate-800 transition-all duration-300 flex items-center justify-center w-full sm:w-auto dark:bg-slate-600 dark:hover:bg-slate-500"
                        >
                            <PrintIcon className="w-5 h-5 mr-2" />
                            Imprimir Produção
                        </button>
                        <button
                            onClick={() => setIsOrderModalOpen(true)}
                            className="bg-sky-600 text-white font-semibold py-2 px-5 rounded-lg shadow hover:bg-sky-700 transition-all duration-300 flex items-center justify-center w-full sm:w-auto"
                        >
                            <PrintIcon className="w-5 h-5 mr-2" />
                            Ordem de Serviço
                        </button>
                    </div>
                </div>
              </>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Vertical Result Card */}
                <div className="relative bg-white p-6 rounded-xl shadow-lg dark:bg-slate-800/50">
                    {isVerticalBest && <BestFitBadge />}
                    {isTie && <TieBadge />}
                    <h3 className="text-2xl font-semibold text-sky-700 mb-4 dark:text-sky-400">Orientação Vertical</h3>
                    <div className="text-center mb-6">
                        <p className="text-6xl font-bold text-slate-800 dark:text-slate-100">{vertical.total}</p>
                        <p className="text-slate-500 dark:text-slate-400">objetos</p>
                    </div>
                    <p className="text-sm text-slate-600 text-center mb-4 dark:text-slate-400">({vertical.itemsPerWidth} na largura x {vertical.itemsPerHeight} na altura)</p>
                    <VisualizationGrid 
                        area={areaDimensions}
                        object={objectDimensions}
                        fitResult={vertical}
                        gap={gap}
                        isBestFit={isVerticalBest || isTie}
                    />
                </div>

                {/* Horizontal Result Card */}
                <div className="relative bg-white p-6 rounded-xl shadow-lg dark:bg-slate-800/50">
                    {isHorizontalBest && <BestFitBadge />}
                    {isTie && <TieBadge />}
                    <h3 className="text-2xl font-semibold text-sky-700 mb-4 dark:text-sky-400">Orientação Horizontal</h3>
                     <div className="text-center mb-6">
                        <p className="text-6xl font-bold text-slate-800 dark:text-slate-100">{horizontal.total}</p>
                        <p className="text-slate-500 dark:text-slate-400">objetos</p>
                    </div>
                    <p className="text-sm text-slate-600 text-center mb-4 dark:text-slate-400">({horizontal.itemsPerWidth} na largura x {horizontal.itemsPerHeight} na altura)</p>
                    <VisualizationGrid 
                        area={areaDimensions}
                        object={{width: objectDimensions.height, height: objectDimensions.width}} // Rotated
                        fitResult={horizontal}
                        gap={gap}
                        isBestFit={isHorizontalBest || isTie}
                    />
                </div>
            </div>

            {isModalOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 transition-opacity duration-300"
                    onClick={() => setIsModalOpen(false)}
                >
                    <div 
                        className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg relative transform transition-all duration-300 scale-95 dark:bg-slate-900"
                        onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside
                        style={{transform: 'scale(1)'}}
                    >
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-3 right-3 text-slate-400 hover:text-slate-800 p-1 rounded-full dark:hover:text-slate-200"
                            aria-label="Fechar modal"
                        >
                           <CloseIcon className="w-6 h-6" />
                        </button>
                        <h3 className="text-xl font-semibold text-slate-800 mb-4 dark:text-slate-200">Orçamento para Cliente</h3>
                        <div className="bg-slate-50 p-4 rounded-md border border-slate-200 mb-6 max-h-60 overflow-y-auto dark:bg-slate-800 dark:border-slate-700">
                            <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans dark:text-slate-300">{budgetText}</pre>
                        </div>
                        <button
                            onClick={handleCopyAndClose}
                            className="w-full bg-sky-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-sky-700 transition-all duration-300 flex items-center justify-center"
                        >
                            <CopyIcon className="w-5 h-5 mr-2" />
                            {copyButtonText}
                        </button>
                    </div>
                </div>
            )}

            {isOrderModalOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-60 z-[100] flex justify-center items-center p-4 transition-opacity duration-300"
                    onClick={() => setIsOrderModalOpen(false)}
                >
                    <div 
                        className="bg-slate-100 rounded-xl shadow-2xl p-4 sm:p-6 w-full max-w-4xl relative transform transition-all duration-300 scale-95 flex flex-col max-h-[90vh] dark:bg-slate-900"
                        onClick={(e) => e.stopPropagation()}
                        style={{transform: 'scale(1)'}}
                    >
                        <div className="flex-shrink-0 flex justify-between items-center mb-4">
                             <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">Visualização da Ordem de Serviço</h3>
                             <button
                                onClick={() => setIsOrderModalOpen(false)}
                                className="text-slate-400 hover:text-slate-800 p-1 rounded-full z-10 dark:hover:text-slate-200"
                                aria-label="Fechar modal"
                            >
                               <CloseIcon className="w-6 h-6" />
                            </button>
                        </div>
                       
                        <div className="flex-grow overflow-y-auto bg-white shadow-inner p-2">
                             <div ref={orderModalContentRef} className="p-10 bg-white font-sans text-slate-800 text-sm" id="printable-order">
                                <header className="flex justify-between items-start pb-6 mb-8 border-b border-slate-200">
                                    <div className="flex items-center gap-5">
                                        <FattorprintLogo className="w-40" isPrint={true} />
                                        <div>
                                            <p className="text-slate-500 mt-1">Av. Inglaterra, 603 B - Centro - Cambé/PR</p>
                                            <p className="text-slate-500">(43) 3253-9039 / 99601-1313</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <h2 className="text-2xl font-bold text-sky-600">ORDEM DE SERVIÇO</h2>
                                        <p className="text-lg text-slate-600 mt-1 font-mono">#{orderNumber.current}</p>
                                        <p className="text-sm text-slate-500">Data: {new Date().toLocaleDateString('pt-BR')}</p>
                                    </div>
                                </header>

                                <main className="grid grid-cols-2 gap-x-12">
                                    <div className="space-y-8">
                                        <section>
                                            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">PARA</h3>
                                            <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                                                <p className="font-bold text-lg text-slate-800">{clientName || 'Não especificado'}</p>
                                                <p className="text-slate-600">{clientPhone || 'Não especificado'}</p>
                                                <p className="text-slate-600">Pasta: {clientFolder || 'Não especificado'}</p>
                                            </div>
                                        </section>
                                        <section>
                                            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">FINANCEIRO</h3>
                                            <div className="border border-slate-200 rounded-lg p-4">
                                                <table className="w-full">
                                                    <tbody>
                                                        <tr className="border-b border-slate-100"><td className="py-2 text-slate-600">Pagamento:</td><td className="py-2 text-right font-medium">{paymentMethod}</td></tr>
                                                        <tr className="border-b border-slate-100"><td className="py-2 text-slate-600">Entrada:</td><td className="py-2 text-right font-medium">{(parseFloat(downPayment) || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td></tr>
                                                        <tr><td className="py-2 text-slate-600">Restante:</td><td className="py-2 text-right font-medium">{remainingValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td></tr>
                                                    </tbody>
                                                </table>
                                                <div className="mt-4 pt-4 border-t-2 border-slate-300 flex justify-between items-baseline">
                                                    <span className="font-bold text-base text-slate-800">Valor Total:</span>
                                                    <span className="font-bold text-green-600 text-2xl">{budgetResult?.totalCost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                                                </div>
                                            </div>
                                        </section>
                                    </div>

                                    <div className="space-y-8">
                                        <section>
                                            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">DETALHES DO PEDIDO</h3>
                                            <div className="border border-slate-200 rounded-lg p-4">
                                                <div className="mb-4">
                                                    <p className="text-xs text-slate-500">DESCRIÇÃO DO TRABALHO</p>
                                                    <p className="font-semibold text-base">{jobDescription || 'Não especificado'}</p>
                                                </div>
                                                <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
                                                    <div><dt className="text-xs text-slate-500">QUANTIDADE</dt><dd className="font-medium">{desiredQuantity} un</dd></div>
                                                    <div><dt className="text-xs text-slate-500">TAMANHO</dt><dd className="font-medium">{objectDimensions.width} x {objectDimensions.height} cm</dd></div>
                                                    <div><dt className="text-xs text-slate-500">PAPEL</dt><dd className="font-medium">{paperType}</dd></div>
                                                    <div><dt className="text-xs text-slate-500">CORES</dt><dd className="font-medium">{colors}</dd></div>
                                                    <div className="col-span-2"><dt className="text-xs text-slate-500">ACABAMENTO</dt><dd className="font-medium">{finishing || 'Nenhum'}</dd></div>
                                                </dl>
                                            </div>
                                        </section>
                                        
                                        <section>
                                            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">PRODUÇÃO</h3>
                                            <div className="border border-slate-200 rounded-lg p-4 grid grid-cols-2 gap-6">
                                                <div>
                                                    <p className="text-xs text-slate-500">PÁGINAS NECESSÁRIAS</p>
                                                    <p className="font-bold text-xl text-sky-600">{budgetResult?.totalPages || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-500">ORIENTAÇÃO IDEAL</p>
                                                    <p className="font-semibold text-base text-green-600">{orientationText}</p>
                                                </div>
                                            </div>
                                        </section>
                                    </div>
                                </main>

                                <footer className="mt-16 pt-8 border-t border-slate-200 text-center">
                                    <p className="mb-10 text-slate-600">Declaro que conferi e aprovo as informações contidas nesta Ordem de Serviço.</p>
                                    <div className="w-1/2 mx-auto border-b border-slate-400 mb-2"></div>
                                    <p className="text-sm font-semibold text-slate-800">Assinatura do Cliente</p>
                                    <p className="mt-8 text-xs text-slate-500">Agradecemos a preferência!</p>
                                </footer>
                            </div>
                        </div>

                        <div className="flex-shrink-0 mt-6 flex flex-col sm:flex-row justify-end gap-3">
                             <button
                                onClick={handleDownloadPdf}
                                disabled={isDownloading}
                                className="bg-sky-600 text-white font-semibold py-2 px-5 rounded-lg shadow hover:bg-sky-700 transition-all duration-300 flex items-center justify-center disabled:bg-sky-300 disabled:cursor-not-allowed"
                            >
                                <DownloadIcon className="w-5 h-5 mr-2" />
                                {isDownloading ? 'Baixando...' : 'Baixar em PDF'}
                            </button>
                             <button
                                onClick={handlePrint}
                                className="bg-slate-700 text-white font-semibold py-2 px-5 rounded-lg shadow hover:bg-slate-800 transition-all duration-300 flex items-center justify-center dark:bg-slate-600 dark:hover:bg-slate-500"
                            >
                                <PrintIcon className="w-5 h-5 mr-2" />
                                Imprimir
                            </button>
                             <button
                                onClick={() => setIsOrderModalOpen(false)}
                                className="bg-slate-200 text-slate-800 font-semibold py-2 px-5 rounded-lg shadow-sm hover:bg-slate-300 transition-all duration-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
        <div className="hidden">
            <div ref={productionOrderRef}>
                <PrintableOrder
                  jobDescription={jobDescription}
                  paperType={paperType}
                  desiredQuantity={desiredQuantity}
                  totalPages={budgetResult?.totalPages || 0}
                  itemsPerPage={budgetResult?.itemsPerPage || 0}
                  bestOrientation={results.bestOrientation}
                  objectDimensions={objectDimensions}
                  areaDimensions={areaDimensions}
                  verticalFit={results.vertical}
                  horizontalFit={results.horizontal}
                />
            </div>
        </div>
        </>
    );
};

export default ResultsDisplay;