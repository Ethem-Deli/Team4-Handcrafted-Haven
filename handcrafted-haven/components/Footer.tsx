import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#A6AE8C] text-gray-900 flex flex-col md:flex-row justify-between items-center px-8 py-4">
      <div className="flex gap-4">
        <a href="#">Contact us</a>
        <a href="#">Subscribe here</a>
      </div>
      <div className="flex gap-4 mt-2 md:mt-0">
        <a href="#"><FaFacebook size={24} /></a>
        <a href="#"><FaInstagram size={24} /></a>
        <a href="#"><FaYoutube size={24} /></a>
      </div>
    </footer>
  );
}
