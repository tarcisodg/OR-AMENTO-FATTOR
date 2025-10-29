
import React from 'react';
import type { FitResult } from '../types';

interface PrintableOrderProps {
  jobDescription: string;
  paperType: string;
  desiredQuantity: string;
  totalPages: number;
  itemsPerPage: number;
  bestOrientation: 'vertical' | 'horizontal' | 'tie' | null;
  objectDimensions: { width: number, height: number };
  areaDimensions: { width: number, height: number };
  verticalFit: FitResult;
  horizontalFit: FitResult;
}

const PrintableOrder: React.FC<PrintableOrderProps> = ({
  jobDescription,
  paperType,
  desiredQuantity,
  totalPages,
  itemsPerPage,
  bestOrientation,
  objectDimensions,
  areaDimensions,
  verticalFit,
  horizontalFit
}) => {
    
    let orientationText = 'Não aplicável';
    if (bestOrientation === 'vertical') {
        orientationText = `Vertical (${verticalFit.itemsPerWidth} x ${verticalFit.itemsPerHeight} por folha)`;
    } else if (bestOrientation === 'horizontal') {
        orientationText = `Horizontal (${horizontalFit.itemsPerWidth} x ${horizontalFit.itemsPerHeight} por folha)`;
    } else if (bestOrientation === 'tie') {
        orientationText = `Empate (${verticalFit.total} por folha)`;
    }

    return (
        <div className="p-2 font-sans text-black bg-white">
            <header className="flex justify-between items-center border-b-2 border-black pb-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold">ORDEM DE SERVIÇO</h1>
                    <p className="text-sm">GRÁFICA EXEMPLO</p>
                </div>
                <p className="text-sm">Data de Emissão: {new Date().toLocaleDateString('pt-BR')}</p>
            </header>

            <section className="mb-8">
                <h2 className="text-xl font-semibold border-b border-black pb-2 mb-4">Detalhes do Trabalho</h2>
                <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-base">
                    <div>
                        <strong className="font-semibold">Descrição:</strong>
                        <p className="pl-2">{jobDescription || 'Não especificado'}</p>
                    </div>
                     <div>
                        <strong className="font-semibold">Quantidade Desejada:</strong>
                        <p className="pl-2">{desiredQuantity} unidades</p>
                    </div>
                    <div>
                        <strong className="font-semibold">Tipo de Papel:</strong>
                        <p className="pl-2">{paperType}</p>
                    </div>
                    <div>
                        <strong className="font-semibold">Dimensões do Item:</strong>
                        <p className="pl-2">{objectDimensions.width} x {objectDimensions.height} cm</p>
                    </div>
                </div>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold border-b border-black pb-2 mb-4">Especificações de Produção</h2>
                 <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-base">
                    <div>
                        <strong className="font-semibold">Orientação Ideal:</strong>
                        <p className="pl-2">{orientationText}</p>
                    </div>
                    <div>
                        <strong className="font-semibold">Itens por Página:</strong>
                        <p className="pl-2">{itemsPerPage}</p>
                    </div>
                     <div>
                        <strong className="font-semibold">Total de Páginas:</strong>
                        <p className="pl-2">{totalPages}</p>
                    </div>
                    <div>
                        <strong className="font-semibold">Dimensões do Papel:</strong>
                        <p className="pl-2">{areaDimensions.width} x {areaDimensions.height} cm</p>
                    </div>
                </div>
            </section>
            
            <section>
                <h2 className="text-xl font-semibold border-b border-black pb-2 mb-4">Observações Adicionais</h2>
                <div className="border border-dashed border-black p-4 h-40 rounded">
                    {/* Empty space for notes */}
                </div>
            </section>
            
             <footer className="mt-12 pt-4 border-t border-black text-center text-xs text-gray-600">
                <p>Confira todas as especificações e a prova de impressão antes de iniciar a produção em larga escala.</p>
                <p>O corte e as cores podem sofrer variações mínimas.</p>
             </footer>
        </div>
    )
};

export default PrintableOrder;
