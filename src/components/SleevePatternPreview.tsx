import { SleeveMeasurements, Category } from '@/types/sloper';
import { SleevePanel } from '@/components/sleeve/SleevePanel';
import { SleeveLegend } from '@/components/sleeve/SleeveLegend';

interface SleevePatternPreviewProps {
  measurements: SleeveMeasurements;
  category: Category;
}

export function SleevePatternPreview({ measurements, category }: SleevePatternPreviewProps) {
  return (
    <div className="w-full">
      <div className="flex flex-col items-center gap-6">
        <SleevePanel measurements={measurements} category={category} />
        <SleeveLegend />
      </div>
    </div>
  );
}
