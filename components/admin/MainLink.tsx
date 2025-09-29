import { HomeIcon } from 'lucide-react';
import Link from 'next/link';

interface MainLinkProps {}

export default function MainLink({}: MainLinkProps) {
  return (
    <div className={'main-link'}>
      <Link href={'/'} className={'main-link__link'}>
        <HomeIcon className={'main-link__link__icon'} />
        <span>На Головну</span>
      </Link>
    </div>
  );
}
