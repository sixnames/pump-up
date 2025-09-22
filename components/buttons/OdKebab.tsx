import { OdButtonVariant } from '@/components/buttons/OdButton';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UrlConfigItem } from '@/lib/urlUtils';
import { cn } from '@/lib/utils';
import { DotsVerticalIcon } from '@radix-ui/react-icons';
import { UserRoundCog } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { Fragment, useState } from 'react';

interface KebabDialogCloseParams {
  redirectUrl: UrlConfigItem['url'];
}

export type KebabDialogBaseProps = {
  closeDialog: (params?: KebabDialogCloseParams) => void;
};

export type OdKebabBaseItemProps = {
  label: string;
  testId?: string;
  className?: string;
  hidden?: boolean;
  isDelete?: boolean;
  isWarning?: boolean;
};

export type OdKebabDialogState = boolean[];

export type OdKebabDialogItemProps = {
  variant: 'dialog';
  dialogContent: (props: KebabDialogBaseProps) => React.ReactNode;
};

export type OdKebabHandlerItemProps = {
  variant: 'handler';
  onClick: () => void | Promise<void>;
};

export type OdKebabItemProps = OdKebabBaseItemProps & (OdKebabHandlerItemProps | OdKebabDialogItemProps);

interface OdKebabProps {
  testId?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  variant?: OdButtonVariant;
  menuLabel?: string;
  menuLabelClassName?: string;
  items: OdKebabItemProps[];
  icon?: 'kebab' | 'user-cog';
}

export default function OdKebab({
  testId,
  className,
  size = 'sm',
  variant = 'outline',
  menuLabel,
  menuLabelClassName,
  items,
  icon = 'kebab',
}: OdKebabProps) {
  const router = useRouter();
  const [dialogState, setDialogState] = useState<OdKebabDialogState>(() => items.map(() => false));

  function openDialog(index: number) {
    setDialogState((prevState) => {
      return prevState.map((_item, itemIndex) => {
        return itemIndex === index;
      });
    });
  }

  function closeDialog(params?: KebabDialogCloseParams) {
    if (params && params.redirectUrl) {
      router.push(params.redirectUrl);
    }
    setDialogState((prevState) => {
      return prevState.map(() => {
        return false;
      });
    });
  }

  function dialogStateChange(index: number) {
    return (isOpen: boolean) => {
      if (isOpen) {
        openDialog(index);
        return;
      }
      closeDialog();
    };
  }

  function getDialogState(index: number) {
    return Boolean(dialogState[index]);
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            data-cy={testId}
            variant={variant}
            type={'button'}
            className={cn('p-0! cursor-pointer', className, {
              'w-6 h-6': size === 'sm',
              'w-8 h-8': size === 'md',
              'w-10 h-10': size === 'lg',
            })}
          >
            {icon === 'kebab' ? <DotsVerticalIcon className={'w-5 h-5 relative z-10'} /> : null}
            {icon === 'user-cog' ? <UserRoundCog className={'w-5 h-5 relative z-10'} /> : null}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          {menuLabel ? (
            <>
              <DropdownMenuLabel className={cn(menuLabelClassName)}>{menuLabel}</DropdownMenuLabel>
              <DropdownMenuSeparator />
            </>
          ) : null}
          {items.map((item, index) => {
            if (item.hidden) {
              return null;
            }
            return (
              <Fragment key={index}>
                {(item.isDelete || item.isWarning) && items.length > 1 ? <DropdownMenuSeparator /> : null}
                <DropdownMenuItem
                  className={cn(item.className, {
                    'text-error': item.isDelete,
                    'text-warning': item.isWarning,
                  })}
                  data-cy={item.testId}
                  onClick={() => {
                    if (item.variant === 'handler') {
                      item.onClick();
                      return;
                    }
                    openDialog(index);
                  }}
                >
                  {item.label}
                </DropdownMenuItem>
              </Fragment>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      {items.map((item, index) => {
        if (item.variant !== 'dialog') {
          return null;
        }
        return getDialogState(index) ? (
          <Dialog open={getDialogState(index)} onOpenChange={dialogStateChange(index)} key={index}>
            {item.dialogContent({ closeDialog })}
          </Dialog>
        ) : null;
      })}
    </>
  );
}
