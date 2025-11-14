import React, { useState, useEffect, useRef } from 'react';
import type { Dimensions, CalculationResults, BudgetResult, SavedBudget, CalculationHistoryItem } from './types';
import InputGroup from './components/InputGroup';
import ResultsDisplay from './components/ResultsDisplay';
import SavedBudgetsList from './components/SavedBudgetsList';
import CalculationHistory from './components/HistoryLog';
import Toast from './components/Toast';
import ThemeToggle from './components/ThemeToggle';

const WidthIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
    </svg>
);

const HeightIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 4v4m0 0l-4-4m4 4l4-4m-8 12v4m0 0l-4-4m4 4l4-4m4-4v4m0 0l-4-4m4 4l4-4" />
    </svg>
);

const GapIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 12h16M4 12l4 4m-4-4l4-4m12 4l-4 4m4-4l-4-4M8 6V4h8v2M8 18v2h8v-2" />
    </svg>
);

const MoneyIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414-.336.75-.75.75h-1.5m1.5 0v.375c0 .621-.504 1.125-1.125 1.125h-17.25c-.621 0-1.125-.504-1.125-1.125V6.75m19.5 0v9m-18-9h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v1.5a1.5 1.5 0 001.5 1.5m16.5 0h.75a.75.75 0 01.75.75v.75m0 0v.375c0 .621-.504 1.125-1.125 1.125H3.75c-.621 0-1.125-.504-1.125-1.125V12m18 0v-3.375c0-.621-.504-1.125-1.125-1.125H3.75c-.621 0-1.125-.504-1.125 1.125V12m0 0h18" />
    </svg>
);

const QuantityIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
    </svg>
);

const DescriptionIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

const PaperIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
);

const ColorsIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.47 2.118v-.09A18.324 18.324 0 0112 3.499c5.057 0 9.172 1.574 12 4.292V21h-3.232c-1.385 0-2.583-.54-3.536-1.464a3 3 0 00-4.309-1.025c.159.251.302.51.434.774.32.664.64 1.39.944 2.153m-11.458-9.854a3 3 0 01-1.223-5.052c1.353-1.002 2.92-1.504 4.508-1.504s3.155.502 4.508 1.504a3 3 0 01-1.223 5.052m-3.285 0A3 3 0 006.75 12.5a3 3 0 00-3.285 0z" />
    </svg>
);

const FinishingIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.562L16.25 21.75l-.648-1.188a2.25 2.25 0 01-1.47-1.47l-1.188-.648 1.188-.648a2.25 2.25 0 011.47-1.47l.648-1.188.648 1.188a2.25 2.25 0 011.47 1.47l1.188.648-1.188.648a2.25 2.25 0 01-1.47 1.47z" />
    </svg>
);

const UserIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
);

const PhoneIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
    </svg>
);

const FolderIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
    </svg>
);

const CreditCardIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" >
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15A2.25 2.25 0 002.25 6.75v10.5A2.25 2.25 0 004.5 19.5z" />
    </svg>
);

const SaveIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
    </svg>
);

const UpdateIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M4 9a8 8 0 0114.24-2.76M20 20v-5h-5m0 5a8 8 0 01-14.24-2.76" />
    </svg>
);

const SaveAsNewIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const CancelIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const ClearIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const paperSizes: { [key: string]: { width: string; height: string; name: string } } = {
    'A4': { width: '20', height: '28', name: 'A4 (20x28 cm)' },
    'A3': { width: '28', height: '40', name: 'A3 (28x40 cm)' },
    'SRA3': { width: '31', height: '47', name: 'SRA3 (31x47 cm)' },
    'SRA3_CORTE': { width: '30', height: '46', name: 'SRA3 Corte (30x46 cm)' },
    'VINIL_TRANS': { width: '30', height: '44', name: 'Vinil Trans. (30x44 cm)' },
};

const paperTypes = [
    'Sulfite 75g',
    'Sulfite 90g',
    'Sulfite 180g',
    'Sulfite 240g',
    'Couche 115g',
    'Couche 150g',
    'Couche 250g',
    'Triplex Brilho 250g',
    'Adesivo de Papel',
    'Adesivo Vinil Branco',
    'Adesivo Vinil Transparente',
    'Papel Aspen',
    'Papel Verge',
    'Papel Craft',
    'Outros'
];

const colorOptions = ['4x0', '4x1', '4x4', '1x0', '1x1'];
const paymentOptions = ['A vista', 'PIX', 'Cartão Credito', 'Cartão Debito'];

const finishingOptions = [
    'Nenhum',
    'Laminação Brilho',
    'Laminação Fosca',
    'Corte Personalizado',
    'Furo Tag',
    'Plastificação',
    'Encadernação Espiral',
    'Encadernação Wire-O',
    'Outros'
];

const App: React.FC = () => {
    // State definitions
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        if (typeof window !== 'undefined' && localStorage.getItem('theme')) {
            return localStorage.getItem('theme') as 'light' | 'dark';
        }
        if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    });

    const [objectDimensions, setObjectDimensions] = useState<Dimensions>({ width: '', height: '' });
    const [selectedPaperSize, setSelectedPaperSize] = useState<string>('SRA3_CORTE');
    const [areaDimensions, setAreaDimensions] = useState<Dimensions>({ 
        width: paperSizes['SRA3_CORTE'].width, 
        height: paperSizes['SRA3_CORTE'].height 
    });
    const [gap, setGap] = useState<string>('');
    const [costPerPage, setCostPerPage] = useState<string>('');
    const [desiredQuantity, setDesiredQuantity] = useState<string>('');
    const [extraCost, setExtraCost] = useState<string>('');
    const [jobDescription, setJobDescription] = useState<string>('');
    const [paperType, setPaperType] = useState<string>(paperTypes[0]);
    const [colors, setColors] = useState<string>(colorOptions[0]);
    const [finishing, setFinishing] = useState<string>(finishingOptions[0]);
    const [clientName, setClientName] = useState<string>('');
    const [clientPhone, setClientPhone] = useState<string>('');
    const [clientFolder, setClientFolder] = useState<string>('');
    const [downPayment, setDownPayment] = useState<string>('');
    const [paymentMethod, setPaymentMethod] = useState<string>(paymentOptions[0]);
    const [results, setResults] = useState<CalculationResults | null>(null);
    const [budgetResult, setBudgetResult] = useState<BudgetResult | null>(null);
    const [savedBudgets, setSavedBudgets] = useState<SavedBudget[]>([]);
    const [calculationHistory, setCalculationHistory] = useState<CalculationHistoryItem[]>([]);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);
    const [editingBudgetId, setEditingBudgetId] = useState<string | null>(null);


    const isInitialMount = useRef(true);

    // Theme effect
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        try {
            localStorage.setItem('theme', theme);
        } catch (error) {
            console.error("Failed to save theme to localStorage", error);
        }
    }, [theme]);
    
    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

     useEffect(() => {
        // Load saved budgets
        try {
            const storedBudgets = localStorage.getItem('budgets');
            if (storedBudgets) {
                setSavedBudgets(JSON.parse(storedBudgets));
            }
        } catch (error) {
            console.error("Failed to load budgets from localStorage", error);
        }

        // Load calculation history
        try {
            const storedHistory = localStorage.getItem('calculationHistory');
            if (storedHistory) {
                setCalculationHistory(JSON.parse(storedHistory));
            }
        } catch (error) {
            console.error("Failed to load calculation history from localStorage", error);
        }
        
        // Load current form settings
        try {
            const savedSettings = localStorage.getItem('currentAppSettings');
            if (savedSettings) {
                const settings = JSON.parse(savedSettings);
                setObjectDimensions(settings.objectDimensions || { width: '', height: '' });
                const sizeKey = settings.selectedPaperSize || 'SRA3_CORTE';
                setSelectedPaperSize(sizeKey);
                setAreaDimensions(settings.areaDimensions || paperSizes[sizeKey] || paperSizes['SRA3_CORTE']);
                setGap(settings.gap || '');
                setCostPerPage(settings.costPerPage || '');
                setDesiredQuantity(settings.desiredQuantity || '');
                setExtraCost(settings.extraCost || '');
                setJobDescription(settings.jobDescription || '');
                setPaperType(settings.paperType || paperTypes[0]);
                setColors(settings.colors || colorOptions[0]);
                setFinishing(settings.finishing || finishingOptions[0]);
                setClientName(settings.clientName || '');
                setClientPhone(settings.clientPhone || '');
                setClientFolder(settings.clientFolder || '');
                setDownPayment(settings.downPayment || '');
                setPaymentMethod(settings.paymentMethod || paymentOptions[0]);
            }
        } catch (error) {
            console.error("Failed to load current settings from localStorage", error);
        }
        
        isInitialMount.current = false;
    }, []);

    // Save current settings to localStorage on change
    useEffect(() => {
        if (isInitialMount.current) {
            return;
        }

        const currentSettings = {
            objectDimensions,
            selectedPaperSize,
            areaDimensions,
            gap,
            costPerPage,
            desiredQuantity,
            extraCost,
            jobDescription,
            paperType,
            colors,
            finishing,
            clientName,
            clientPhone,
            clientFolder,
            downPayment,
            paymentMethod,
        };

        try {
            localStorage.setItem('currentAppSettings', JSON.stringify(currentSettings));
        } catch (error) {
            console.error("Failed to save current settings to localStorage", error);
        }
    }, [
        objectDimensions, selectedPaperSize, areaDimensions, gap, costPerPage, desiredQuantity,
        extraCost, jobDescription, paperType, colors, finishing, clientName,
        clientPhone, clientFolder, downPayment, paymentMethod
    ]);

    // Save budgets to localStorage on change
    useEffect(() => {
        if (isInitialMount.current) return;
        try {
            localStorage.setItem('budgets', JSON.stringify(savedBudgets));
        } catch (error) {
            console.error("Failed to save budgets to localStorage", error);
        }
    }, [savedBudgets]);

    // Save calculation history to localStorage on change
    useEffect(() => {
        if (isInitialMount.current) return;
        try {
            localStorage.setItem('calculationHistory', JSON.stringify(calculationHistory));
        } catch (error) {
            console.error("Failed to save calculation history to localStorage", error);
        }
    }, [calculationHistory]);

    const handleObjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setObjectDimensions({ ...objectDimensions, [e.target.name]: e.target.value });
    };

    const handlePaperSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const sizeKey = e.target.value;
        setSelectedPaperSize(sizeKey);
        if (paperSizes[sizeKey]) {
            setAreaDimensions({
                width: paperSizes[sizeKey].width,
                height: paperSizes[sizeKey].height,
            });
        }
    };
    
    const handleGapChange = (e: React.ChangeEvent<HTMLInputElement>) => setGap(e.target.value);
    const handleCostChange = (e: React.ChangeEvent<HTMLInputElement>) => setCostPerPage(e.target.value);
    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => setDesiredQuantity(e.target.value);
    const handleExtraCostChange = (e: React.ChangeEvent<HTMLInputElement>) => setExtraCost(e.target.value);
    const handleJobDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setJobDescription(e.target.value);
    const handlePaperTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => setPaperType(e.target.value);
    const handleColorsChange = (e: React.ChangeEvent<HTMLSelectElement>) => setColors(e.target.value);
    const handleFinishingChange = (e: React.ChangeEvent<HTMLSelectElement>) => setFinishing(e.target.value);
    const handleClientNameChange = (e: React.ChangeEvent<HTMLInputElement>) => setClientName(e.target.value);
    const handleClientFolderChange = (e: React.ChangeEvent<HTMLInputElement>) => setClientFolder(e.target.value);
    const handleDownPaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => setDownPayment(e.target.value);
    const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => setPaymentMethod(e.target.value);

    const handleClientPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '').substring(0, 10);
        if (value.length > 6) {
            value = `(${value.substring(0, 2)}) ${value.substring(2, 6)}-${value.substring(6)}`;
        } else if (value.length > 2) {
            value = `(${value.substring(0, 2)}) ${value.substring(2)}`;
        } else if (value.length > 0) {
            value = `(${value}`;
        }
        setClientPhone(value);
    };

    const handleCalculate = () => {
        const PRECISION = 1000;
        const toInt = (val: string) => {
            if (!val) return 0;
            const num = parseFloat(val.replace(',', '.'));
            return isNaN(num) ? NaN : Math.round(num * PRECISION);
        };

        const objWidth = toInt(objectDimensions.width);
        const objHeight = toInt(objectDimensions.height);
        const areaWidth = toInt(areaDimensions.width);
        const areaHeight = toInt(areaDimensions.height);
        const gapNum = toInt(gap) || 0;

        if (isNaN(objWidth) || isNaN(objHeight) || isNaN(areaWidth) || isNaN(areaHeight) || objWidth <= 0 || objHeight <= 0 || areaWidth <= 0 || areaHeight <= 0) {
            setResults(null);
            setBudgetResult(null);
            return;
        }
        
        const calcFit = (areaDim: number, objDim: number) => {
            if (objDim <= 0) return 0;
            const effectiveObjDim = objDim + gapNum;
            if (effectiveObjDim <= 0) return 0; 
            return Math.floor((areaDim + gapNum) / effectiveObjDim);
        };

        const verticalItemsPerWidth = calcFit(areaWidth, objWidth);
        const verticalItemsPerHeight = calcFit(areaHeight, objHeight);
        const verticalTotal = verticalItemsPerWidth * verticalItemsPerHeight;

        const horizontalItemsPerWidth = calcFit(areaWidth, objHeight);
        const horizontalItemsPerHeight = calcFit(areaHeight, objWidth);
        const horizontalTotal = horizontalItemsPerWidth * horizontalItemsPerHeight;

        let bestOrientation: 'vertical' | 'horizontal' | 'tie' | null = null;
        if (verticalTotal > horizontalTotal) bestOrientation = 'vertical';
        else if (horizontalTotal > verticalTotal) bestOrientation = 'horizontal';
        else if (verticalTotal === horizontalTotal && verticalTotal > 0) bestOrientation = 'tie';

        const currentResults = {
            vertical: { itemsPerWidth: verticalItemsPerWidth, itemsPerHeight: verticalItemsPerHeight, total: verticalTotal },
            horizontal: { itemsPerWidth: horizontalItemsPerWidth, itemsPerHeight: horizontalItemsPerHeight, total: horizontalTotal },
            bestOrientation,
        };
        setResults(currentResults);
        
        const toCents = (val: string) => {
            if (!val) return 0;
            const num = parseFloat(val.replace(',', '.'));
            return isNaN(num) ? 0 : Math.round(num * 100);
        };

        const costInCents = toCents(costPerPage);
        const quantity = parseInt(desiredQuantity, 10);
        const extrasInCents = toCents(extraCost);

        let calculatedBudget: BudgetResult | null = null;
        if (!isNaN(quantity) && quantity > 0) {
            const itemsPerPage = Math.max(currentResults.vertical.total, currentResults.horizontal.total);
            if (itemsPerPage > 0) {
                const totalPages = Math.ceil(quantity / itemsPerPage);
                const subtotalInCents = totalPages * costInCents;
                const totalCostInCents = subtotalInCents + extrasInCents;
                
                calculatedBudget = { 
                    totalPages, 
                    subtotal: subtotalInCents / 100, 
                    extraCost: extrasInCents / 100, 
                    totalCost: totalCostInCents / 100, 
                    itemsPerPage 
                };
            }
        }
        setBudgetResult(calculatedBudget);

        const newHistoryItem: CalculationHistoryItem = {
            id: `hist-${Date.now()}`,
            timestamp: new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).replace(',', ''),
            objectDimensions, selectedPaperSize, areaDimensions, costPerPage, desiredQuantity,
            extraCost, gap, jobDescription, paperType, colors, finishing, clientName,
            clientPhone, clientFolder, downPayment, paymentMethod, 
            results: currentResults,
            budgetResult: calculatedBudget
        };

        const updatedHistory = [newHistoryItem, ...calculationHistory].slice(0, 50);
        setCalculationHistory(updatedHistory);
    };
    
    const handleSaveBudget = () => {
        if (editingBudgetId) {
            // Update existing budget
            const updatedBudgets = savedBudgets.map(budget => {
                if (budget.id === editingBudgetId) {
                    return {
                        id: budget.id,
                        createdAt: budget.createdAt,
                        name: clientName || jobDescription || `Orçamento ${budget.createdAt}`,
                        objectDimensions, selectedPaperSize, areaDimensions, costPerPage, desiredQuantity,
                        extraCost, gap, jobDescription, paperType, colors, finishing, clientName,
                        clientPhone, clientFolder, downPayment, paymentMethod, results, budgetResult,
                    };
                }
                return budget;
            });
            setSavedBudgets(updatedBudgets);
            setToast({ message: 'Orçamento atualizado com sucesso!', type: 'success' });
            setEditingBudgetId(null);
        } else {
            // Create new budget
            const date = new Date();
            const formattedDate = `${date.toLocaleDateString('pt-BR')} ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
            const name = clientName || jobDescription || `Orçamento ${formattedDate}`;
            
            const newBudget: SavedBudget = {
                id: `budget-${Date.now()}`, name, createdAt: formattedDate, objectDimensions,
                selectedPaperSize, areaDimensions, costPerPage, desiredQuantity,
                extraCost, gap, jobDescription, paperType, colors, finishing, clientName,
                clientPhone, clientFolder, downPayment, paymentMethod, results, budgetResult,
            };

            const updatedBudgets = [...savedBudgets, newBudget];
            setSavedBudgets(updatedBudgets);
            setToast({ message: 'Orçamento salvo com sucesso!', type: 'success' });
        }
    };

    const handleSaveAsNew = () => {
        const date = new Date();
        const formattedDate = `${date.toLocaleDateString('pt-BR')} ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
        const name = clientName || jobDescription || `Orçamento ${formattedDate}`;
        
        const newBudget: SavedBudget = {
            id: `budget-${Date.now()}`, name, createdAt: formattedDate, objectDimensions,
            selectedPaperSize, areaDimensions, costPerPage, desiredQuantity,
            extraCost, gap, jobDescription, paperType, colors, finishing, clientName,
            clientPhone, clientFolder, downPayment, paymentMethod, results, budgetResult,
        };

        const updatedBudgets = [...savedBudgets, newBudget];
        setSavedBudgets(updatedBudgets);
        setToast({ message: 'Orçamento salvo como uma nova cópia!', type: 'success' });
        setEditingBudgetId(null);
    };

    const resetForm = () => {
        setObjectDimensions({ width: '', height: '' });
        setSelectedPaperSize('SRA3_CORTE');
        setAreaDimensions({ 
            width: paperSizes['SRA3_CORTE'].width, 
            height: paperSizes['SRA3_CORTE'].height 
        });
        setGap('');
        setCostPerPage('');
        setDesiredQuantity('');
        setExtraCost('');
        setJobDescription('');
        setPaperType(paperTypes[0]);
        setColors(colorOptions[0]);
        setFinishing(finishingOptions[0]);
        setClientName('');
        setClientPhone('');
        setClientFolder('');
        setDownPayment('');
        setPaymentMethod(paymentOptions[0]);
        setResults(null);
        setBudgetResult(null);
    };

    const handleClearForm = () => {
        resetForm();
        setToast({ message: 'Formulário limpo.', type: 'info' });
    };

    const handleCancelEdit = () => {
        resetForm();
        setEditingBudgetId(null);
        setToast({ message: 'Edição cancelada.', type: 'info' });
    };

    const handleLoadBudget = (budgetId: string) => {
        const budgetToLoad = savedBudgets.find(b => b.id === budgetId);
        if (budgetToLoad) {
            setObjectDimensions(budgetToLoad.objectDimensions || { width: '', height: '' });
            setSelectedPaperSize(budgetToLoad.selectedPaperSize || 'SRA3_CORTE');
            setAreaDimensions(budgetToLoad.areaDimensions || paperSizes['SRA3_CORTE']);
            setCostPerPage(budgetToLoad.costPerPage || '');
            setDesiredQuantity(budgetToLoad.desiredQuantity || '');
            setExtraCost(budgetToLoad.extraCost || '');
            setGap(budgetToLoad.gap || '');
            setJobDescription(budgetToLoad.jobDescription || '');
            setPaperType(budgetToLoad.paperType || paperTypes[0]);
            setColors(budgetToLoad.colors || colorOptions[0]);
            setFinishing(budgetToLoad.finishing || finishingOptions[0]);
            setClientName(budgetToLoad.clientName || '');
            setClientPhone(budgetToLoad.clientPhone || '');
            setClientFolder(budgetToLoad.clientFolder || '');
            setDownPayment(budgetToLoad.downPayment || '');
            setPaymentMethod(budgetToLoad.paymentMethod || paymentOptions[0]);
            setResults(budgetToLoad.results || null);
            setBudgetResult(budgetToLoad.budgetResult || null);
            setEditingBudgetId(budgetId);
            setToast({ message: 'Orçamento carregado para edição!', type: 'info' });
        }
    };

    const handleDeleteBudget = (budgetId: string) => {
        const updatedBudgets = savedBudgets.filter(b => b.id !== budgetId);
        setSavedBudgets(updatedBudgets);
    };

    const handleLoadHistory = (historyId: string) => {
        const historyToLoad = calculationHistory.find(h => h.id === historyId);
        if (historyToLoad) {
            setObjectDimensions(historyToLoad.objectDimensions || { width: '', height: '' });
            setSelectedPaperSize(historyToLoad.selectedPaperSize || 'SRA3_CORTE');
            setAreaDimensions(historyToLoad.areaDimensions || paperSizes['SRA3_CORTE']);
            setCostPerPage(historyToLoad.costPerPage || '');
            setDesiredQuantity(historyToLoad.desiredQuantity || '');
            setExtraCost(historyToLoad.extraCost || '');
            setGap(historyToLoad.gap || '');
            setJobDescription(historyToLoad.jobDescription || '');
            setPaperType(historyToLoad.paperType || paperTypes[0]);
            setColors(historyToLoad.colors || colorOptions[0]);
            setFinishing(historyToLoad.finishing || finishingOptions[0]);
            setClientName(historyToLoad.clientName || '');
            setClientPhone(historyToLoad.clientPhone || '');
            setClientFolder(historyToLoad.clientFolder || '');
            setDownPayment(historyToLoad.downPayment || '');
            setPaymentMethod(historyToLoad.paymentMethod || paymentOptions[0]);
            setResults(historyToLoad.results || null);
            setBudgetResult(historyToLoad.budgetResult || null);
            setToast({ message: 'Cálculo do histórico carregado!', type: 'info' });
        }
    };
    
    const handleClearHistory = () => {
        setCalculationHistory([]);
    };
    
    const toCents = (val: string | number | undefined): number => {
        if (val === undefined || val === null) return 0;
        const strVal = String(val).replace(',', '.');
        const num = parseFloat(strVal);
        return isNaN(num) ? 0 : Math.round(num * 100);
    };
    const downPaymentInCents = toCents(downPayment);
    const totalCostInCents = toCents(budgetResult?.totalCost);
    const remainingInCents = totalCostInCents > 0 ? totalCostInCents - downPaymentInCents : 0;
    const remainingValue = remainingInCents / 100;

    const LabelWithTooltip: React.FC<{ htmlFor: string; label: string; tooltip: string; className?: string }> = ({ htmlFor, label, tooltip, className }) => (
        <div className={`flex items-center gap-1.5 ${className}`}>
            <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                {label}
            </label>
            <div className="relative flex items-center group">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-help" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 text-center text-xs text-white bg-slate-800 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 dark:bg-black">
                  {tooltip}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-[6px] border-t-slate-800 dark:border-t-black"></div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 antialiased dark:bg-slate-900 dark:text-slate-200">
            {toast && (
                <Toast 
                    message={toast.message} 
                    type={toast.type} 
                    onClose={() => setToast(null)} 
                />
            )}
            <main className="container mx-auto px-4 py-8 md:py-12 relative">
                <div className="absolute top-4 right-4 z-10">
                    <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
                </div>
                <header className="text-center mb-8 md:mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-50">Calculadora de Encaixe e Orçamento</h1>
                    <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">Otimize o uso do material e calcule os custos de produção.</p>
                </header>

                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                     <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-md dark:bg-slate-800">
                        <h2 className="text-2xl font-semibold text-slate-700 border-b pb-3 mb-6 dark:text-slate-300 dark:border-slate-700">Tamanho ou Formato</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-6 items-end">
                            <InputGroup label="Largura do Objeto (cm)" name="width" value={objectDimensions.width} onChange={handleObjectChange} placeholder="ex: 10" icon={<WidthIcon className="w-5 h-5 text-slate-400" />} tooltip="Insira a largura do item individual em centímetros. Use vírgula ou ponto para decimais. Ex: 10,5" />
                            <InputGroup label="Altura do Objeto (cm)" name="height" value={objectDimensions.height} onChange={handleObjectChange} placeholder="ex: 5" icon={<HeightIcon className="w-5 h-5 text-slate-400" />} tooltip="Insira a altura do item individual em centímetros. Use vírgula ou ponto para decimais. Ex: 5,0" />
                            <InputGroup label="Sangria / Espaço (cm)" name="gap" value={gap} onChange={handleGapChange} placeholder="ex: 0.3" icon={<GapIcon className="w-5 h-5 text-slate-400" />} tooltip="Insira o espaçamento entre os itens em centímetros. Essencial para o corte. Ex: 0.3" />
                            <div>
                                <LabelWithTooltip htmlFor="paper-size" label="Tamanho do Papel" tooltip="Selecione o formato do papel a ser usado para a impressão. As medidas são exibidas em centímetros." className="mb-1" />
                                <div className="relative rounded-md shadow-sm">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><PaperIcon className="w-5 h-5 text-slate-400" /></div>
                                    <select id="paper-size" name="paper-size" className="block w-full rounded-md border-slate-300 pl-10 py-2 focus:border-sky-500 focus:ring-sky-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200" value={selectedPaperSize} onChange={handlePaperSizeChange}>
                                        {Object.entries(paperSizes).map(([key, { name }]) => (<option key={key} value={key}>{name}</option>))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-xl shadow-md space-y-6 dark:bg-slate-800">
                        <h2 className="text-2xl font-semibold text-slate-700 border-b pb-3 dark:text-slate-300 dark:border-slate-700">Orçamento e Detalhes do Trabalho</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <InputGroup label="Custo por Página (R$)" name="cost" value={costPerPage} onChange={handleCostChange} placeholder="ex: 2.50" icon={<MoneyIcon className="w-5 h-5 text-slate-400" />} tooltip="Insira o custo de impressão de uma única página. Este valor será multiplicado pelo número de páginas necessárias." />
                            <InputGroup label="Quantidade Desejada" name="quantity" value={desiredQuantity} onChange={handleQuantityChange} placeholder="ex: 1000" icon={<QuantityIcon className="w-5 h-5 text-slate-400" />} tooltip="Insira o número total de itens que deseja produzir. Ex: 1000 cartões." />
                            <InputGroup label="Custo Extra (Acabamento, etc)" name="extra" value={extraCost} onChange={handleExtraCostChange} placeholder="ex: 50.00" icon={<MoneyIcon className="w-5 h-5 text-slate-400" />} tooltip="Adicione custos adicionais como laminação, corte especial, arte, etc." />
                            <div>
                                <LabelWithTooltip htmlFor="colors" label="Cores" tooltip="Selecione a configuração de cores da impressão (ex: 4x0 = colorido frente, verso em branco)." className="mb-1" />
                                <div className="relative rounded-md shadow-sm">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><ColorsIcon className="w-5 h-5 text-slate-400" /></div>
                                    <select id="colors" name="colors" className="block w-full rounded-md border-slate-300 pl-10 py-2 focus:border-sky-500 focus:ring-sky-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200" value={colors} onChange={handleColorsChange}>
                                        {colorOptions.map((option) => (<option key={option} value={option}>{option}</option>))}
                                    </select>
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <LabelWithTooltip htmlFor="paper-type" label="Tipo de Papel" tooltip="Escolha o tipo e a gramatura do papel." className="mb-1" />
                                <div className="relative rounded-md shadow-sm">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><PaperIcon className="w-5 h-5 text-slate-400" /></div>
                                    <select id="paper-type" name="paper-type" className="block w-full rounded-md border-slate-300 pl-10 py-2 focus:border-sky-500 focus:ring-sky-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200" value={paperType} onChange={handlePaperTypeChange}>
                                        {paperTypes.map((type) => (<option key={type} value={type}>{type}</option>))}
                                    </select>
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <LabelWithTooltip htmlFor="finishing" label="Acabamento" tooltip="Selecione o tipo de acabamento final para o produto." className="mb-1" />
                                <div className="relative rounded-md shadow-sm">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><FinishingIcon className="w-5 h-5 text-slate-400" /></div>
                                    <select id="finishing" name="finishing" className="block w-full rounded-md border-slate-300 pl-10 py-2 focus:border-sky-500 focus:ring-sky-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200" value={finishing} onChange={handleFinishingChange}>
                                        {finishingOptions.map((option) => (<option key={option} value={option}>{option}</option>))}
                                    </select>
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <LabelWithTooltip htmlFor="job-description" label="Descrição do Trabalho" tooltip="Descreva o trabalho a ser feito. Ex: Cartões de visita para a Loja X. Esta informação será usada nos orçamentos." className="mb-1" />
                                <div className="relative rounded-md shadow-sm">
                                     <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 pt-2"><DescriptionIcon className="w-5 h-5 text-slate-400" /></div>
                                    <textarea id="job-description" name="job-description" rows={3} className="block w-full rounded-md border-slate-300 pl-10 py-2 focus:border-sky-500 focus:ring-sky-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 dark:placeholder-slate-400" placeholder="Ex: Cartões de visita, adesivos..." value={jobDescription} onChange={handleJobDescriptionChange} />
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-xl shadow-md space-y-6 dark:bg-slate-800">
                        <h2 className="text-2xl font-semibold text-slate-700 border-b pb-3 dark:text-slate-300 dark:border-slate-700">Dados do Cliente</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="sm:col-span-2"><InputGroup label="Cliente" name="clientName" value={clientName} onChange={handleClientNameChange} placeholder="Nome do Cliente" icon={<UserIcon className="w-5 h-5 text-slate-400" />} type="text" tooltip="Nome do cliente ou empresa para identificação no orçamento." /></div>
                            <InputGroup label="Telefone" name="clientPhone" value={clientPhone} onChange={handleClientPhoneChange} placeholder="(00) 0000-0000" icon={<PhoneIcon className="w-5 h-5 text-slate-400" />} type="tel" tooltip="Telefone de contato do cliente." />
                            <InputGroup label="Pasta" name="clientFolder" value={clientFolder} onChange={handleClientFolderChange} placeholder="Nome da pasta" icon={<FolderIcon className="w-5 h-5 text-slate-400" />} type="text" tooltip="Nome da pasta onde os arquivos do cliente (arte, etc.) estão salvos no computador."/>
                            <InputGroup label="Valor de Entrada (R$)" name="downPayment" value={downPayment} onChange={handleDownPaymentChange} placeholder="ex: 100.00" icon={<MoneyIcon className="w-5 h-5 text-slate-400" />} tooltip="Valor pago pelo cliente como sinal ou adiantamento." />
                            <div>
                                <LabelWithTooltip htmlFor="remainingValue" label="Valor Restante" tooltip="Valor restante a ser pago pelo cliente (calculado automaticamente)." className="mb-1" />
                                <div className="relative rounded-md shadow-sm">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><MoneyIcon className="w-5 h-5 text-slate-400" /></div>
                                    <input type="text" name="remainingValue" id="remainingValue" value={remainingValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} className="block w-full rounded-md border-slate-300 pl-10 py-2 bg-slate-100 text-slate-500 cursor-not-allowed sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-slate-400" disabled />
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <LabelWithTooltip htmlFor="payment-method" label="Pagamento" tooltip="Forma de pagamento escolhida pelo cliente." className="mb-1" />
                                <div className="relative rounded-md shadow-sm">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><CreditCardIcon className="w-5 h-5 text-slate-400" /></div>
                                    <select id="payment-method" name="payment-method" className="block w-full rounded-md border-slate-300 pl-10 py-2 focus:border-sky-500 focus:ring-sky-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200" value={paymentMethod} onChange={handlePaymentMethodChange}>
                                        {paymentOptions.map((option) => (<option key={option} value={option}>{option}</option>))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-center gap-4 flex-wrap">
                    <button onClick={handleCalculate} className="bg-sky-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all duration-300 text-lg active:scale-[0.98] active:brightness-95">
                        Calcular
                    </button>
                    {editingBudgetId ? (
                        <>
                            <button onClick={handleSaveBudget} className="bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 text-lg flex items-center gap-2 active:scale-[0.98] active:brightness-95" title="Atualizar o orçamento existente">
                                <UpdateIcon className="w-5 h-5" />
                                Atualizar Orçamento
                            </button>
                             <button onClick={handleSaveAsNew} className="bg-sky-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all duration-300 text-lg flex items-center gap-2 active:scale-[0.98] active:brightness-95" title="Salvar as alterações como um novo orçamento">
                                <SaveAsNewIcon className="w-5 h-5" />
                                Salvar como Novo
                            </button>
                            <button onClick={handleCancelEdit} className="bg-slate-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 transition-all duration-300 text-lg flex items-center gap-2 active:scale-[0.98] active:brightness-95" title="Cancelar a edição e limpar o formulário">
                                <CancelIcon className="w-5 h-5" />
                                Cancelar
                            </button>
                        </>
                    ) : (
                        <>
                            <button onClick={handleSaveBudget} className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 text-lg flex items-center gap-2 active:scale-[0.98] active:brightness-95" title="Salvar os dados atuais como um novo orçamento">
                                <SaveIcon className="w-5 h-5" />
                                Salvar Orçamento
                            </button>
                            <button onClick={handleClearForm} className="bg-slate-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 transition-all duration-300 text-lg flex items-center gap-2 active:scale-[0.98] active:brightness-95" title="Limpar todos os campos do formulário">
                                <ClearIcon className="w-5 h-5" />
                                Limpar
                            </button>
                        </>
                    )}
                </div>
                
                {results && (
                    <ResultsDisplay 
                        results={results} 
                        budgetResult={budgetResult}
                        jobDescription={jobDescription}
                        paperType={paperType}
                        objectDimensions={{width: parseFloat(objectDimensions.width) || 0, height: parseFloat(objectDimensions.height) || 0}}
                        areaDimensions={{width: parseFloat(areaDimensions.width) || 0, height: parseFloat(areaDimensions.height) || 0}}
                        gap={parseFloat(gap) || 0}
                        desiredQuantity={desiredQuantity}
                        colors={colors}
                        finishing={finishing}
                        clientName={clientName}
                        clientPhone={clientPhone}
                        clientFolder={clientFolder}
                        paymentMethod={paymentMethod}
                        downPayment={downPayment}
                        remainingValue={remainingValue}
                    />
                )}
                
                <div className="max-w-4xl mx-auto mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                    <SavedBudgetsList budgets={savedBudgets} onLoad={handleLoadBudget} onDelete={handleDeleteBudget} />
                    <CalculationHistory 
                        history={calculationHistory} 
                        onLoad={handleLoadHistory} 
                        onClear={handleClearHistory} 
                    />
                </div>
            </main>
        </div>
    );
};

export default App;