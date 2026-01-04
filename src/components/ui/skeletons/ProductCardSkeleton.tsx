import React from 'react';

export const ProductCardSkeleton = () => {
    return (
        <div className="flex flex-col space-y-3">
            {/* Image Skeleton */}
            <div className="relative aspect-[6/7] w-full overflow-hidden rounded-lg bg-gray-200 animate-pulse">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
            </div>

            {/* Text Content Skeleton */}
            <div className="space-y-2">
                {/* Brand/Title */}
                <div className="h-3 w-1/3 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />

                {/* Price */}
                <div className="h-4 w-1/4 bg-gray-200 rounded animate-pulse mt-1" />
            </div>
        </div>
    );
};
