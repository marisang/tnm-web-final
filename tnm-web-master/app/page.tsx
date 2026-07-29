import Image from 'next/image';
import Link from 'next/link';

export default function Splash() {
  return (
    <Link
      href="/admin/login"
      className="flex min-h-screen items-center justify-center bg-[#7A0BC0]"
    >
      <div className="h-48 w-48 relative">
        <Image
          src="/tonamidia.png"
          alt="Logo Tô na Mídia"
          fill
          className="object-contain"
          priority
        />
      </div>
    </Link>
  );
}
