
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Logo({ showText = true }: { showText?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2" prefetch={false}>
      <Image 
        src="/WhatsApp_Image_2025-07-07_at_16.40.56_083d1ca9-removebg-preview.png"
        alt="Faizyab Al-Quran Logo" 
        width={showText ? 40 : 60} 
        height={showText ? 40 : 60}
        className="object-contain"
        priority
      />
       {showText && <span className="font-headline text-xl font-bold">Faizyab Al-Quran</span>}
    </Link>
  );
}