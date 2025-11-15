import React from 'react';
import type { FitResult } from '../types';

interface VisualizationGridProps {
  area: { width: number; height: number };
  object: { width: number; height: number };
  fitResult: FitResult;
  gap: number;
  isBestFit: boolean;
}

const VisualizationGrid: React.FC<VisualizationGridProps> = ({ area, object, fitResult, gap, isBestFit }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = React.useState({ width: 0, height: 0 });
  const [isDarkMode, setIsDarkMode] = React.useState(
    // Set initial value without waiting for useEffect to avoid a flicker
    () => typeof window !== 'undefined' && document.documentElement.classList.contains('dark')
  );

  React.useEffect(() => {
    // Observer for dark mode changes on the root element
    const observer = new MutationObserver(() => {
        setIsDarkMode(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    // Sync on mount in case it changed between initial render and effect run
    setIsDarkMode(document.documentElement.classList.contains('dark'));
    
    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({ width: containerRef.current.offsetWidth, height: 250 }); // Fixed height for consistency
      }
    };
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  if (!area.width || !area.height) return null;

  const scale = Math.min(containerSize.width / area.width, containerSize.height / area.height);
  
  const renderedAreaStyle = {
    width: `${area.width * scale}px`,
    height: `${area.height * scale}px`,
  };

  const renderedObjectStyle = {
    width: `${object.width * scale}px`,
    height: `${object.height * scale}px`,
  };

  const scaledGap = (gap || 0) * scale;

  // Calculate remaining space for tooltip
  const totalWidthUsed = fitResult.itemsPerWidth * object.width + (fitResult.itemsPerWidth > 1 ? (fitResult.itemsPerWidth - 1) * gap : 0);
  const totalHeightUsed = fitResult.itemsPerHeight * object.height + (fitResult.itemsPerHeight > 1 ? (fitResult.itemsPerHeight - 1) * gap : 0);
  const remainingWidth = area.width - totalWidthUsed;
  const remainingHeight = area.height - totalHeightUsed;
  const areaTooltip = `Área de sobra: ${remainingWidth.toFixed(2)}cm (largura) x ${remainingHeight.toFixed(2)}cm (altura)`;

  // Style for the gap visualization using a subtle pattern
  const gapColor = isDarkMode ? '#475569' : '#d1d5db'; // slate-600 for dark, slate-300 for light
  const gapVisualizationStyle = {
    ...renderedAreaStyle,
    gap: `${scaledGap}px`,
    backgroundImage: `
        linear-gradient(45deg, ${gapColor} 25%, transparent 25%), 
        linear-gradient(-45deg, ${gapColor} 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, ${gapColor} 75%),
        linear-gradient(-45deg, transparent 75%, ${gapColor} 75%)`,
    backgroundSize: '8px 8px',
    backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px'
  };

  return (
    <div
      ref={containerRef}
      className={`
        relative w-full h-[250px] flex items-center justify-center bg-slate-100 
        rounded-lg p-2 transition-all duration-300 dark:bg-slate-800
        ${isBestFit ? 'ring-2 ring-offset-2 ring-green-500 dark:ring-offset-slate-900' : ''}
      `}
    >
      <div 
        style={gapVisualizationStyle}
        className="bg-slate-200 flex flex-wrap content-start overflow-hidden dark:bg-slate-700"
        title={areaTooltip}
      >
        {fitResult.total > 0 && Array.from({ length: fitResult.total }).map((_, i) => {
          const tooltipText = `Obj: ${object.width.toFixed(2)} x ${object.height.toFixed(2)} cm | Sangria: ${gap.toFixed(2)} cm`;
          return (
            <div
              key={i}
              style={renderedObjectStyle}
              className="relative group box-border flex-shrink-0"
            >
              <div
                className={`
                  w-full h-full
                  ${isBestFit ? 'bg-green-500/80 border-green-700' : 'bg-sky-500/80 border-sky-700'}
                  border-2 border-dashed
                `}
              />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs p-2 text-center text-xs text-white bg-slate-800 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 dark:bg-black whitespace-nowrap">
                {tooltipText}
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-[6px] border-t-slate-800 dark:border-t-black"></div>
              </div>
            </div>
          );
        })}
      </div>
       {fitResult.total > 0 && (
        <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs font-bold px-2 py-1 rounded-md pointer-events-none backdrop-blur-sm">
            {fitResult.itemsPerWidth} x {fitResult.itemsPerHeight}
        </div>
      )}
    </div>
  );
};

export default VisualizationGrid;