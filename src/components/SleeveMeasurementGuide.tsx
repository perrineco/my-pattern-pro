import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import { Category } from "@/types/sloper";

interface SleeveMeasurementGuideProps {
  category: Category;
}

export function SleeveMeasurementGuide({ category }: SleeveMeasurementGuideProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
          <HelpCircle className="w-4 h-4" />
          How to measureUU
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">Sleeve Measurement Guide</DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 mt-4">
          <div className="flex justify-center">
            <ArmDiagram category={category} />
          </div>

          <div className="space-y-4">
            <MeasurementInstruction
              number={1}
              name="Upper Arm"
              color="hsl(var(--primary))"
              description="Measure around the fullest part of your upper arm (bicep). Keep the tape snug but not tight, with your arm relaxed at your side."
            />
            <MeasurementInstruction
              number={2}
              name="Wrist"
              color="hsl(var(--destructive))"
              description="Measure around your wrist bone. Keep the tape comfortably snug, allowing for natural movement."
            />
            <MeasurementInstruction
              number={3}
              name="Sleeve Length"
              color="hsl(var(--chart-3))"
              description="Measure from the shoulder point (where shoulder meets arm) straight down to the wrist bone. Keep your arm slightly bent."
            />
            <MeasurementInstruction
              number={4}
              name="Elbow Length"
              color="hsl(var(--chart-4))"
              description="Measure from the shoulder point down to the elbow. Bend your arm slightly to locate the elbow point accurately."
            />
            <MeasurementInstruction
              number={5}
              name="Armhole Depth"
              color="hsl(var(--chart-5))"
              description="This is the sleeve cap height. Measure from shoulder point to underarm level (approximately 2-3cm below the armpit)."
            />
          </div>
        </div>

        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium mb-2">Tips for accurate measurements</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Wear a fitted shirt or measure over undergarments</li>
            <li>• Keep your arm relaxed and slightly bent at the elbow</li>
            <li>• Have someone help you measure for better accuracy</li>
            <li>• Take each measurement twice and use the average</li>
            <li>• Stand naturally—don't flex your arm muscles</li>
          </ul>
        </div>
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
        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
        style={{ backgroundColor: color }}
      >
        {number}
      </div>
      <div>
        <h4 className="font-medium text-foreground">{name}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

interface ArmDiagramProps {
  category: Category;
}

function ArmDiagram({ category }: ArmDiagramProps) {
  const isKids = category === "kids";
  const isMen = category === "men";

  // Adjust proportions based on category
  const armScale = isKids ? 0.75 : 1;
  const armWidth = isMen ? 28 : 24;
  const wristWidth = isMen ? 18 : 15;

  // Key positions (scaled)
  const shoulderY = 40;
  const underarmY = shoulderY + 50 * armScale;
  const elbowY = shoulderY + 140 * armScale;
  const wristY = shoulderY + 260 * armScale;

  const centerX = 100;

  return (
    <svg viewBox="0 0 200 340" className="w-full max-w-[180px]">
      {/* Shoulder area (partial torso) */}
      <path
        d={`
           M ${centerX - 50} ${shoulderY - 20}
           Q ${centerX - 30} ${shoulderY - 25} ${centerX} ${shoulderY - 20}
           Q ${centerX + 30} ${shoulderY - 25} ${centerX + 50} ${shoulderY - 20}
           L ${centerX + 50} ${shoulderY + 10}
           Q ${centerX + 40} ${shoulderY + 20} ${centerX + armWidth / 2 + 5} ${underarmY}
         `}
        fill="none"
        stroke="hsl(var(--border))"
        strokeWidth="2"
      />

      {/* Left side of torso fade */}
      <path
        d={`
           M ${centerX - 50} ${shoulderY - 20}
           L ${centerX - 50} ${underarmY + 20}
         `}
        fill="none"
        stroke="hsl(var(--border))"
        strokeWidth="2"
        strokeDasharray="4,4"
      />

      {/* Arm outline - outer edge (back of arm) */}
      <path
        d={`
           M ${centerX + armWidth / 2 + 5} ${underarmY}
           Q ${centerX + armWidth / 2 + 8} ${(underarmY + elbowY) / 2} ${centerX + armWidth / 2 + 3} ${elbowY}
           Q ${centerX + wristWidth / 2 + 5} ${(elbowY + wristY) / 2} ${centerX + wristWidth / 2} ${wristY}
         `}
        fill="none"
        stroke="hsl(var(--border))"
        strokeWidth="2"
      />

      {/* Arm outline - inner edge (front of arm) */}
      <path
        d={`
           M ${centerX - armWidth / 2 - 5} ${underarmY}
           Q ${centerX - armWidth / 2 - 3} ${(underarmY + elbowY) / 2} ${centerX - armWidth / 2} ${elbowY}
           Q ${centerX - wristWidth / 2 - 2} ${(elbowY + wristY) / 2} ${centerX - wristWidth / 2} ${wristY}
         `}
        fill="none"
        stroke="hsl(var(--border))"
        strokeWidth="2"
      />

      {/* Connect underarm to torso */}
      <path
        d={`
           M ${centerX - armWidth / 2 - 5} ${underarmY}
           Q ${centerX - 35} ${underarmY - 10} ${centerX - 50} ${underarmY + 20}
         `}
        fill="none"
        stroke="hsl(var(--border))"
        strokeWidth="2"
      />

      {/* Wrist/hand base */}
      <ellipse
        cx={centerX}
        cy={wristY + 5}
        rx={wristWidth / 2 + 3}
        ry={8}
        fill="none"
        stroke="hsl(var(--border))"
        strokeWidth="2"
      />

      {/* ===== MEASUREMENT LINES ===== */}

      {/* 1. Upper Arm circumference */}
      <ellipse
        cx={centerX}
        cy={underarmY + 15}
        rx={armWidth / 2 + 8}
        ry={6}
        fill="none"
        stroke="hsl(var(--primary))"
        strokeWidth="2"
        strokeDasharray="6,3"
      />
      <circle cx={centerX + armWidth / 2 + 15} cy={underarmY + 15} r="10" fill="hsl(var(--primary))" />
      <text
        x={centerX + armWidth / 2 + 15}
        y={underarmY + 19}
        textAnchor="middle"
        className="fill-primary-foreground text-xs font-bold"
      >
        1
      </text>

      {/* 2. Wrist circumference */}
      <ellipse
        cx={centerX}
        cy={wristY - 5}
        rx={wristWidth / 2 + 5}
        ry={5}
        fill="none"
        stroke="hsl(var(--destructive))"
        strokeWidth="2"
        strokeDasharray="6,3"
      />
      <circle cx={centerX + wristWidth / 2 + 12} cy={wristY - 5} r="10" fill="hsl(var(--destructive))" />
      <text
        x={centerX + wristWidth / 2 + 12}
        y={wristY - 1}
        textAnchor="middle"
        className="fill-destructive-foreground text-xs font-bold"
      >
        2
      </text>

      {/* 3. Sleeve Length (shoulder to wrist) */}
      <line
        x1={centerX - armWidth / 2 - 25}
        y1={shoulderY}
        x2={centerX - armWidth / 2 - 25}
        y2={wristY}
        stroke="hsl(var(--chart-3))"
        strokeWidth="2"
      />
      <line
        x1={centerX - armWidth / 2 - 30}
        y1={shoulderY}
        x2={centerX - armWidth / 2 - 20}
        y2={shoulderY}
        stroke="hsl(var(--chart-3))"
        strokeWidth="2"
      />
      <line
        x1={centerX - armWidth / 2 - 30}
        y1={wristY}
        x2={centerX - armWidth / 2 - 20}
        y2={wristY}
        stroke="hsl(var(--chart-3))"
        strokeWidth="2"
      />
      <circle cx={centerX - armWidth / 2 - 25} cy={(shoulderY + wristY) / 2} r="10" fill="hsl(var(--chart-3))" />
      <text
        x={centerX - armWidth / 2 - 25}
        y={(shoulderY + wristY) / 2 + 4}
        textAnchor="middle"
        className="fill-white text-xs font-bold"
      >
        3
      </text>

      {/* 4. Elbow Length (shoulder to elbow) */}
      <line
        x1={centerX + armWidth / 2 + 30}
        y1={shoulderY}
        x2={centerX + armWidth / 2 + 30}
        y2={elbowY}
        stroke="hsl(var(--chart-4))"
        strokeWidth="2"
      />
      <line
        x1={centerX + armWidth / 2 + 25}
        y1={shoulderY}
        x2={centerX + armWidth / 2 + 35}
        y2={shoulderY}
        stroke="hsl(var(--chart-4))"
        strokeWidth="2"
      />
      <line
        x1={centerX + armWidth / 2 + 25}
        y1={elbowY}
        x2={centerX + armWidth / 2 + 35}
        y2={elbowY}
        stroke="hsl(var(--chart-4))"
        strokeWidth="2"
      />
      <circle cx={centerX + armWidth / 2 + 30} cy={(shoulderY + elbowY) / 2} r="10" fill="hsl(var(--chart-4))" />
      <text
        x={centerX + armWidth / 2 + 30}
        y={(shoulderY + elbowY) / 2 + 4}
        textAnchor="middle"
        className="fill-white text-xs font-bold"
      >
        4
      </text>

      {/* 5. Armhole Depth (shoulder to underarm) */}
      <line
        x1={centerX + armWidth / 2 + 50}
        y1={shoulderY}
        x2={centerX + armWidth / 2 + 50}
        y2={underarmY}
        stroke="hsl(var(--chart-5))"
        strokeWidth="2"
      />
      <line
        x1={centerX + armWidth / 2 + 45}
        y1={shoulderY}
        x2={centerX + armWidth / 2 + 55}
        y2={shoulderY}
        stroke="hsl(var(--chart-5))"
        strokeWidth="2"
      />
      <line
        x1={centerX + armWidth / 2 + 45}
        y1={underarmY}
        x2={centerX + armWidth / 2 + 55}
        y2={underarmY}
        stroke="hsl(var(--chart-5))"
        strokeWidth="2"
      />
      <circle cx={centerX + armWidth / 2 + 50} cy={(shoulderY + underarmY) / 2} r="10" fill="hsl(var(--chart-5))" />
      <text
        x={centerX + armWidth / 2 + 50}
        y={(shoulderY + underarmY) / 2 + 4}
        textAnchor="middle"
        className="fill-white text-xs font-bold"
      >
        5
      </text>

      {/* Shoulder point marker */}
      <circle cx={centerX} cy={shoulderY} r="4" fill="hsl(var(--foreground))" />
      <text x={centerX} y={shoulderY - 12} textAnchor="middle" className="fill-muted-foreground text-[9px]">
        Shoulder point
      </text>

      {/* Elbow marker */}
      <circle cx={centerX} cy={elbowY} r="3" fill="hsl(var(--muted-foreground))" />
      <text x={centerX - 25} y={elbowY + 4} textAnchor="end" className="fill-muted-foreground text-[9px]">
        Elbow
      </text>
    </svg>
  );
}
