'use client';

import { alwaysNumber } from '@/lib/commonUtils';
import { useRowLabel } from '@payloadcms/ui';

export default function ArrayFieldRowLabel(props: { itemLabel?: string }) {
  const { rowNumber } = useRowLabel<{ title?: string }>();
  return props?.itemLabel ? <div>{`${props.itemLabel} ${alwaysNumber(rowNumber) + 1}`}</div> : null;
}
