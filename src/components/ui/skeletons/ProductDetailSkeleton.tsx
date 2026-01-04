
import { Skeleton } from "@/components/ui/skeleton"

export function ProductDetailSkeleton() {
    return (
        <div className="container-premium py-8 min-h-screen">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                {/* Image Skeleton */}
                <div className="space-y-4">
                    <Skeleton className="h-[400px] w-full rounded-lg" />
                    <div className="flex gap-4 overflow-x-auto pb-2">
                        {[1, 2, 3, 4].map((i) => (
                            <Skeleton key={i} className="h-20 w-20 rounded-md flex-shrink-0" />
                        ))}
                    </div>
                </div>

                {/* Info Skeleton */}
                <div className="space-y-6">
                    <Skeleton className="h-10 w-3/4" /> {/* Title */}
                    <div className="flex gap-4 items-center">
                        <Skeleton className="h-6 w-24" /> {/* Rating */}
                        <Skeleton className="h-6 w-24" /> {/* Status */}
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-32" /> {/* Price */}
                        <Skeleton className="h-4 w-48" /> {/* Tax info */}
                    </div>

                    <div className="pt-6 space-y-4">
                        <Skeleton className="h-12 w-full" /> {/* Size/Variants */}
                        <Skeleton className="h-12 w-full" />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <Skeleton className="h-12 w-32" /> {/* Quantity */}
                        <Skeleton className="h-12 flex-1" /> {/* Add to Cart */}
                    </div>

                    <div className="pt-8 space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                    </div>
                </div>
            </div>
        </div>
    )
}
