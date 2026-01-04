import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

export interface FilterOption {
    label: string;
    value: string | number;
    count?: number;
}

export interface SidebarFiltersProps {
    filters: {
        category: string;
        priceRange: number[];
        brands: string[];
        colors: string[];
        discountRange: string[];
        [key: string]: any; // Allow other properties
    };
    handlePriceChange: (value: number[]) => void;
    handleCheckboxChange: (type: 'brands' | 'colors' | 'discountRange', value: string) => void;
    clearFilters: () => void;
    brandOptions: FilterOption[];
    colorOptions: FilterOption[];
    discountOptions: FilterOption[];
}

export function SidebarFilters({
    filters,
    handlePriceChange,
    handleCheckboxChange,
    clearFilters,
    brandOptions,
    colorOptions,
    discountOptions
}: SidebarFiltersProps) {
    return (
        <div className="flex flex-col gap-6">
            {/* Price */}
            <div className="border-b border-gray-100 pb-6">
                <h3 className="font-semibold mb-4">Price</h3>
                <Slider
                    value={filters.priceRange}
                    min={0}
                    max={50000}
                    step={500}
                    onValueChange={handlePriceChange}
                />
                <div className="flex justify-between text-sm mt-2 font-medium text-muted-foreground">
                    <span>₹{filters.priceRange[0]}</span>
                    <span>₹{filters.priceRange[1]}</span>
                </div>
            </div>

            {/* Brands */}
            <div className="border-b border-gray-100 pb-6">
                <h3 className="font-semibold mb-4">Brands</h3>
                <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                    {brandOptions.map(b => (
                        <label key={b.value} className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
                            <Checkbox
                                checked={filters.brands?.includes(b.value as string)}
                                onCheckedChange={() => handleCheckboxChange('brands', b.value as string)}
                            />
                            <span className="text-sm">{b.label} {b.count && <span className="text-muted-foreground text-xs">({b.count})</span>}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Colors */}
            <div className="border-b border-gray-100 pb-6">
                <h3 className="font-semibold mb-4">Colors</h3>
                <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                    {colorOptions.map(c => (
                        <label key={c.value} className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
                            <Checkbox
                                checked={filters.colors?.includes(c.value as string)}
                                onCheckedChange={() => handleCheckboxChange('colors', c.value as string)}
                            />
                            <span className="text-sm">{c.label} {c.count && <span className="text-muted-foreground text-xs">({c.count})</span>}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Discount */}
            <div className="border-b border-gray-100 pb-6">
                <h3 className="font-semibold mb-4">Discount</h3>
                <div className="flex flex-col gap-2">
                    {discountOptions.map(d => (
                        <label key={d.value} className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
                            <Checkbox
                                checked={filters.discountRange?.includes(d.value as string)}
                                onCheckedChange={() => handleCheckboxChange('discountRange', d.value as string)}
                            />
                            <span className="text-sm">{d.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Clear Filters */}
            <Button variant="outline" size="sm" onClick={clearFilters} className="w-full">Clear All Filters</Button>
        </div>
    );
}
