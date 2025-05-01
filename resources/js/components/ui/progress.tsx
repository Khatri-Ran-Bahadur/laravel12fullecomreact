import React from 'react';
import clsx from 'clsx';

export function Progress({
  value = 0,
  className,
}: {
  value?: number;
  className?: string;
}) {
  return (
    <div className={clsx('relative h-2 w-full overflow-hidden rounded bg-gray-200 dark:bg-gray-700', className)}>
      <div
        className="absolute left-0 top-0 h-full bg-primary dark:bg-primary-light transition-all duration-300"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
