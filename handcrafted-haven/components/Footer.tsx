import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";

export default function Footer() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  return (
    <footer className="bg-[#A6AE8C] text-gray-900 flex flex-col md:flex-row justify-between items-center px-8 py-4">
      <div className="flex gap-4">
        <a href="#" className="relative inline-block text-lg text-gray-800  
  before:absolute before:bottom-0 before:left-0 before:w-0 before:h-0.5 before:bg-black
  hover:before:w-full hover:before:transition-all hover:before:duration-300
  hover:text-black">Contact us</a>
        <a href="#" className="relative inline-block text-lg text-gray-800  
  before:absolute before:bottom-0 before:left-0 before:w-0 before:h-0.5 before:bg-black
  hover:before:w-full hover:before:transition-all hover:before:duration-300
  hover:text-black">Subscribe here</a>
      </div>
      <div>
        <p>WDD430 Team 04 &copy;{year}</p>
      </div>
      <div className="flex gap-4 mt-2 md:mt-0">
        <a href="#" className="hover:text-amber-700 transition-colors duration-300 ease-in-out"><FaFacebook size={24} /></a>
        <a href="#" className="hover:text-amber-700 transition-colors duration-300 ease-in-out"><FaInstagram size={24} /></a>
        <a href="#" className="hover:text-amber-700 transition-colors duration-300 ease-in-out"><FaYoutube size={24} /></a>
      </div>
    </footer>
  );
}
