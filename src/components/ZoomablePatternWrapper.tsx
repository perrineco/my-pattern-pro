import { useRef, useState, useCallback, ReactNode } from "react";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ZoomablePatternWrapperProps {
  children: ReactNode;
  className?: string;
  minHeight?: string;
}

export function ZoomablePatternWrapper({ children, className = "", minHeight = "500px" }: ZoomablePatternWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const lastMouse = useRef({ x: 0, y: 0 });

  const clampZoom = (z: number) => Math.min(Math.max(z, 0.5), 5);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    // Pinch-to-zoom on trackpad sends ctrlKey=true
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      e.stopPropagation();
      const delta = -e.deltaY * 0.01;
      setZoom(prev => clampZoom(prev + delta));
    } else {
      // Two-finger scroll → pan
      e.preventDefault();
      setPan(prev => ({
        x: prev.x - e.deltaX,
        y: prev.y - e.deltaY,
      }));
    }
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      e.preventDefault();
      setIsPanning(true);
      lastMouse.current = { x: e.clientX, y: e.clientY };
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPanning) return;
    setPan(prev => ({
      x: prev.x + (e.clientX - lastMouse.current.x),
      y: prev.y + (e.clientY - lastMouse.current.y),
    }));
    lastMouse.current = { x: e.clientX, y: e.clientY };
  }, [isPanning]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const zoomIn = () => setZoom(prev => clampZoom(prev + 0.25));
  const zoomOut = () => setZoom(prev => clampZoom(prev - 0.25));

  const isDefault = zoom === 1 && pan.x === 0 && pan.y === 0;

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ minHeight }}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: "center center",
          transition: isPanning ? "none" : "transform 0.1s ease-out",
          width: "100%",
          height: "100%",
        }}
      >
        {children}
      </div>

      {/* Zoom controls */}
      <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-card/90 backdrop-blur-sm border border-border rounded-md p-1 z-10">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={zoomOut} title="Zoom out">
          <ZoomOut className="h-3.5 w-3.5" />
        </Button>
        <span className="text-[10px] text-muted-foreground min-w-[3ch] text-center">
          {Math.round(zoom * 100)}%
        </span>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={zoomIn} title="Zoom in">
          <ZoomIn className="h-3.5 w-3.5" />
        </Button>
        {!isDefault && (
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={resetView} title="Reset">
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
}
