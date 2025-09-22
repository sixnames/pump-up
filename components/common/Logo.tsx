import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';

const iconVariants = cva('overflow-hidden rounded-md bg-background shadow-xs app-logo', {
  variants: {
    size: {
      sm: 'w-[18px] h-[18px]',
      md: 'w-[22px] h-[22px]',
      lg: 'w-[26px] h-[26px]',
      xl: 'w-[30px] h-[30px]',
    },
  },
  defaultVariants: {
    size: 'sm',
  },
});

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function Logo({ size = 'sm' }: LogoProps) {
  return (
    <div
      className={cn('transition-all', iconVariants({ size }), {
        'app-logo_sm': size === 'sm',
        'app-logo_md': size === 'md',
        'app-logo_lg': size === 'lg',
        'app-logo_xl': size === 'xl',
      })}
    >
      <svg viewBox='0 0 1024 1024' className='w-full h-auto app-logo__icon' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <rect x='0' y='0' width='1024' height='1024' fill='#800000' />
        <path
          d='M512 941.599L1024 685.6V480.8L512 736.799L0 480.8V685.6L512 941.599ZM512 583.2L1024 327.201V122.401L512 378.4L0 122.401V327.201L512 583.2Z'
          fill='white'
        />
      </svg>
    </div>
  );
}
