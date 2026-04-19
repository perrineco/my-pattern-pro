import { createContext, useContext, useState, ReactNode } from 'react';
import { MeasurementUnit } from '@/components/UnitToggle';

interface UnitContextType {
  unit: MeasurementUnit;
  setUnit: (unit: MeasurementUnit) => void;
}

const UnitContext = createContext<UnitContextType | undefined>(undefined);

export function UnitProvider({ children }: { children: ReactNode }) {
  const [unit, setUnitState] = useState<MeasurementUnit>(() => {
    return (localStorage.getItem('preferred-unit') as MeasurementUnit) || 'cm';
  });

  const setUnit = (u: MeasurementUnit) => {
    localStorage.setItem('preferred-unit', u);
    setUnitState(u);
  };

  return (
    <UnitContext.Provider value={{ unit, setUnit }}>
      {children}
    </UnitContext.Provider>
  );
}

export function useUnit() {
  const ctx = useContext(UnitContext);
  if (!ctx) throw new Error('useUnit must be used within UnitProvider');
  return ctx;
}
