import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';

const iconVariants = cva('overflow-hidden shadow-xs app-logo', {
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
      className={cn('transition-all rounded-full bg-white', iconVariants({ size }), {
        'app-logo_sm': size === 'sm',
        'app-logo_md': size === 'md',
        'app-logo_lg': size === 'lg',
        'app-logo_xl': size === 'xl',
      })}
    >
      <svg viewBox='0 0 1024 1024' className='w-full h-auto app-logo__icon' fill='white' xmlns='http://www.w3.org/2000/svg'>
        <path
          fill='none'
          stroke='#e6e7e9'
          strokeLinejoin='miter'
          strokeLinecap='round'
          strokeMiterlimit='4'
          strokeWidth='32'
          d='M1008 512c0 273.934-222.066 496-496 496s-496-222.066-496-496c0-273.934 222.066-496 496-496s496 222.066 496 496z'
        />
        <path
          fill='none'
          stroke='#ff6b3a'
          strokeLinejoin='miter'
          strokeLinecap='round'
          strokeMiterlimit='4'
          strokeWidth='32'
          d='M1008 512c0 273.934-222.066 496-496 496s-496-222.066-496-496c0-273.934 222.066-496 496-496s496 222.066 496 496z'
        />
        <path fill='#222' d='M140 450h744c34.242 0 62 27.758 62 62s-27.758 62-62 62h-744c-34.242 0-62-27.758-62-62s27.758-62 62-62z' />
        <path
          fill='#222'
          d='M36.668 326h41.332c11.414 0 20.668 9.253 20.668 20.668v372c0 11.414-9.253 20.668-20.668 20.668h-41.332c-11.414 0-20.668-9.253-20.668-20.668v-372c0-11.414 9.253-20.668 20.668-20.668z'
        />
        <path
          fill='#222'
          d='M109 284.668h62c17.12 0 31 13.879 31 31v434c0 17.12-13.879 31-31 31h-62c-17.12 0-31-13.879-31-31v-434c0-17.12 13.879-31 31-31z'
        />
        <path
          fill='#222'
          d='M946 326h41.332c11.414 0 20.668 9.253 20.668 20.668v372c0 11.414-9.253 20.668-20.668 20.668h-41.332c-11.414 0-20.668-9.253-20.668-20.668v-372c0-11.414 9.253-20.668 20.668-20.668z'
        />
        <path
          fill='#222'
          d='M853 284.668h62c17.12 0 31 13.879 31 31v434c0 17.12-13.879 31-31 31h-62c-17.12 0-31-13.879-31-31v-434c0-17.12 13.879-31 31-31z'
        />
        <path
          fill='rgba(0, 0, 0, 0.08)'
          opacity='0.06'
          d='M217.5 475.832h589c8.56 0 15.5 6.94 15.5 15.5s-6.94 15.5-15.5 15.5h-589c-8.56 0-15.5-6.94-15.5-15.5s6.94-15.5 15.5-15.5z'
        />
      </svg>
    </div>
  );
}
