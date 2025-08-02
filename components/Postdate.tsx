'use client';

import { formatDistanceToNow, format } from 'date-fns';

function toUTC(date: Date) {
  return new Date(Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds()
  ));
}

export default function PostDate({ dateString }: { dateString: string }) {
  const date = toUTC(new Date(dateString));

  return (
    <div className="text-md text-gray-500">
      {formatDistanceToNow(date, { addSuffix: true })} · {format(date, 'MMM d, yyyy h:mm a')}
    </div>
  );
}
