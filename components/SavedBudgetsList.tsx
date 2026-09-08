import React from 'react';
import type { SavedBudget } from '../types';
import { generateCustomerBudgetPdf } from '../utils/generateBudgetPdf';

const LoadIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M4 9a8 8 0 0114.24-2.76M20 20v-5h-5m0 5a8 8 0 01-14.24-2.76" />
    </svg>
);

const DeleteIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const PdfIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 15h6m-6 3h3" />
    </svg>
);

interface SavedBudgetsListProps {
  budgets: SavedBudget[];
  onLoad: (id: string) => void;
  onDelete: (id: string) => void;
}

const SavedBudgetsList: React.FC<SavedBudgetsListProps> = ({ budgets, onLoad, onDelete }) => {
  const handleExportPdf = (budget: SavedBudget) => {
    const isBanner = budget.budgetType === 'banner_adesivo';
    const dimensionsText = isBanner 
        ? `${budget.objectDimensions.width} × ${budget.objectDimensions.height}`
        : `${budget.objectDimensions.width} × ${budget.objectDimensions.height} cm`;
    
    generateCustomerBudgetPdf({
        title: isBanner ? 'Orçamento - Banner e Adesivos' : 'Orçamento - Impressão Gráfica',
        clientName: budget.clientName,
        clientPhone: budget.clientPhone,
        jobDescription: budget.jobDescription || budget.name,
        dimensionsText,
        quantityText: `${budget.desiredQuantity || '1'} un`,
        material: isBanner ? budget.paperType || 'Comunicação Visual' : budget.paperType,
        colors: budget.colors && budget.colors !== 'Não especificado' ? budget.colors : undefined,
        finishing: budget.finishing && budget.finishing !== 'Não especificado' && budget.finishing !== 'Nenhum' ? budget.finishing : undefined,
        subtotal: budget.budgetResult?.subtotal,
        discount: budget.budgetResult?.discount,
        totalCost: budget.budgetResult?.totalCost || 0,
        paymentMethod: budget.paymentMethod,
        downPayment: parseFloat(budget.downPayment) || 0,
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md dark:bg-slate-800 flex flex-col h-full">
        <h2 className="text-2xl font-semibold text-slate-700 border-b pb-3 mb-6 dark:text-slate-300 dark:border-slate-700 flex-shrink-0">Orçamentos Salvos</h2>
        {budgets.length > 0 ? (
            <ul className="space-y-4 max-h-[28rem] overflow-y-auto pr-2 -mr-2">
                {budgets.map((budget) => (
                    <li key={budget.id} className="flex items-start sm:items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:shadow-sm transition-shadow dark:bg-slate-700/50 dark:border-slate-700 gap-4">
                        <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                                <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">{budget.name}</p>
                                {budget.budgetType === 'banner_adesivo' ? (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200 dark:border-purple-800/50 select-none">
                                        M² (Com. Visual)
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-sky-100 text-sky-800 dark:bg-sky-950/40 dark:text-sky-300 border border-sky-200 dark:border-sky-800/50 select-none">
                                        Encaixe de Folhas
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Salvo em: {budget.createdAt}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => handleExportPdf(budget)} 
                                className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-full transition-colors dark:text-emerald-400 dark:hover:bg-emerald-900/50"
                                title="Exportar PDF do Orçamento"
                                aria-label={`Exportar PDF do orçamento ${budget.name}`}
                            >
                                <PdfIcon className="w-5 h-5" />
                            </button>
                            <button 
                                onClick={() => onLoad(budget.id)} 
                                className="p-2 text-sky-600 hover:bg-sky-100 rounded-full transition-colors dark:text-sky-400 dark:hover:bg-sky-900/50"
                                title="Carregar Orçamento"
                                aria-label={`Carregar orçamento ${budget.name}`}
                            >
                                <LoadIcon className="w-5 h-5" />
                            </button>
                            <button 
                                onClick={() => onDelete(budget.id)} 
                                className="p-2 text-red-500 hover:bg-red-100 rounded-full transition-colors dark:text-red-400 dark:hover:bg-red-900/50"
                                title="Excluir Orçamento"
                                aria-label={`Excluir orçamento ${budget.name}`}
                            >
                                <DeleteIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        ) : (
            <div className="flex-grow flex items-center justify-center">
                 <p className="text-slate-500 text-center py-4 dark:text-slate-400">Nenhum orçamento salvo ainda.</p>
            </div>
        )}
    </div>
  );
};

export default SavedBudgetsList;