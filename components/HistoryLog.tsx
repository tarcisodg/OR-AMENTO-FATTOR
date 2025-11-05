import React from 'react';
import type { CalculationHistoryItem } from '../types';

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


interface CalculationHistoryProps {
  history: CalculationHistoryItem[];
  onLoad: (id: string) => void;
  onClear: () => void;
}

const CalculationHistory: React.FC<CalculationHistoryProps> = ({ history, onLoad, onClear }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md dark:bg-slate-800 flex flex-col h-full">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b pb-3 mb-6 gap-4 dark:border-slate-700 flex-shrink-0">
            <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-300">Histórico de Cálculos</h2>
            <button 
                onClick={onClear} 
                className="flex items-center justify-center gap-2 text-sm font-semibold py-2 px-4 rounded-lg transition-colors duration-200 bg-red-50 text-red-600 hover:bg-red-100 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-800/50 dark:disabled:bg-slate-700/50 dark:disabled:text-slate-500"
                title="Limpar histórico"
                aria-label="Limpar histórico de cálculos"
                disabled={history.length === 0}
            >
                <DeleteIcon className="w-5 h-5" />
                Limpar Histórico
            </button>
        </div>
        {history.length > 0 ? (
            <ul className="space-y-4 max-h-[28rem] overflow-y-auto pr-2 -mr-2">
                {history.map((item) => (
                    <li key={item.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:shadow-sm transition-shadow dark:bg-slate-700/50 dark:border-slate-700">
                        <div>
                            <p className="font-semibold text-slate-800 dark:text-slate-200">
                                {item.jobDescription || `Cálculo de ${item.objectDimensions.width}x${item.objectDimensions.height}cm`}
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Calculado em: {item.timestamp} - Total: <span className="font-medium">{item.budgetResult?.totalCost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) ?? 'N/A'}</span>
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => onLoad(item.id)} 
                                className="p-2 text-sky-600 hover:bg-sky-100 rounded-full transition-colors dark:text-sky-400 dark:hover:bg-sky-900/50"
                                title="Carregar Cálculo"
                                aria-label={`Carregar cálculo de ${item.timestamp}`}
                            >
                                <LoadIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        ) : (
            <div className="flex-grow flex items-center justify-center">
                <p className="text-slate-500 text-center py-4 dark:text-slate-400">Nenhum cálculo no histórico.</p>
            </div>
        )}
    </div>
  );
};

export default CalculationHistory;