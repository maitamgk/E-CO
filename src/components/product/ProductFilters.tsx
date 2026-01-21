import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { categories } from '@/data/mockProducts';

interface ProductFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
}

export const ProductFilters = ({
  search,
  onSearchChange,
  category,
  onCategoryChange,
}: ProductFiltersProps) => {
  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <Input
          placeholder="Tìm kiếm sản phẩm..."
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          className="pl-12 pr-10 h-12 text-base rounded-xl border-2 focus:border-primary transition-colors"
        />
        {search && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <Button
            key={cat.id}
            variant={category === cat.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => onCategoryChange(cat.id)}
            className={`rounded-full px-4 transition-all duration-300 ${
              category === cat.id 
                ? 'shadow-lg shadow-primary/25' 
                : 'hover:border-primary/50 hover:text-primary'
            }`}
          >
            {cat.name}
          </Button>
        ))}
      </div>
    </div>
  );
};
