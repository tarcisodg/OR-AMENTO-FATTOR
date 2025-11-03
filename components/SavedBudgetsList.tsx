import React from 'react';
import type { SavedBudget } from '../types';

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

interface SavedBudgetsListProps {
  budgets: SavedBudget[];
  onLoad: (id: string) => void;
  onDelete: (id: string) => void;
}

const SavedBudgetsList: React.FC<SavedBudgetsListProps> = ({ budgets, onLoad, onDelete }) => {
  return (
    <div className="max-w-4xl mx-auto mt-12">
        <div className="bg-white p-6 rounded-xl shadow-md dark:bg-slate-800">
            <h2 className="text-2xl font-semibold text-slate-700 border-b pb-3 mb-6 dark:text-slate-300 dark:border-slate-700">Orçamentos Salvos</h2>
            {budgets.length > 0 ? (
                <ul className="space-y-4 max-h-96 overflow-y-auto pr-2">
                    {budgets.map((budget) => (
                        <li key={budget.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:shadow-sm transition-shadow dark:bg-slate-700/50 dark:border-slate-700">
                            <div>
                                <p className="font-semibold text-slate-800 dark:text-slate-200">{budget.name}</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Salvo em: {budget.createdAt}</p>
                            </div>
                            <div className="flex items-center gap-2">
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
                <p className="text-slate-500 text-center py-4 dark:text-slate-400">Nenhum orçamento salvo ainda.</p>
            )}
        </div>
    </div>
  );
};

export default SavedBudgetsList;