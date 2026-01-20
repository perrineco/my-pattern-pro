import { Category } from '@/types/sloper';
import { cn } from '@/lib/utils';

interface CategorySelectorProps {
  selected: Category;
  onSelect: (category: Category) => void;
}

const categories: { value: Category; label: string; icon: string }[] = [
  { value: 'women', label: 'Women', icon: '♀' },
  { value: 'men', label: 'Men', icon: '♂' },
  { value: 'kids', label: 'Kids', icon: '★' },
];

export function CategorySelector({ selected, onSelect }: CategorySelectorProps) {
  return (
    <div className="flex gap-2">
      {categories.map((cat) => (
        <button
          key={cat.value}
          onClick={() => onSelect(cat.value)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
            "border hover:border-primary/50",
            selected === cat.value
              ? "bg-primary text-primary-foreground border-primary shadow-sm"
              : "bg-card text-foreground border-border hover:bg-accent"
          )}
        >
          <span className="text-base">{cat.icon}</span>
          <span>{cat.label}</span>
        </button>
      ))}
    </div>
  );
}
