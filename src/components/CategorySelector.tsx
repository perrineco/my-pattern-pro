import { Category } from '@/types/sloper';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface CategorySelectorProps {
  selected: Category;
  onSelect: (category: Category) => void;
}

const categories: { value: Category; labelKey: string; icon: string }[] = [
  { value: 'women', labelKey: 'category.women', icon: '♀' },
  { value: 'men', labelKey: 'category.men', icon: '♂' },
  { value: 'kids', labelKey: 'category.kids', icon: '★' },
];

export function CategorySelector({ selected, onSelect }: CategorySelectorProps) {
  const { t } = useLanguage();
  
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
          <span>{t(cat.labelKey)}</span>
        </button>
      ))}
    </div>
  );
}
