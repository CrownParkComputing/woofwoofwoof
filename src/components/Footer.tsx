import Link from "next/link";
import Paw from "./Paw";

export default function Footer({
  phone,
  email,
  location,
  facebook,
  linkedin,
}: {
  phone: string;
  email: string;
  location: string;
  facebook: string;
  linkedin: string;
}) {
  return (
    <footer className="mt-20 border-t-4 border-amber-900/10 bg-amber-900 text-amber-100">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 text-xl font-black text-white">
            <Paw className="text-amber-400" size={24} />
            Woof Woof Woof.club
          </div>
          <p className="mt-2 text-sm text-amber-200">
            Five-star licensed dog care — walks, training, boarding & daycare.
          </p>
        </div>
        <div className="text-sm">
          <p className="font-bold text-white">Get in touch</p>
          <p className="mt-2">📞 <a className="hover:text-white underline" href={`tel:${phone.replace(/\s/g, "")}`}>{phone}</a></p>
          <p>✉️ <a className="hover:text-white underline" href={`mailto:${email}`}>{email}</a></p>
          <p>📍 {location}</p>
        </div>
        <div className="text-sm">
          <p className="font-bold text-white">Follow the pack</p>
          <p className="mt-2"><a className="hover:text-white underline" href={facebook} target="_blank" rel="noreferrer">Facebook</a></p>
          <p><a className="hover:text-white underline" href={linkedin} target="_blank" rel="noreferrer">LinkedIn</a></p>
        </div>
      </div>
      <div className="border-t border-amber-800 py-4 text-center text-xs text-amber-300">
        © {new Date().getFullYear()} Woof Woof Woof Club · DEFRA 5★ licensed (CW&C 19/AB/119) ·{" "}
        <Link href="/admin/login" className="underline opacity-60 hover:opacity-100">admin</Link>
      </div>
    </footer>
  );
}
