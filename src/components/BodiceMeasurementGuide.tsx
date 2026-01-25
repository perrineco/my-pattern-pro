import { HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Category } from '@/types/sloper';
import { ScrollArea } from '@/components/ui/scroll-area';

interface BodiceMeasurementGuideProps {
  category: Category;
}

export function BodiceMeasurementGuide({ category }: BodiceMeasurementGuideProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
          <HelpCircle className="w-4 h-4 mr-1" />
          How to measure
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">Bodice Measurement Guide</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[65vh] pr-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex justify-center">
              <BodiceBodyDiagram category={category} />
            </div>
            <div className="space-y-4">
              <MeasurementInstruction
                number={1}
                name="Bust"
                color="hsl(var(--primary))"
                description="Measure around the fullest part of the bust, keeping the tape level."
              />
              <MeasurementInstruction
                number={2}
                name="Waist"
                color="hsl(var(--chart-2))"
                description="Measure at your natural waistline, the narrowest part of your torso."
              />
              <MeasurementInstruction
                number={3}
                name="Shoulder to Waist"
                color="hsl(var(--chart-3))"
                description="From the shoulder point (where sleeve would attach) down to the waist."
              />
              <MeasurementInstruction
                number={4}
                name="Bust Height"
                color="hsl(var(--chart-4))"
                description="From the shoulder point down to the apex of the bust."
              />
              <MeasurementInstruction
                number={5}
                name="Shoulder Width"
                color="hsl(var(--chart-5))"
                description="Across the back from one shoulder point to the other."
              />
              <MeasurementInstruction
                number={6}
                name="Armhole Depth"
                color="hsl(15 55% 42%)"
                description="From the shoulder point straight down to the underarm level."
              />
              <MeasurementInstruction
                number={7}
                name="Back Width"
                color="hsl(200 55% 45%)"
                description="Across the back between the armholes, about 10cm below the nape."
              />
              <MeasurementInstruction
                number={8}
                name="Neck Width"
                color="hsl(280 55% 55%)"
                description="Measure across the base of the neck from side to side."
              />
            </div>
          </div>

          <div className="mt-6 p-4 bg-secondary/50 rounded-lg">
            <h4 className="font-medium text-foreground mb-2">Tips for Accurate Measurements</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Wear a well-fitting bra (for bust measurements)</li>
              <li>• Stand naturally with arms relaxed at sides</li>
              <li>• Keep the tape snug but not tight</li>
              <li>• Have someone help for back measurements</li>
              <li>• Take measurements over fitted clothing or undergarments</li>
            </ul>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

interface MeasurementInstructionProps {
  number: number;
  name: string;
  color: string;
  description: string;
}

function MeasurementInstruction({ number, name, color, description }: MeasurementInstructionProps) {
  return (
    <div className="flex gap-3">
      <div
        className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
        style={{ backgroundColor: color }}
      >
        {number}
      </div>
      <div>
        <div className="font-medium text-foreground">{name}</div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function BodiceBodyDiagram({ category }: { category: Category }) {
  const isKids = category === 'kids';
  const isMen = category === 'men';

  // Adjust proportions based on category
  const bodyHeight = isKids ? 180 : 220;
  const shoulderWidth = isMen ? 90 : isKids ? 60 : 75;
  const bustWidth = isMen ? 85 : isKids ? 55 : 80;
  const waistWidth = isMen ? 75 : isKids ? 50 : 60;
  
  // Vertical positions
  const shoulderY = 50;
  const bustY = isKids ? 100 : isMen ? 110 : 105;
  const waistY = isKids ? 140 : isMen ? 165 : 155;
  const armholeY = isKids ? 85 : isMen ? 95 : 90;

  const centerX = 100;

  return (
    <svg
      viewBox="0 0 200 260"
      className="w-full max-w-[200px] h-auto"
    >
      {/* Head */}
      <ellipse
        cx={centerX}
        cy={25}
        rx={18}
        ry={22}
        fill="none"
        stroke="hsl(var(--border))"
        strokeWidth="2"
      />

      {/* Neck */}
      <path
        d={`M ${centerX - 8} 45 L ${centerX - 8} 55 M ${centerX + 8} 45 L ${centerX + 8} 55`}
        stroke="hsl(var(--border))"
        strokeWidth="2"
        fill="none"
      />

      {/* Body outline */}
      <path
        d={`
          M ${centerX - shoulderWidth / 2} ${shoulderY}
          Q ${centerX - shoulderWidth / 2 - 5} ${armholeY} ${centerX - bustWidth / 2} ${bustY}
          Q ${centerX - waistWidth / 2 - 5} ${(bustY + waistY) / 2} ${centerX - waistWidth / 2} ${waistY}
          L ${centerX - waistWidth / 2} ${bodyHeight}
          L ${centerX + waistWidth / 2} ${bodyHeight}
          L ${centerX + waistWidth / 2} ${waistY}
          Q ${centerX + waistWidth / 2 + 5} ${(bustY + waistY) / 2} ${centerX + bustWidth / 2} ${bustY}
          Q ${centerX + shoulderWidth / 2 + 5} ${armholeY} ${centerX + shoulderWidth / 2} ${shoulderY}
          L ${centerX + 8} 55
          Q ${centerX} 50 ${centerX - 8} 55
          L ${centerX - shoulderWidth / 2} ${shoulderY}
        `}
        fill="hsl(var(--pattern-fill))"
        stroke="hsl(var(--border))"
        strokeWidth="2"
      />

      {/* Arms (simplified) */}
      <path
        d={`M ${centerX - shoulderWidth / 2} ${shoulderY} Q ${centerX - shoulderWidth / 2 - 20} ${shoulderY + 40} ${centerX - shoulderWidth / 2 - 15} ${shoulderY + 80}`}
        stroke="hsl(var(--border))"
        strokeWidth="2"
        fill="none"
      />
      <path
        d={`M ${centerX + shoulderWidth / 2} ${shoulderY} Q ${centerX + shoulderWidth / 2 + 20} ${shoulderY + 40} ${centerX + shoulderWidth / 2 + 15} ${shoulderY + 80}`}
        stroke="hsl(var(--border))"
        strokeWidth="2"
        fill="none"
      />

      {/* 1: Bust line */}
      <line
        x1={centerX - bustWidth / 2 - 15}
        y1={bustY}
        x2={centerX + bustWidth / 2 + 15}
        y2={bustY}
        stroke="hsl(var(--primary))"
        strokeWidth="2"
        strokeDasharray="4,2"
      />
      <circle cx={centerX - bustWidth / 2 - 20} cy={bustY} r="8" fill="hsl(var(--primary))" />
      <text x={centerX - bustWidth / 2 - 20} y={bustY + 4} textAnchor="middle" className="fill-white text-[10px] font-bold">1</text>

      {/* 2: Waist line */}
      <line
        x1={centerX - waistWidth / 2 - 15}
        y1={waistY}
        x2={centerX + waistWidth / 2 + 15}
        y2={waistY}
        stroke="hsl(var(--chart-2))"
        strokeWidth="2"
        strokeDasharray="4,2"
      />
      <circle cx={centerX - waistWidth / 2 - 20} cy={waistY} r="8" fill="hsl(var(--chart-2))" />
      <text x={centerX - waistWidth / 2 - 20} y={waistY + 4} textAnchor="middle" className="fill-white text-[10px] font-bold">2</text>

      {/* 3: Shoulder to waist (right side) */}
      <line
        x1={centerX + shoulderWidth / 2}
        y1={shoulderY}
        x2={centerX + waistWidth / 2}
        y2={waistY}
        stroke="hsl(var(--chart-3))"
        strokeWidth="2"
      />
      <circle cx={centerX + shoulderWidth / 2 + 5} cy={(shoulderY + waistY) / 2} r="8" fill="hsl(var(--chart-3))" />
      <text x={centerX + shoulderWidth / 2 + 5} y={(shoulderY + waistY) / 2 + 4} textAnchor="middle" className="fill-white text-[10px] font-bold">3</text>

      {/* 4: Bust height (left side) */}
      <line
        x1={centerX - shoulderWidth / 2 + 10}
        y1={shoulderY}
        x2={centerX - bustWidth / 2 + 15}
        y2={bustY}
        stroke="hsl(var(--chart-4))"
        strokeWidth="2"
      />
      <circle cx={centerX - shoulderWidth / 2} cy={(shoulderY + bustY) / 2} r="8" fill="hsl(var(--chart-4))" />
      <text x={centerX - shoulderWidth / 2} y={(shoulderY + bustY) / 2 + 4} textAnchor="middle" className="fill-white text-[10px] font-bold">4</text>

      {/* 5: Shoulder width */}
      <line
        x1={centerX - shoulderWidth / 2}
        y1={shoulderY - 8}
        x2={centerX + shoulderWidth / 2}
        y2={shoulderY - 8}
        stroke="hsl(var(--chart-5))"
        strokeWidth="2"
      />
      <circle cx={centerX} cy={shoulderY - 12} r="8" fill="hsl(var(--chart-5))" />
      <text x={centerX} y={shoulderY - 8} textAnchor="middle" className="fill-white text-[10px] font-bold">5</text>

      {/* 6: Armhole depth (left) */}
      <line
        x1={centerX - shoulderWidth / 2 - 8}
        y1={shoulderY}
        x2={centerX - shoulderWidth / 2 - 8}
        y2={armholeY}
        stroke="hsl(15 55% 42%)"
        strokeWidth="2"
      />
      <circle cx={centerX - shoulderWidth / 2 - 12} cy={(shoulderY + armholeY) / 2} r="8" fill="hsl(15 55% 42%)" />
      <text x={centerX - shoulderWidth / 2 - 12} y={(shoulderY + armholeY) / 2 + 4} textAnchor="middle" className="fill-white text-[10px] font-bold">6</text>

      {/* 7: Back width marker */}
      <line
        x1={centerX - bustWidth / 2 + 5}
        y1={armholeY + 10}
        x2={centerX + bustWidth / 2 - 5}
        y2={armholeY + 10}
        stroke="hsl(200 55% 45%)"
        strokeWidth="2"
        strokeDasharray="3,2"
      />
      <circle cx={centerX + bustWidth / 2 + 5} cy={armholeY + 10} r="8" fill="hsl(200 55% 45%)" />
      <text x={centerX + bustWidth / 2 + 5} y={armholeY + 14} textAnchor="middle" className="fill-white text-[10px] font-bold">7</text>

      {/* 8: Neck width */}
      <line
        x1={centerX - 12}
        y1={55}
        x2={centerX + 12}
        y2={55}
        stroke="hsl(280 55% 55%)"
        strokeWidth="2"
      />
      <circle cx={centerX + 18} cy={55} r="8" fill="hsl(280 55% 55%)" />
      <text x={centerX + 18} y={59} textAnchor="middle" className="fill-white text-[10px] font-bold">8</text>
    </svg>
  );
}
