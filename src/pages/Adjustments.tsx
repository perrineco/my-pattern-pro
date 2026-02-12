import { Header } from '@/components/Header';
import { ArrowLeft, AlertCircle, Ruler, Scissors } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const adjustments = [
  {
    title: "Armhole too deep or flat at the underarm",
    icon: <Ruler className="w-5 h-5" />,
    problem: "The armhole shape drops too low or appears too flat under the arm, causing discomfort or poor fit.",
    solution: "Add ease to the across back (carrure dos) measurement. This will narrow the underarm and extend the shoulder length, lifting the armhole into a better position.",
    tip: "Try adding 1–2 cm to the back width and redraft to see the effect."
  },
  {
    title: "Shoulder seam falls off the shoulder",
    icon: <Ruler className="w-5 h-5" />,
    problem: "The shoulder seam extends past the shoulder point, creating a dropped-shoulder look when you intended a fitted one.",
    solution: "Reduce the shoulder length measurement by 0.5–1 cm. You can also check that your back width measurement isn't too wide, as this can push the shoulder out.",
    tip: "Mark your shoulder point precisely—it's where the arm begins to curve downward."
  },
  {
    title: "Bodice is too tight across the chest",
    icon: <Scissors className="w-5 h-5" />,
    problem: "The front or back feels restrictive across the bust or upper chest area, pulling at the armhole.",
    solution: "Increase the bust ease. For woven fabrics, ensure you have at least 4–6 cm of total ease. For knits, you may use 0 to negative ease depending on stretch.",
    tip: "Always check ease against the intended fabric type before cutting."
  },
  {
    title: "Neckline gaps or stands away from the body",
    icon: <AlertCircle className="w-5 h-5" />,
    problem: "The neckline doesn't sit flat against the base of the neck, creating gaps especially at the front or back.",
    solution: "Reduce the neckline circumference slightly (0.5–1 cm) or adjust the front/back neckline depth. A shallower neckline depth will bring the edge closer to the neck.",
    tip: "Pin-fit a muslin to determine exactly where the gap occurs before adjusting the pattern."
  },
  {
    title: "Back length is too long or too short",
    icon: <Ruler className="w-5 h-5" />,
    problem: "The waistline of the bodice doesn't align with your natural waist—either riding up or dropping below.",
    solution: "Adjust the back length (longueur taille-dos) measurement. Lengthen or shorten by the exact difference between your measured waist and the pattern waistline.",
    tip: "Measure from the prominent bone at the nape of the neck straight down to a tie around your natural waist."
  },
  {
    title: "Skirt rides up at the back",
    icon: <Scissors className="w-5 h-5" />,
    problem: "The back hemline of the skirt is shorter than the front, often caused by a prominent seat.",
    solution: "Add length to the center back of the skirt pattern. Typically 1–3 cm is enough. Taper the addition to nothing at the side seam.",
    tip: "Compare front and back measurements from waist to floor to quantify the difference."
  },
  {
    title: "Pants crotch is too tight or too loose",
    icon: <AlertCircle className="w-5 h-5" />,
    problem: "The crotch area pulls uncomfortably or has excess fabric hanging below.",
    solution: "For a tight crotch, lower the crotch point by 1–2 cm and add to the crotch extension. For a loose crotch, raise the crotch point and reduce the extension.",
    tip: "Sit down while pin-fitting to check crotch ease—you need at least 2.5 cm of ease when seated."
  },
];

export default function Adjustments() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="mb-6 text-muted-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </Button>

        <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
          Sloper Adjustment Guide
        </h1>
        <p className="text-muted-foreground mb-8">
          Your drafted sloper is a starting point. Here are common fit issues and how to correct them by adjusting your measurements or the pattern.
        </p>

        <div className="space-y-6">
          {adjustments.map((item, i) => (
            <div
              key={i}
              className="border border-border rounded-lg p-5 bg-card"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="mt-0.5 text-primary">{item.icon}</div>
                <h2 className="font-serif text-lg font-semibold text-foreground">
                  {item.title}
                </h2>
              </div>
              <div className="ml-8 space-y-2 text-sm">
                <p>
                  <span className="font-medium text-foreground">Problem: </span>
                  <span className="text-muted-foreground">{item.problem}</span>
                </p>
                <p>
                  <span className="font-medium text-foreground">Solution: </span>
                  <span className="text-muted-foreground">{item.solution}</span>
                </p>
                <p className="text-xs text-muted-foreground/80 italic border-l-2 border-primary/30 pl-3 mt-2">
                  💡 {item.tip}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
