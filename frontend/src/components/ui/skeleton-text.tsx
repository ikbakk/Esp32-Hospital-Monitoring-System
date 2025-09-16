"use client";

import { Skeleton } from "@/components/ui/skeleton";

interface SkeletonTextProps {
  loading: boolean;
  children: React.ReactNode;
  className?: string;
  skeletonClassName?: string;
}

export default function SkeletonText({
  loading,
  children,
  className,
  skeletonClassName,
}: SkeletonTextProps) {
  if (loading) {
    return <Skeleton className={skeletonClassName ?? className} />;
  }
  return <span className={className}>{children}</span>;
}
