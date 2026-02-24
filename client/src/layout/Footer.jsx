import React from "react";
import { Mail, Phone, MapPin, Github, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black text-gray-300 mt-16">
      
      {/* TOP SECTION */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* BRAND */}
        <div>
          <h2 className="text-2xl font-bold text-white tracking-wide">
            BookWorm Library
          </h2>
          <p className="mt-4 text-sm text-gray-400 leading-relaxed">
            A modern digital library system built with MERN stack.
            Manage, borrow and explore books with ease.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Quick Links
          </h3>
          <ul className="space-y-3 text-sm">
            <li className="hover:text-white cursor-pointer transition">
              Dashboard
            </li>
            <li className="hover:text-white cursor-pointer transition">
              Books
            </li>
            <li className="hover:text-white cursor-pointer transition">
              My Borrowed Books
            </li>
            <li className="hover:text-white cursor-pointer transition">
              Contact
            </li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Contact
          </h3>

          <div className="space-y-3 text-sm">

            <div className="flex items-center gap-3">
              <Mail size={16} />
              <span>support@bookworm.com</span>
            </div>

            <div className="flex items-center gap-3">
              <Phone size={16} />
              <span>+91 98765 43210</span>
            </div>

            <div className="flex items-center gap-3">
              <MapPin size={16} />
              <span>Ahmedabad, Gujarat</span>
            </div>

          </div>

          {/* SOCIAL */}
          <div className="flex gap-4 mt-6">
            <Github className="cursor-pointer hover:text-white transition" />
            <Linkedin className="cursor-pointer hover:text-white transition" />
          </div>

        </div>

      </div>

      {/* BOTTOM */}
      <div className="border-t border-gray-800 text-center py-4 text-sm text-gray-500">
        © {new Date().getFullYear()} BookWorm Library. All rights reserved.
      </div>

    </footer>
  );
};

export default Footer;