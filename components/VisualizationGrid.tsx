
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
  const objectTooltip = `Objeto: ${object.width.toFixed(2)}cm x ${object.height.toFixed(2)}cm`;

  return (
    <div ref={containerRef} className="w-full h-[250px] flex items-center justify-center bg-slate-100 rounded-lg p-2">
      <div 
        style={{
          ...renderedAreaStyle,
          gap: `${scaledGap}px`,
        }}
        className="bg-slate-300 flex flex-wrap content-start overflow-hidden"
        title={areaTooltip}
      >
        {fitResult.total > 0 && Array.from({ length: fitResult.total }).map((_, i) => (
          <div
            key={i}
            style={renderedObjectStyle}
            className={`
              box-border flex-shrink-0
              ${isBestFit ? 'bg-green-500/80 border-green-700' : 'bg-sky-500/80 border-sky-700'}
              border-2 border-dashed
            `}
            title={objectTooltip}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default VisualizationGrid;