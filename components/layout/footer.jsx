import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-gray-800 text-white p-6 mt-auto">
      <div className="container mx-auto text-center">
        <p className="text-sm">© 2025 LMS Project. All rights reserved.</p>
        <div className="mt-2 space-x-4">
          <Link href="#" className="hover:text-gray-300 transition">About</Link>
          <Link href="#" className="hover:text-gray-300 transition">Contact</Link>
          <Link href="#" className="hover:text-gray-300 transition">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
}
