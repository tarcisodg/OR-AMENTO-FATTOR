
export interface Dimensions {
  width: string;
  height: string;
}

export interface FitResult {
  itemsPerWidth: number;
  itemsPerHeight: number;
  total: number;
}

export interface CalculationResults {
  vertical: FitResult;
  horizontal: FitResult;
  bestOrientation: 'vertical' | 'horizontal' | 'tie' | null;
}

export interface BudgetResult {
  totalPages: number;
  subtotal: number;
  extraCost: number;
  totalCost: number;
  itemsPerPage: number;
}

export interface SavedBudget {
  id: string;
  name: string;
  createdAt: string;
  objectDimensions: Dimensions;
  selectedPaperSize: string;
  areaDimensions: Dimensions;
  costPerPage: string;
  desiredQuantity: string;
  extraCost: string;
  gap: string;
  jobDescription: string;
  paperType: string;
  colors: string;
  finishing: string;
  clientName: string;
  clientPhone: string;
  clientFolder: string;
  downPayment: string;
  paymentMethod: string;
  results: CalculationResults | null;
  budgetResult: BudgetResult | null;
}

export interface CalculationHistoryItem {
  id: string;
  timestamp: string;
  objectDimensions: Dimensions;
  selectedPaperSize: string;
  areaDimensions: Dimensions;
  costPerPage: string;
  desiredQuantity: string;
  extraCost: string;
  gap: string;
  jobDescription: string;
  paperType: string;
  colors: string;
  finishing: string;
  clientName: string;
  clientPhone: string;
  clientFolder: string;
  downPayment: string;
  paymentMethod: string;
  results: CalculationResults | null;
  budgetResult: BudgetResult | null;
}
