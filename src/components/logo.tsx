import { BookHeart } from 'lucide-react';
import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" prefetch={false}>
      <BookHeart className="h-6 w-6 text-primary" />
      <span className="text-lg font-semibold font-headline">Faizyab Al-Quran</span>
    </Link>
  );
}
