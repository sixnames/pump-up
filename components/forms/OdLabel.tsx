import { Label } from '@/components/ui/label';

export interface OdLabelProps {
  label?: string;
  required?: boolean;
  hint?: string;
  description?: string;
  htmlFor?: string;
}

export default function OdLabel({ label, required, hint, description, htmlFor }: OdLabelProps) {
  if (!label) {
    return null;
  }
  return (
    <div>
      <Label htmlFor={htmlFor} className={'text-muted-foreground'}>
        {label} {hint ? <span className='text-gray-400 whitespace-nowrap'>({hint})</span> : null}
        {required ? <span className={'text-error text-md'}> *</span> : null}
      </Label>
      {description ? <div className='text-gray-400'>{description}</div> : null}
    </div>
  );
}
