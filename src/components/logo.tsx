
import Image from 'next/image';
import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" prefetch={false}>
      <Image 
        src="/WhatsApp_Image_2025-07-07_at_16.40.56_083d1ca9-removebg-preview.png"
        alt="Faizyab Al-Quran Logo" 
        width={40} 
        height={40}
        className="object-contain"
        priority
      />
       <span className="font-headline text-xl font-bold">Faizyab Al-Quran</span>
    </Link>
  );
}
