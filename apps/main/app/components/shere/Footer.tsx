// import { FaQ } from "react-icons/fa"; 

import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#F7F7F7] border-t border-gray-200  px-6 md:px-24 mt-16 ">
      <div className=" mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-6 gap-8">
        {/* Logo and description */}
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-3">
          <div className=" relative">
            <Image
              src="/logo/Logo.png"
              alt="Quizzy Logo"
              className="object-contain rounded-md"
              width={150}
              height={50}
            />
          </div>
            
          </div>
          <p className="text-gray-600 text-sm leading-relaxed max-w-xs">
            The biggest marketplace managed by Ideologist Corp, which provides
            various kinds of daily needs and hobbies.
          </p>
        </div>

        {/* About */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">About Lenny</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>What We Offer</li>
            <li>How It Works</li>
            <li>Terms & Conditions</li>
            <li>Return / Refund Policy</li>
          </ul>
        </div>

        {/* Help & Support */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">Help & Support</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>FAQ</li>
            <li>Technical Help</li>
            <li>24/7 Support</li>
          </ul>
        </div>

        {/* Account */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">Account</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>My Purchases</li>
            <li>Quiz History</li>
            <li>Manage Profile</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">Contact Us</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>(684) 555-0102</li>
            <li>curtis.weaver@example.com</li>
            <li>Customers Complaint Service</li>
            <li>
              Directorate Generale of the Republic of Indonesia <br />
              (480) 555-0103
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-200 mt-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-sm text-gray-500 py-4 px-4">
          <p>COPYRIGHT © QUZZY. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-5 mt-2 md:mt-0">
            <span className="hover:text-gray-700 cursor-pointer">
              Terms of use
            </span>
            <span className="hover:text-gray-700 cursor-pointer">
              Privacy Policy
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
