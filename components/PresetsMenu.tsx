
import React from 'react';
import type { PresetValues } from '../types';

const PrinterIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H7a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm2-9V5a2 2 0 012-2h2a2 2 0 012 2v3" />
    </svg>
);

const BannerIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M20.25 3.75v4.5m0-4.5h-4.5m4.5 0L15 9m-11.25 7.5v4.5m0-4.5h4.5m-4.5 0L9 15m11.25 0v4.5m0-4.5h-4.5m4.5 0L15 15" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5" />
    </svg>
);

const TicketIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-12v.75m0 3v.75m0 3v.75m0 3V18M10.5 6h3m-3 12h3M3.75 6a2.25 2.25 0 00-2.25 2.25v1.5a2.25 2.25 0 002.25 2.25h16.5a2.25 2.25 0 002.25-2.25v-1.5a2.25 2.25 0 00-2.25-2.25H3.75z" />
    </svg>
);

const BookOpenIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
);

const NotebookIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.03 1.125 0 1.131.094 1.976 1.057 1.976 2.192V7.5M8.25 7.5h7.5M8.25 7.5V9m7.5 V9m-7.5 6.75h7.5m-7.5 3h7.5m-7.5-3V15m7.5-3v1.5m0 0V18M10.5 12h3m-3-4.5h3" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h12A2.25 2.25 0 0120.25 6v12A2.25 2.25 0 0118 20.25H6A2.25 2.25 0 013.75 18V6z" />
    </svg>
);

interface Preset {
  id: string;
  label: string;
  icon: React.ReactElement;
  values: PresetValues;
}

const presets: Preset[] = [
    {
        id: 'general_prints',
        label: 'Impressos',
        icon: <PrinterIcon className="w-6 h-6 mb-2" />,
        values: {
            jobDescription: 'Impresso Geral',
            paperType: 'Couche 115g',
            objectDimensions: { width: '10', height: '15' },
            selectedPaperSize: 'SRA3_CORTE',
            finishing: 'Corte',
            colors: '4x0'
        }
    },
    {
        id: 'banners',
        label: 'Banners e Adesivo',
        icon: <BannerIcon className="w-6 h-6 mb-2" />,
        values: {
            jobDescription: 'Banner / Adesivo',
            paperType: 'Adesivo Vinil Branco',
            selectedPaperSize: 'VINIL_TRANS',
            finishing: 'Corte',
            colors: '4x0'
        }
    },
    {
        id: 'raffles',
        label: 'Blocos Rifas',
        icon: <TicketIcon className="w-6 h-6 mb-2" />,
        values: {
            jobDescription: 'Bloco de Rifa',
            paperType: 'Sulfite 75g',
            objectDimensions: { width: '10', height: '5' },
            selectedPaperSize: 'A4',
            finishing: 'Serrilha',
            colors: '1x0'
        }
    },
    {
        id: 'booklets',
        label: 'Apostilas',
        icon: <BookOpenIcon className="w-6 h-6 mb-2" />,
        values: {
            jobDescription: 'Apostila',
            paperType: 'Sulfite 75g',
            objectDimensions: { width: '20', height: '28' },
            selectedPaperSize: 'A4',
            finishing: 'Encadernação Espiral',
            colors: '1x1'
        }
    },
    {
        id: 'notebooks',
        label: 'Cadernos e Agendas',
        icon: <NotebookIcon className="w-6 h-6 mb-2" />,
        values: {
            jobDescription: 'Caderno / Agenda',
            paperType: 'Sulfite 90g',
            objectDimensions: { width: '14', height: '20' },
            selectedPaperSize: 'A4',
            finishing: 'Encadernação Wire-O',
            colors: '1x1'
        }
    }
];

interface PresetsMenuProps {
    onSelectPreset: (values: PresetValues) => void;
}

const PresetsMenu: React.FC<PresetsMenuProps> = ({ onSelectPreset }) => {
    return (
        <div className="md:col-span-2 mb-8 -mt-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {presets.map(preset => (
                    <button
                        key={preset.id}
                        onClick={() => onSelectPreset(preset.values)}
                        className="flex flex-col items-center justify-center p-4 bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-lg hover:bg-sky-50 dark:hover:bg-slate-700/50 hover:border-sky-500 border-2 border-transparent transition-all duration-300 text-center text-sky-700 dark:text-sky-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 dark:focus:ring-offset-slate-900"
                        title={`Carregar modelo para ${preset.label}`}
                    >
                        {preset.icon}
                        <span className="text-sm font-semibold">{preset.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default PresetsMenu;
