import React, { useState, useEffect, useRef } from 'react';
import type { SavedBudget, CalculationHistoryItem, Dimensions } from '../types';
import InputGroup from './InputGroup';

// @ts-ignore
const { jsPDF } = window.jspdf;

interface BannerAdesivoModuleProps {
  editingBudget: SavedBudget | null;
  onSaveBudget: (budget: SavedBudget) => void;
  onAddHistory: (item: CalculationHistoryItem) => void;
  onCancelEdit: () => void;
  setToast: (toast: { message: string; type: 'success' | 'info' } | null) => void;
  isMac: boolean;
}

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

const MoneyIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414-.336.75-.75.75h-1.5m1.5 0v.375c0 .621-.504 1.125-1.125 1.125h-17.25c-.621 0-1.125-.504-1.125-1.125V6.75m19.5 0v9m-18-9h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v1.5a1.5 1.5 0 001.5 1.5m16.5 0h.75a.75.75 0 01.75.75v.75m0 0v.375c0 .621-.504 1.125-1.125 1.125H3.75c-.621 0-1.125-.504-1.125-1.125V12m18 0v-3.375c0-.621-.504-1.125-1.125-1.125H3.75c-.621 0-1.125-.504-1.125 1.125V12m0 0h18" />
    </svg>
);

const DiscountIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
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

const MediaIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.008 1.24l.885 1.77a2.25 2.25 0 002.007 1.24h1.98a2.25 2.25 0 002.007-1.24l.885-1.77a2.25 2.25 0 012.007-1.24h3.86m-18 0h18" />
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
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15a2.25 2.25 0 012.25 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15a2.25 2.25 0 002.25-2.25V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
    </svg>
);

const CreditCardIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 6.75v10.5a2.25 2.25 0 002.25 2.25z" />
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

const CopyIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const PrintIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H7a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm2-9V5a2 2 0 012-2h2a2 2 0 012 2v3" />
    </svg>
);

const FattorprintLogo: React.FC<{ className?: string, isPrint?: boolean }> = ({ className, isPrint }) => {
    const orange = "#F26522";
    const blue = "#0F2D4A";
    const fontFamily = isPrint ? "'Helvetica', 'Arial', sans-serif" : "'Inter', sans-serif";

    return (
        <svg viewBox="0 0 380 160" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Fattorprint Gráfica Digital Logo">
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

const mediaTypes = [
  'Banner/lonas',
  'Adesivo Vinil',
  'Adesivo Vinil UV',
  'Adesivo Transparente',
  'Placa PS',
  'Placa PS 1mm',
  'Adesivo Recortado',
  'Outros'
];

const mediaDefaultPrices: { [key: string]: string } = {
  'Banner/lonas': '90,00',
  'Adesivo Vinil': '90,00',
  'Adesivo Vinil UV': '90,00',
  'Adesivo Transparente': '90,00',
  'Placa PS': '90,00',
  'Placa PS 1mm': '90,00',
  'Adesivo Recortado': '90,00',
  'Outros': '90,00'
};

const finishingOptions = [
  'Corte Reto',
  'Corte Personalizado',
  'Ilhos Extras',
  'Lonas S/acabamento',
  'Outros'
];

const paymentOptions = ['A vista', 'PIX', 'Cartão Credito', 'Cartão Debito'];

export const BannerAdesivoModule: React.FC<BannerAdesivoModuleProps> = ({
  editingBudget,
  onSaveBudget,
  onAddHistory,
  onCancelEdit,
  setToast,
  isMac
}) => {
  // Core state - Lado 1 (Largura), Lado 2 (Altura), Valor de Venda (por M²) e Quantidade
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [desiredQuantity, setDesiredQuantity] = useState('1');
  const [costPerM2, setCostPerM2] = useState('90,00');
  const [mediaType, setMediaType] = useState(mediaTypes[0]);
  const [finishing, setFinishing] = useState(finishingOptions[0]);
  const [extraCost, setExtraCost] = useState('');
  const [discount, setDiscount] = useState('');
  const [downPayment, setDownPayment] = useState('');
  const [paymentMethod, setPaymentMethod] = useState(paymentOptions[0]);
  const [jobDescription, setJobDescription] = useState('');
  
  // Client Info
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientFolder, setClientFolder] = useState('');

  // Results State
  const [results, setResults] = useState<{
    unitArea: number; // em m²
    totalArea: number; // em m²
    subtotal: number;
    extraCost: number;
    discount: number;
    totalCost: number;
    downPayment: number;
    remainingValue: number;
  } | null>(null);

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [copyButtonText, setCopyButtonText] = useState('Copiar Texto e Fechar');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const orderModalContentRef = useRef<HTMLDivElement>(null);
  const productionOrderRef = useRef<HTMLDivElement>(null);
  const orderNumber = useRef(`OS-${Date.now().toString().slice(-6)}`);

  // Utilitário para converter dimensões em metros com precisão:
  // Se o usuário digitar valores acima de 20 (ex: 100 ou 150), normaliza centímetros (100cm = 1,00m, 150cm = 1,50m)
  // Se digitar valores até 20 (ex: 1,00 ou 1,50), já são metros
  const parseDimensionInMeters = (val: string): number => {
    if (!val) return 0;
    const clean = String(val).replace(',', '.').trim();
    const num = parseFloat(clean);
    if (isNaN(num) || num <= 0) return 0;
    return num > 20 ? (num / 100) : num;
  };

  const parseNumber = (val: string): number => {
    if (!val) return 0;
    const clean = String(val).replace(',', '.').trim();
    const num = parseFloat(clean);
    return isNaN(num) || num < 0 ? 0 : num;
  };

  const qtyParsed = (val?: string) => {
    const raw = val ?? desiredQuantity;
    const p = parseInt(raw || '1', 10);
    return isNaN(p) || p <= 0 ? 1 : p;
  };

  // Prefill price when media type changes (if costPerM2 is empty or matching previous default)
  const previousMedia = useRef(mediaType);
  useEffect(() => {
    const isCostEmpty = !costPerM2 || costPerM2 === '0';
    const wasPreviousDefault = costPerM2 === mediaDefaultPrices[previousMedia.current];
    if (isCostEmpty || wasPreviousDefault) {
      setCostPerM2(mediaDefaultPrices[mediaType] || '90,00');
    }
    previousMedia.current = mediaType;
  }, [mediaType]);

  // Load editing budget if it's of type banner_adesivo
  useEffect(() => {
    if (editingBudget && editingBudget.budgetType === 'banner_adesivo') {
      setWidth(editingBudget.objectDimensions.width || '');
      setHeight(editingBudget.objectDimensions.height || '');
      setDesiredQuantity(editingBudget.desiredQuantity || '1');
      setCostPerM2(editingBudget.costPerPage || '90,00');
      setMediaType(editingBudget.paperType || mediaTypes[0]);
      setFinishing(editingBudget.finishing || finishingOptions[0]);
      setExtraCost(editingBudget.extraCost || '');
      setDiscount(editingBudget.discount || '');
      setDownPayment(editingBudget.downPayment || '');
      setPaymentMethod(editingBudget.paymentMethod || paymentOptions[0]);
      setJobDescription(editingBudget.jobDescription || '');
      setClientName(editingBudget.clientName || '');
      setClientPhone(editingBudget.clientPhone || '');
      setClientFolder(editingBudget.clientFolder || '');

      // Trigger automatic calculation for the loaded budget
      calculateResults({
        widthVal: editingBudget.objectDimensions.width,
        heightVal: editingBudget.objectDimensions.height,
        qtyVal: editingBudget.desiredQuantity,
        costVal: editingBudget.costPerPage,
        extraVal: editingBudget.extraCost,
        discVal: editingBudget.discount,
        downVal: editingBudget.downPayment
      });
    }
  }, [editingBudget]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '').substring(0, 11);
    const len = rawValue.length;

    if (len === 0) {
      setClientPhone('');
      return;
    }

    if (len <= 2) {
      setClientPhone(`(${rawValue}`);
      return;
    }

    if (len <= 6) {
      setClientPhone(`(${rawValue.substring(0, 2)}) ${rawValue.substring(2)}`);
      return;
    }
    
    if (len < 11) {
      setClientPhone(`(${rawValue.substring(0, 2)}) ${rawValue.substring(2, 6)}-${rawValue.substring(6)}`);
      return;
    }

    setClientPhone(`(${rawValue.substring(0, 2)}) ${rawValue.substring(2, 7)}-${rawValue.substring(7)}`);
  };

  const formatDimensionOnBlur = (val: string, setter: (v: string) => void) => {
    if (!val) return;
    const m = parseDimensionInMeters(val);
    if (m > 0) {
      setter(m.toFixed(2).replace('.', ','));
    }
  };

  const formatPriceOnBlur = (val: string, setter: (v: string) => void) => {
    if (!val) return;
    const num = parseNumber(val);
    if (num >= 0) {
      setter(num.toFixed(2).replace('.', ','));
    }
  };

  const calculateResults = (overrides?: {
    widthVal?: string;
    heightVal?: string;
    qtyVal?: string;
    costVal?: string;
    extraVal?: string;
    discVal?: string;
    downVal?: string;
  }) => {
    const rawW = overrides?.widthVal ?? width;
    const rawH = overrides?.heightVal ?? height;
    const w = parseDimensionInMeters(rawW);
    const h = parseDimensionInMeters(rawH);
    const qtyInput = overrides?.qtyVal ?? desiredQuantity;
    const qty = qtyParsed(qtyInput);
    const priceM2 = parseNumber(overrides?.costVal ?? costPerM2);
    const extra = parseNumber(overrides?.extraVal ?? extraCost);
    const disc = parseNumber(overrides?.discVal ?? discount);
    const down = parseNumber(overrides?.downVal ?? downPayment);

    if (w <= 0 || h <= 0) {
      setResults(null);
      return null;
    }

    // Fórmula exata: Lado 1 x Lado 2 = Área (m²) x Valor de Venda = Total
    // Exemplo: 1,00m x 1,50m = 1,50 m² x R$ 90,00 = R$ 135,00
    const unitArea = w * h;
    const totalArea = unitArea * qty;
    const subtotal = totalArea * priceM2;
    const totalCost = Math.max(0, subtotal + extra - disc);
    const remainingValue = Math.max(0, totalCost - down);

    const calculated = {
      unitArea,
      totalArea,
      subtotal,
      extraCost: extra,
      discount: disc,
      totalCost,
      downPayment: down,
      remainingValue
    };

    setResults(calculated);
    return calculated;
  };

  // Recalcula em tempo real sempre que qualquer dado for digitado
  useEffect(() => {
    calculateResults();
  }, [width, height, desiredQuantity, costPerM2, extraCost, discount, downPayment]);

  const handleCalculate = () => {
    const w = parseDimensionInMeters(width);
    const h = parseDimensionInMeters(height);
    const priceM2 = parseNumber(costPerM2);
    const qty = qtyParsed(desiredQuantity);

    if (!width || w <= 0) {
      setToast({ message: 'Por favor, insira a medida do Lado 1 (Largura).', type: 'info' });
      return;
    }
    if (!height || h <= 0) {
      setToast({ message: 'Por favor, insira a medida do Lado 2 (Altura).', type: 'info' });
      return;
    }
    if (qty <= 0) {
      setToast({ message: 'Por favor, insira a Quantidade corretamente.', type: 'info' });
      return;
    }
    if (!costPerM2 || priceM2 <= 0) {
      setToast({ message: 'Por favor, insira o Valor de Venda (R$/m²).', type: 'info' });
      return;
    }

    const calculated = calculateResults();
    if (calculated) {
      // Add to calculation history
      const date = new Date();
      const formattedDate = `${date.toLocaleDateString('pt-BR')} ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
      
      const historyItem: CalculationHistoryItem = {
        id: `hist-${Date.now()}`,
        timestamp: formattedDate,
        budgetType: 'banner_adesivo',
        objectDimensions: { width, height },
        selectedPaperSize: 'M2',
        areaDimensions: { width: '100', height: '100' },
        costPerPage: costPerM2,
        desiredQuantity,
        extraCost,
        discount,
        gap: '0',
        jobDescription: jobDescription || `Banner/Adesivo ${w.toFixed(2).replace('.', ',')}x${h.toFixed(2).replace('.', ',')} m`,
        paperType: mediaType,
        colors: 'N/A',
        finishing,
        clientName,
        clientPhone,
        clientFolder,
        downPayment,
        paymentMethod,
        results: null,
        budgetResult: {
          totalPages: 1,
          subtotal: calculated.subtotal,
          extraCost: calculated.extraCost,
          discount: calculated.discount,
          totalCost: calculated.totalCost,
          itemsPerPage: qty
        }
      };

      onAddHistory(historyItem);
      setToast({ message: 'Cálculo de Área e Valor realizado com sucesso!', type: 'success' });
    }
  };

  const handleSave = () => {
    const calc = results || calculateResults();
    if (!calc) {
      setToast({ message: 'Por favor, insira os lados e o valor de venda antes de salvar.', type: 'info' });
      return;
    }

    const date = new Date();
    const formattedDate = `${date.toLocaleDateString('pt-BR')} ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    const name = clientName || jobDescription || `Orçamento Banner ${formattedDate}`;

    const newBudget: SavedBudget = {
      id: editingBudget?.id || `budget-${Date.now()}`,
      name,
      createdAt: editingBudget?.createdAt || formattedDate,
      budgetType: 'banner_adesivo',
      objectDimensions: { width, height },
      selectedPaperSize: 'M2',
      areaDimensions: { width: '100', height: '100' },
      costPerPage: costPerM2,
      desiredQuantity,
      extraCost,
      discount,
      gap: '0',
      jobDescription,
      paperType: mediaType,
      colors: 'N/A',
      finishing,
      clientName,
      clientPhone,
      clientFolder,
      downPayment,
      paymentMethod,
      results: null,
      budgetResult: {
        totalPages: 1,
        subtotal: calc.subtotal,
        extraCost: calc.extraCost,
        discount: calc.discount,
        totalCost: calc.totalCost,
        itemsPerPage: qtyParsed()
      }
    };

    onSaveBudget(newBudget);
  };

  const handleClear = () => {
    setWidth('');
    setHeight('');
    setDesiredQuantity('');
    setCostPerM2(mediaDefaultPrices[mediaType]);
    setExtraCost('');
    setDiscount('');
    setDownPayment('');
    setJobDescription('');
    setClientName('');
    setClientPhone('');
    setClientFolder('');
    setResults(null);
    setToast({ message: 'Formulário limpo com sucesso.', type: 'info' });
  };

  // Shortcuts register
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isModKey = e.ctrlKey || e.metaKey;
      
      if (isModKey && e.key === 'Enter') {
        e.preventDefault();
        handleCalculate();
      }
      
      if (isModKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSave();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [width, height, desiredQuantity, costPerM2, extraCost, discount, downPayment, mediaType, finishing, jobDescription, clientName, clientPhone, clientFolder, paymentMethod, results]);

  const cleanZeros = (val: string) => {
    return val.replace(/,00/g, '').replace(/\.00/g, '');
  };

  const wM = parseDimensionInMeters(width);
  const hM = parseDimensionInMeters(height);
  const formattedTamanho = wM > 0 && hM > 0 
    ? `${wM.toFixed(2).replace('.', ',')} m × ${hM.toFixed(2).replace('.', ',')} m` 
    : (width && height ? `${width} × ${height}` : 'Não informado');

  const formattedTotal = results ? results.totalCost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00';
  const formattedDown = results && results.downPayment > 0 ? results.downPayment.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '';
  const formattedRemaining = results && results.remainingValue > 0 ? results.remainingValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '';

  const budgetText = `Olá, ${clientName || 'tudo bem'}! Conforme sua solicitação, segue orçamento para aprovação.

*Orçamento*
Produto/Serviço: ${jobDescription || 'Banner/Adesivo'}
Tamanho: ${formattedTamanho}
Quantidade: ${qtyParsed()} unidade(s)
Acabamento: ${finishing}

*Valor Total: ${formattedTotal}*
Forma de Pagamento: ${paymentMethod}
${results && results.downPayment > 0 ? `Sinal/Entrada: ${formattedDown}\nValor Restante: ${formattedRemaining}` : ''}

*Observações:*
- Produção de 2 a 4 dias úteis após aprovação da arte
- As cores podem sofrer variações de até 10% dependendo do lote e da mídia
- Orçamento válido por 5 dias

*Ficamos à disposição para iniciar seu pedido!*`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(budgetText)
        .then(() => {
            setCopyButtonText('Copiado!');
            setToast({ message: 'Orçamento copiado para a área de transferência!', type: 'success' });
            setTimeout(() => {
                setCopyButtonText('Copiar Texto e Fechar');
                setIsModalOpen(false);
            }, 1000);
        })
        .catch(err => {
            console.error('Falha ao copiar texto: ', err);
            setToast({ message: 'Erro ao copiar orçamento.', type: 'info' });
        });
  };

  const triggerPrint = () => {
    const printContent = productionOrderRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
        setToast({ message: 'Por favor, permita pop-ups para imprimir a Ordem de Produção.', type: 'info' });
        return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Ordem de Produção - ${orderNumber.current}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
            body {
              font-family: 'Inter', sans-serif;
              color: black;
              background-color: white;
              padding: 20px;
            }
            .border-b { border-bottom: 1px solid black; }
            .border-b-2 { border-bottom: 2px solid black; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
            .pb-2 { padding-bottom: 8px; }
            .pb-4 { padding-bottom: 16px; }
            .mb-4 { margin-bottom: 16px; }
            .mb-8 { margin-bottom: 32px; }
            .text-3xl { font-size: 24px; font-weight: bold; }
            .text-xl { font-size: 18px; font-weight: bold; }
            .text-sm { font-size: 12px; color: #555; }
            .font-semibold { font-weight: 600; }
            .pl-2 { padding-left: 8px; margin-top: 4px; margin-bottom: 8px; }
            .mt-12 { margin-top: 48px; }
            .pt-4 { padding-top: 16px; }
            .border-t { border-top: 1px solid black; }
            .text-center { text-align: center; }
            .text-xs { font-size: 10px; }
            .border-dashed { border-style: dashed; }
            .border { border: 1px solid black; }
            .p-4 { padding: 16px; }
            .h-40 { height: 120px; }
            .rounded { border-radius: 4px; }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const downloadPDF = () => {
    const printContent = productionOrderRef.current;
    if (!printContent) return;

    setIsDownloading(true);
    setToast({ message: 'Gerando PDF...', type: 'info' });

    // We can run inline custom print or capture utilizing jsPDF
    // Since we want standard clean high quality text PDF to match what ResultsDisplay might do
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Simple, high-quality, native PDF generation
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(22);
      doc.text('ORDEM DE PRODUÇÃO', 20, 25);
      
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(10);
      doc.text('FATTORPRINT GRÁFICA DIGITAL', 20, 31);
      doc.text(`Data de Emissão: ${new Date().toLocaleDateString('pt-BR')}`, 140, 25);
      doc.text(`Nº Ordem: ${orderNumber.current}`, 140, 31);
      
      doc.setLineWidth(0.5);
      doc.line(20, 35, 190, 35);

      // Section: Detalhes do Trabalho
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('Detalhes do Trabalho', 20, 47);
      
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(11);
      doc.text('Descrição:', 20, 55);
      doc.setFont('Helvetica', 'bold');
      doc.text(jobDescription || 'Banner/Adesivo', 50, 55);
      
      doc.setFont('Helvetica', 'normal');
      doc.text('Mídia/Material:', 20, 63);
      doc.setFont('Helvetica', 'bold');
      doc.text(mediaType, 50, 63);
      
      doc.setFont('Helvetica', 'normal');
      doc.text('Acabamento:', 20, 71);
      doc.setFont('Helvetica', 'bold');
      doc.text(finishing, 50, 71);

      doc.setFont('Helvetica', 'normal');
      doc.text('Quantidade:', 120, 55);
      doc.setFont('Helvetica', 'bold');
      doc.text(`${qtyParsed()} unidade(s)`, 150, 55);

      doc.setFont('Helvetica', 'normal');
      doc.text('Tamanho:', 120, 63);
      doc.setFont('Helvetica', 'bold');
      doc.text(`${width} x ${height} cm`, 150, 63);

      doc.setFont('Helvetica', 'normal');
      doc.text('Área Total:', 120, 71);
      doc.setFont('Helvetica', 'bold');
      const totalAreaStr = results ? `${results.totalArea.toFixed(3).replace('.', ',')} m²` : 'N/A';
      doc.text(totalAreaStr, 150, 71);

      doc.setLineWidth(0.2);
      doc.line(20, 78, 190, 78);

      // Section: Detalhes Financeiros (for internal production/delivery)
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('Especificações de Negócio', 20, 88);
      
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(11);
      doc.text('Cliente:', 20, 96);
      doc.setFont('Helvetica', 'bold');
      doc.text(clientName || 'Não especificado', 50, 96);

      doc.setFont('Helvetica', 'normal');
      doc.text('Telefone:', 20, 104);
      doc.setFont('Helvetica', 'bold');
      doc.text(clientPhone || 'Não especificado', 50, 104);

      doc.setFont('Helvetica', 'normal');
      doc.text('Pasta/Projeto:', 20, 112);
      doc.setFont('Helvetica', 'bold');
      doc.text(clientFolder || 'Não especificado', 50, 112);

      doc.setFont('Helvetica', 'normal');
      doc.text('Preço por m²:', 120, 96);
      doc.setFont('Helvetica', 'bold');
      doc.text(parseFloat(costPerM2 || '0').toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), 150, 96);

      doc.setFont('Helvetica', 'normal');
      doc.text('Custo Extra:', 120, 104);
      doc.setFont('Helvetica', 'bold');
      doc.text(parseFloat(extraCost || '0').toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), 150, 104);

      doc.setFont('Helvetica', 'normal');
      doc.text('Desconto:', 120, 112);
      doc.setFont('Helvetica', 'bold');
      doc.text(parseFloat(discount || '0').toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), 150, 112);

      doc.setFont('Helvetica', 'normal');
      doc.text('Entrada/Sinal:', 120, 120);
      doc.setFont('Helvetica', 'bold');
      doc.text(parseFloat(downPayment || '0').toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), 150, 120);

      doc.setFont('Helvetica', 'normal');
      doc.text('Valor Total:', 120, 128);
      doc.setFont('Helvetica', 'bold');
      doc.text(results?.totalCost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'N/A', 150, 128);

      doc.setFont('Helvetica', 'normal');
      doc.text('A pagar:', 120, 136);
      doc.setFont('Helvetica', 'bold');
      doc.text(results?.remainingValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || 'N/A', 150, 136);

      doc.line(20, 142, 190, 142);

      // Section: Observações
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('Observações Adicionais', 20, 152);
      
      doc.rect(20, 158, 170, 40);
      
      // Footer
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9);
      doc.text('Confira todas as especificações e a prova de impressão antes de iniciar a produção em larga escala.', 20, 260);
      doc.text('O corte, mídia e as cores podem sofrer variações mínimas de 10%.', 20, 266);
      
      doc.line(20, 275, 190, 275);
      doc.text('Fattorprint Gráfica Digital - Ordem de Produção Oficial', 105, 282, { align: 'center' });

      doc.save(`Ordem_Producao_${orderNumber.current}.pdf`);
      setToast({ message: 'PDF baixado com sucesso!', type: 'success' });
    } catch (e) {
      console.error(e);
      setToast({ message: 'Erro ao gerar PDF.', type: 'info' });
    } finally {
      setIsDownloading(false);
    }
  };

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
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-fadeIn">
      <div className="space-y-8">
        {/* Core Calculation Card: LADO X LADO X VALOR DE VENDA */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-md border-2 border-sky-500/20 dark:bg-slate-800 dark:border-sky-500/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 mb-6 dark:border-slate-700 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-full bg-sky-500"></span>
                <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">
                  Cálculo de Área e Valor de Venda
                </h2>
              </div>
              <p className="text-sm font-semibold text-sky-700 dark:text-sky-300 mt-1">
                Lado 1 (Largura) × Lado 2 (Altura) × Valor de Venda
              </p>
            </div>
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 bg-sky-100 dark:bg-sky-900/60 text-sky-800 dark:text-sky-200 rounded-full border border-sky-200 dark:border-sky-700 self-start sm:self-auto">
              Cálculo Instantâneo
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-end">
            <InputGroup 
              label="Lado 1 - Largura (m)" 
              name="width" 
              value={width} 
              type="text"
              onChange={(e) => setWidth(e.target.value)} 
              onBlur={() => formatDimensionOnBlur(width, setWidth)}
              placeholder="ex: 1,00" 
              icon={<WidthIcon className="w-5 h-5 text-slate-400" />} 
              tooltip="Medida do primeiro lado em metros (ex: 1,00 m ou 100 cm)" 
            />
            <InputGroup 
              label="Lado 2 - Altura (m)" 
              name="height" 
              value={height} 
              type="text"
              onChange={(e) => setHeight(e.target.value)} 
              onBlur={() => formatDimensionOnBlur(height, setHeight)}
              placeholder="ex: 1,50" 
              icon={<HeightIcon className="w-5 h-5 text-slate-400" />} 
              tooltip="Medida do segundo lado em metros (ex: 1,50 m ou 150 cm)" 
            />
            <InputGroup 
              label="Valor de Venda (R$/m²)" 
              name="costPerM2" 
              value={costPerM2} 
              type="text"
              onChange={(e) => setCostPerM2(e.target.value)} 
              onBlur={() => formatPriceOnBlur(costPerM2, setCostPerM2)}
              placeholder="90,00" 
              icon={<MoneyIcon className="w-5 h-5 text-slate-400" />} 
              tooltip="Preço do metro quadrado a ser cobrado na venda." 
            />
            <InputGroup 
              label="Quantidade" 
              name="desiredQuantity" 
              value={desiredQuantity} 
              type="text"
              onChange={(e) => setDesiredQuantity(e.target.value)} 
              placeholder="1" 
              icon={<QuantityIcon className="w-5 h-5 text-slate-400" />} 
              tooltip="Quantidade de peças com essas mesmas dimensões." 
            />
          </div>

          {/* Real-time Calculation Display */}
          {results ? (
            <div className="mt-6 p-5 bg-gradient-to-r from-sky-50 via-slate-50 to-emerald-50 dark:from-sky-950/40 dark:via-slate-900/40 dark:to-emerald-950/40 border-2 border-sky-300 dark:border-sky-800 rounded-xl shadow-inner">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="p-3.5 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block uppercase tracking-wider">Área Unitária</span>
                  <span className="text-2xl font-black font-mono text-slate-800 dark:text-slate-100 block mt-1">
                    {results.unitArea.toFixed(2).replace('.', ',')} m²
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5 font-medium">
                    {parseDimensionInMeters(width).toFixed(2).replace('.', ',')} × {parseDimensionInMeters(height).toFixed(2).replace('.', ',')} m
                  </span>
                </div>

                <div className="p-3.5 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block uppercase tracking-wider">Área Total</span>
                  <span className="text-2xl font-black font-mono text-sky-700 dark:text-sky-300 block mt-1">
                    {results.totalArea.toFixed(2).replace('.', ',')} m²
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5 font-medium">
                    {qtyParsed()} unidade{qtyParsed() !== 1 ? 's' : ''}
                  </span>
                </div>

                <div className="p-3.5 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block uppercase tracking-wider">Valor do M²</span>
                  <span className="text-2xl font-black font-mono text-slate-800 dark:text-slate-100 block mt-1">
                    {parseNumber(costPerM2).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5 font-medium">
                    preço por m²
                  </span>
                </div>

                <div className="p-3.5 bg-emerald-600 text-white rounded-xl shadow-md border border-emerald-500">
                  <span className="text-xs font-bold text-emerald-100 block uppercase tracking-wider">Valor Total</span>
                  <span className="text-2xl font-black font-mono block mt-1">
                    {results.subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                  <span className="text-[11px] text-emerald-100 block mt-0.5 font-medium">
                    Área Total × Valor M²
                  </span>
                </div>
              </div>

              {/* Equation formula strip */}
              <div className="mt-4 pt-3 border-t border-sky-200 dark:border-sky-800/80 flex items-center justify-center flex-wrap gap-2 text-sm">
                <span className="font-bold text-slate-700 dark:text-slate-300">Demonstrativo da Operação:</span>
                <span className="font-mono bg-white dark:bg-slate-900 px-3.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold shadow-sm">
                  {parseDimensionInMeters(width).toFixed(2).replace('.', ',')} m × {parseDimensionInMeters(height).toFixed(2).replace('.', ',')} m = {results.unitArea.toFixed(2).replace('.', ',')} m²
                  {qtyParsed() > 1 ? ` (× ${qtyParsed()} un = ${results.totalArea.toFixed(2).replace('.', ',')} m²)` : ''}
                  {' × '}R$ {costPerM2} = <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">{results.subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </span>
              </div>
            </div>
          ) : (
            <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700 rounded-xl text-center text-sm text-slate-500 dark:text-slate-400">
              Digite o <strong>Lado 1</strong>, <strong>Lado 2</strong> e o <strong>Valor de Venda</strong> para ver o resultado do cálculo na hora.
              <span className="block text-xs mt-1 text-slate-400 font-mono">Exemplo: 1,00 × 1,50 = 1,50 m² × R$ 90,00 = R$ 135,00</span>
            </div>
          )}
        </div>

        {/* Secondary Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Media and Finishing */}
          <div className="bg-white p-6 rounded-2xl shadow-md space-y-6 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h3 className="text-xl font-bold text-slate-800 border-b pb-3 dark:text-slate-200 dark:border-slate-700">
              Mídia e Acabamento
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <LabelWithTooltip htmlFor="mediaType" label="Tipo de Mídia" tooltip="Escolha o material de mídia para a produção." className="mb-1" />
                <div className="relative rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <MediaIcon className="w-5 h-5 text-slate-400" />
                  </div>
                  <select 
                    id="mediaType" 
                    name="mediaType" 
                    className="block w-full rounded-md border-slate-300 pl-10 py-2 focus:border-sky-500 focus:ring-sky-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200" 
                    value={mediaType} 
                    onChange={(e) => setMediaType(e.target.value)}
                  >
                    {mediaTypes.map((type) => (<option key={type} value={type}>{type}</option>))}
                  </select>
                </div>
              </div>

              <div>
                <LabelWithTooltip htmlFor="finishing" label="Acabamento" tooltip="Selecione o tipo de acabamento do banner ou adesivo." className="mb-1" />
                <div className="relative rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <select 
                    id="finishing" 
                    name="finishing" 
                    className="block w-full rounded-md border-slate-300 pl-10 py-2 focus:border-sky-500 focus:ring-sky-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200" 
                    value={finishing} 
                    onChange={(e) => setFinishing(e.target.value)}
                  >
                    {finishingOptions.map((opt) => (<option key={opt} value={opt}>{opt}</option>))}
                  </select>
                </div>
              </div>

              <InputGroup 
                label="Custo Adicional (R$)" 
                name="extraCost" 
                value={extraCost} 
                type="text"
                onChange={(e) => setExtraCost(e.target.value)} 
                onBlur={() => formatPriceOnBlur(extraCost, setExtraCost)}
                placeholder="ex: 20,00" 
                icon={<MoneyIcon className="w-5 h-5 text-slate-400" />} 
                tooltip="Custos opcionais como arte, deslocamento ou suportes." 
              />

              <InputGroup 
                label="Desconto (R$)" 
                name="discount" 
                value={discount} 
                type="text"
                onChange={(e) => setDiscount(e.target.value)} 
                onBlur={() => formatPriceOnBlur(discount, setDiscount)}
                placeholder="ex: 15,00" 
                icon={<DiscountIcon className="w-5 h-5 text-slate-400" />} 
                tooltip="Desconto em reais aplicado ao total." 
              />

              <div className="sm:col-span-2">
                <LabelWithTooltip htmlFor="jobDescription" label="Descrição do Serviço" tooltip="Identificação do serviço no orçamento. Ex: Banner com ilhós para fachada" className="mb-1" />
                <div className="relative rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 pt-2">
                    <DescriptionIcon className="w-5 h-5 text-slate-400" />
                  </div>
                  <textarea 
                    id="jobDescription" 
                    name="jobDescription" 
                    rows={2} 
                    className="block w-full rounded-md border-slate-300 pl-10 py-2 focus:border-sky-500 focus:ring-sky-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200" 
                    placeholder="Ex: Banner com bastão e cordão para divulgação de loja..." 
                    value={jobDescription} 
                    onChange={(e) => setJobDescription(e.target.value)} 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Client & Payment Info */}
          <div className="bg-white p-6 rounded-2xl shadow-md space-y-6 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <h3 className="text-xl font-bold text-slate-800 border-b pb-3 dark:text-slate-200 dark:border-slate-700">
              Dados do Cliente & Pagamento
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <InputGroup 
                  label="Nome do Cliente" 
                  name="clientName" 
                  value={clientName} 
                  onChange={(e) => setClientName(e.target.value)} 
                  placeholder="Cliente ou Empresa" 
                  icon={<UserIcon className="w-5 h-5 text-slate-400" />} 
                  type="text" 
                  tooltip="Identificação do cliente para o orçamento." 
                />
              </div>

              <InputGroup 
                label="WhatsApp" 
                name="clientPhone" 
                value={clientPhone} 
                onChange={handlePhoneChange} 
                placeholder="(00) 00000-0000" 
                icon={<PhoneIcon className="w-5 h-5 text-slate-400" />} 
                type="tel" 
                tooltip="Telefone de contato do cliente." 
              />

              <InputGroup 
                label="Pasta no Computador" 
                name="clientFolder" 
                value={clientFolder} 
                onChange={(e) => setClientFolder(e.target.value)} 
                placeholder="ex: Pasta João" 
                icon={<FolderIcon className="w-5 h-5 text-slate-400" />} 
                type="text" 
                tooltip="Pasta de arquivos ou artes do cliente." 
              />

              <div>
                <LabelWithTooltip htmlFor="paymentMethod" label="Forma de Pagamento" tooltip="Meio preferencial para quitação do pedido." className="mb-1" />
                <div className="relative rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <CreditCardIcon className="w-5 h-5 text-slate-400" />
                  </div>
                  <select 
                    id="paymentMethod" 
                    name="paymentMethod" 
                    className="block w-full rounded-md border-slate-300 pl-10 py-2 focus:border-sky-500 focus:ring-sky-500 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200" 
                    value={paymentMethod} 
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    {paymentOptions.map((opt) => (<option key={opt} value={opt}>{opt}</option>))}
                  </select>
                </div>
              </div>

              <InputGroup 
                label="Entrada / Sinal (R$)" 
                name="downPayment" 
                value={downPayment} 
                type="text"
                onChange={(e) => setDownPayment(e.target.value)} 
                onBlur={() => formatPriceOnBlur(downPayment, setDownPayment)}
                placeholder="ex: 50,00" 
                icon={<MoneyIcon className="w-5 h-5 text-slate-400" />} 
                tooltip="Valor pago antecipadamente." 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Buttons bar */}
      <div className="flex justify-center gap-4 flex-wrap mt-8">
        <button 
          onClick={handleCalculate} 
          className="bg-sky-600 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all duration-300 text-lg active:scale-[0.98] flex items-center gap-2"
        >
          <span>Calcular Orçamento</span>
          <kbd className="hidden sm:inline-block text-[10px] uppercase font-semibold tracking-wider bg-sky-700 text-sky-100 px-1.5 py-0.5 rounded opacity-90 border border-sky-500 font-mono select-none">
            {isMac ? '⌘↵' : 'Ctrl+Enter'}
          </kbd>
        </button>

        {editingBudget ? (
          <>
            <button 
              onClick={handleSave} 
              className="bg-green-600 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 text-lg flex items-center gap-2 active:scale-[0.98]"
            >
              <UpdateIcon className="w-5 h-5" />
              <span>Atualizar Orçamento</span>
              <kbd className="hidden sm:inline-block text-[10px] uppercase font-semibold tracking-wider bg-green-700 text-green-100 px-1.5 py-0.5 rounded opacity-90 border border-green-500 font-mono select-none">
                {isMac ? '⌘S' : 'Ctrl+S'}
              </kbd>
            </button>
            <button 
              onClick={onCancelEdit} 
              className="bg-slate-500 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 transition-all duration-300 text-lg flex items-center gap-2 active:scale-[0.98]"
            >
              <CancelIcon className="w-5 h-5" />
              <span>Cancelar</span>
            </button>
          </>
        ) : (
          <>
            <button 
              onClick={handleSave} 
              className="bg-green-600 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 text-lg flex items-center gap-2 active:scale-[0.98]"
            >
              <SaveIcon className="w-5 h-5" />
              <span>Salvar Orçamento</span>
              <kbd className="hidden sm:inline-block text-[10px] uppercase font-semibold tracking-wider bg-green-700 text-green-100 px-1.5 py-0.5 rounded opacity-90 border border-green-500 font-mono select-none">
                {isMac ? '⌘S' : 'Ctrl+S'}
              </kbd>
            </button>
            <button 
              onClick={handleClear} 
              className="bg-slate-500 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 transition-all duration-300 text-lg flex items-center gap-2 active:scale-[0.98]"
            >
              <ClearIcon className="w-5 h-5" />
              <span>Limpar</span>
            </button>
          </>
        )}
      </div>

      {/* Calculated Results Block */}
      {results && (
        <div className="bg-slate-900 text-white p-6 md:p-8 rounded-2xl shadow-xl dark:bg-black/60 border border-slate-800 transition-all duration-500 scale-100 relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-48 h-48 bg-sky-600/10 rounded-full blur-2xl"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-slate-800 relative z-10">
            <div>
              <span className="bg-sky-500/20 text-sky-400 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border border-sky-500/30">
                Resultado de Orçamento (M²)
              </span>
              <h3 className="text-2xl md:text-3xl font-bold mt-2">Detalhamento dos Valores</h3>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => setIsModalOpen(true)} 
                className="bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700 px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition duration-200"
              >
                <CopyIcon className="w-4 h-4" />
                Copiar Orçamento
              </button>
              <button 
                onClick={() => setIsOrderModalOpen(true)} 
                className="bg-sky-600 hover:bg-sky-500 text-white px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition duration-200"
              >
                <PrintIcon className="w-4 h-4" />
                Gerar Ordem de Serviço
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 relative z-10">
            <div className="bg-slate-800/50 border border-slate-800 p-4 rounded-xl">
              <span className="text-slate-400 text-xs font-semibold block uppercase tracking-wider">Área Unitária</span>
              <span className="text-xl md:text-2xl font-bold font-mono text-slate-100 block mt-1">
                {results.unitArea.toFixed(2).replace('.', ',')} m²
              </span>
              <span className="text-slate-500 text-[10px] block mt-0.5">
                ({parseDimensionInMeters(width).toFixed(2).replace('.', ',')} × {parseDimensionInMeters(height).toFixed(2).replace('.', ',')} m)
              </span>
            </div>

            <div className="bg-slate-800/50 border border-slate-800 p-4 rounded-xl">
              <span className="text-slate-400 text-xs font-semibold block uppercase tracking-wider">Área Total</span>
              <span className="text-xl md:text-2xl font-bold font-mono text-slate-100 block mt-1">
                {results.totalArea.toFixed(2).replace('.', ',')} m²
              </span>
              <span className="text-slate-500 text-[10px] block mt-0.5">
                (x {qtyParsed()} unidade{qtyParsed() !== 1 ? 's' : ''})
              </span>
            </div>

            <div className="bg-slate-800/50 border border-slate-800 p-4 rounded-xl">
              <span className="text-slate-400 text-xs font-semibold block uppercase tracking-wider">Subtotal Bruto</span>
              <span className="text-xl md:text-2xl font-bold font-mono text-slate-100 block mt-1">
                {results.subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
              <span className="text-slate-500 text-[10px] block mt-0.5">
                ({parseNumber(costPerM2).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}/m²)
              </span>
            </div>

            <div className="bg-slate-800/50 border border-slate-800 p-4 rounded-xl">
              <span className="text-slate-400 text-xs font-semibold block uppercase tracking-wider">Custos Adicionais</span>
              <span className="text-xl md:text-2xl font-bold font-mono text-slate-100 block mt-1">
                {results.extraCost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
              <span className="text-slate-500 text-[10px] block mt-0.5">
                (Acabamento e adicionais)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-6 border-t border-slate-800/50 relative z-10 items-center">
            {results.discount > 0 && (
              <div className="bg-red-950/20 border border-red-900/30 px-4 py-2.5 rounded-lg text-red-400 text-sm font-semibold flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>Desconto Aplicado: {results.discount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
              </div>
            )}
            
            <div className="md:col-span-2 flex flex-col md:flex-row gap-6 md:justify-end items-stretch md:items-center w-full ml-auto">
              {results.downPayment > 0 && (
                <div className="text-right flex flex-row md:flex-col justify-between md:justify-center border-b md:border-b-0 pb-2 md:pb-0 border-slate-800">
                  <span className="text-slate-400 text-xs">Entrada (PIX/Sinal)</span>
                  <span className="text-slate-200 font-mono font-bold mt-1 text-base">
                    {results.downPayment.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
              )}

              {results.downPayment > 0 && (
                <div className="text-right flex flex-row md:flex-col justify-between md:justify-center border-b md:border-b-0 pb-2 md:pb-0 border-slate-800">
                  <span className="text-amber-400 text-xs">A Receber no Final</span>
                  <span className="text-amber-300 font-mono font-bold mt-1 text-base">
                    {results.remainingValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
              )}

              <div className="text-right flex flex-row md:flex-col justify-between md:justify-center p-3.5 bg-emerald-950/30 border border-emerald-800/40 rounded-xl">
                <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider md:text-right text-left">Valor Total Final</span>
                <span className="text-2xl md:text-3xl font-black font-mono text-emerald-400 mt-1">
                  {results.totalCost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Whatsapp budget preview modal */}
      {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col dark:bg-slate-800 animate-slide-in-down border border-slate-200 dark:border-slate-700">
                  <div className="bg-sky-600 text-white p-6 flex justify-between items-center">
                      <h3 className="text-xl font-bold flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          Texto para Enviar
                      </h3>
                      <button 
                        onClick={() => setIsModalOpen(false)} 
                        className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition"
                      >
                          <CancelIcon className="w-6 h-6" />
                      </button>
                  </div>
                  <div className="p-6 flex-grow overflow-y-auto max-h-[24rem]">
                      <pre className="whitespace-pre-wrap font-sans text-sm bg-slate-50 p-4 rounded-xl border border-slate-100 text-slate-800 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100 select-all">
                          {budgetText}
                      </pre>
                  </div>
                  <div className="bg-slate-50 px-6 py-4 flex justify-end gap-3 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-700">
                      <button 
                        onClick={() => setIsModalOpen(false)} 
                        className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-semibold hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800 text-sm transition"
                      >
                          Fechar
                      </button>
                      <button 
                        onClick={copyToClipboard} 
                        className="px-5 py-2 bg-sky-600 text-white rounded-lg font-bold hover:bg-sky-700 shadow flex items-center gap-2 text-sm transition"
                      >
                          <CopyIcon className="w-4 h-4" />
                          {copyButtonText}
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* Production Order modal */}
      {isOrderModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden flex flex-col dark:bg-slate-800 border border-slate-200 dark:border-slate-700 h-[90vh]">
                  <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
                      <h3 className="text-xl font-bold flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Ordem de Produção (Visualização)
                      </h3>
                      <button onClick={() => setIsOrderModalOpen(false)} className="text-white/80 hover:text-white p-1 rounded-full transition">
                          <CancelIcon className="w-6 h-6" />
                      </button>
                  </div>
                  
                  <div className="p-8 flex-grow overflow-y-auto bg-slate-100 dark:bg-slate-900">
                      {/* Printable Area containing clean styling */}
                      <div ref={orderModalContentRef} className="bg-white p-8 max-w-2xl mx-auto shadow-lg border border-slate-200 text-slate-800">
                          <div ref={productionOrderRef} className="p-2 font-sans text-black bg-white">
                              <header className="flex justify-between items-start border-b-2 border-black pb-4 mb-8">
                                  <div>
                                      <h1 className="text-3xl font-bold tracking-tight">ORDEM DE PRODUÇÃO</h1>
                                      <p className="text-xs uppercase font-bold text-gray-500 tracking-wider">Fattorprint Gráfica Digital</p>
                                  </div>
                                  <div className="text-right">
                                      <p className="text-sm font-semibold">Data: {new Date().toLocaleDateString('pt-BR')}</p>
                                      <p className="text-sm font-mono mt-0.5 text-gray-600 font-bold">{orderNumber.current}</p>
                                  </div>
                              </header>

                              <section className="mb-6">
                                  <h2 className="text-lg font-bold border-b border-black pb-1 mb-3">Detalhes do Pedido</h2>
                                  <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm">
                                      <div>
                                          <strong className="font-semibold text-gray-700">Serviço/Trabalho:</strong>
                                          <p className="pl-1 mt-0.5 text-black font-semibold">{jobDescription || 'Banner/Adesivo'}</p>
                                      </div>
                                      <div>
                                          <strong className="font-semibold text-gray-700">Mídia/Material:</strong>
                                          <p className="pl-1 mt-0.5 text-black font-semibold">{mediaType}</p>
                                      </div>
                                      <div className="mt-2">
                                          <strong className="font-semibold text-gray-700">Quantidade:</strong>
                                          <p className="pl-1 mt-0.5 text-black font-semibold">{qtyParsed()} unidade(s)</p>
                                      </div>
                                      <div className="mt-2">
                                          <strong className="font-semibold text-gray-700">Tamanho Unitário:</strong>
                                          <p className="pl-1 mt-0.5 text-black font-semibold">
                                            {parseDimensionInMeters(width).toFixed(2).replace('.', ',')} m × {parseDimensionInMeters(height).toFixed(2).replace('.', ',')} m
                                          </p>
                                      </div>
                                      <div className="mt-2">
                                          <strong className="font-semibold text-gray-700">Acabamento:</strong>
                                          <p className="pl-1 mt-0.5 text-black font-semibold">{finishing}</p>
                                      </div>
                                      <div className="mt-2">
                                          <strong className="font-semibold text-gray-700">Área de Mídia Total:</strong>
                                          <p className="pl-1 mt-0.5 text-black font-semibold">{results?.totalArea.toFixed(2).replace('.', ',')} m²</p>
                                      </div>
                                  </div>
                              </section>

                              <section className="mb-6">
                                  <h2 className="text-lg font-bold border-b border-black pb-1 mb-3">Dados de Identificação & Cliente</h2>
                                  <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm">
                                      <div>
                                          <strong className="font-semibold text-gray-700">Cliente:</strong>
                                          <p className="pl-1 mt-0.5 font-semibold text-black">{clientName || 'Não especificado'}</p>
                                      </div>
                                      <div>
                                          <strong className="font-semibold text-gray-700">WhatsApp:</strong>
                                          <p className="pl-1 mt-0.5 font-semibold text-black">{clientPhone || 'Não especificado'}</p>
                                      </div>
                                      <div className="mt-2">
                                          <strong className="font-semibold text-gray-700">Pasta de Produção:</strong>
                                          <p className="pl-1 mt-0.5 font-semibold text-sky-700 font-mono">{clientFolder || 'Não especificada'}</p>
                                      </div>
                                      <div className="mt-2">
                                          <strong className="font-semibold text-gray-700">Forma Pagto / Sinal:</strong>
                                          <p className="pl-1 mt-0.5 font-semibold text-black">
                                            {paymentMethod} {results && results.downPayment > 0 ? `(Entrada: R$ ${results.downPayment.toFixed(2)})` : ''}
                                          </p>
                                      </div>
                                  </div>
                              </section>

                              <section className="mb-6">
                                  <h2 className="text-lg font-bold border-b border-black pb-1 mb-2">Instruções Técnicas e de Acabamento</h2>
                                  <div className="border border-dashed border-black p-4 h-32 rounded text-xs text-gray-500">
                                      {finishing !== 'Nenhum' ? (
                                        <p className="font-semibold text-black mb-2">● Realizar acabamento tipo: {finishing}</p>
                                      ) : null}
                                      <p>● Verificar arquivo na pasta indicada antes de enviar para ripagem.</p>
                                      <p>● Checar alinhamento do arquivo e marcação para ilhós/bastão se aplicável.</p>
                                      <p>● Limpeza da mídia e aplicação de laminação se configurado.</p>
                                  </div>
                              </section>

                              <footer className="mt-8 pt-4 border-t border-gray-400 text-center text-[10px] text-gray-500 leading-relaxed">
                                  <p>Fattorprint Gráfica Digital - Qualidade e Agilidade na Entrega</p>
                                  <p>A produção só deve iniciar se os arquivos de arte originais estiverem aprovados pelo cliente.</p>
                              </footer>
                          </div>
                      </div>
                  </div>
                  
                  <div className="bg-slate-50 px-6 py-4 flex justify-between items-center dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
                      <p className="text-xs text-slate-500 dark:text-slate-400">Pressione Esc para fechar</p>
                      <div className="flex gap-3">
                          <button 
                            onClick={() => setIsOrderModalOpen(false)} 
                            className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-semibold hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800 text-sm transition"
                          >
                              Fechar
                          </button>
                          <button 
                            onClick={triggerPrint} 
                            className="px-4 py-2 bg-slate-800 text-white rounded-lg font-bold hover:bg-slate-700 flex items-center gap-2 text-sm transition"
                          >
                              <PrintIcon className="w-4 h-4" />
                              Imprimir Ordem
                          </button>
                          <button 
                            onClick={downloadPDF} 
                            disabled={isDownloading} 
                            className="px-5 py-2 bg-sky-600 text-white rounded-lg font-bold hover:bg-sky-700 flex items-center gap-2 text-sm transition disabled:opacity-50"
                          >
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                              {isDownloading ? 'Baixando...' : 'Baixar PDF'}
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
