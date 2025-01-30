import Link from "next/link";
import Image from "next/image";
import React from "react";
import { Container } from "@/components/Container";

export function Footer() {
  return (
    <div className="relative dark:bg-gray-900">
      <Container>
        <div className="px-8 py-8 mx-auto max-w-7xl border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm my-8 bg-gray-50 dark:bg-gray-800">
          <div className="grid grid-cols-4 gap-8">
            <div className="mt-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                <Link href="/" className="flex items-center space-x-2">
                  <Image
                    src="/img/logo1.svg"
                    alt="RepLance"
                    width="32"
                    height="32"
                    className="w-8"
                  />
                  <span className="text-2xl text-[#71797E] font-normal">RepLance</span>
                </Link>
              </h3>
              <ul className="space-y-3">
                <li><p className="text-sm text-gray-500">© 2024. All rights reserved.</p></li>
                <li>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-500">All services are online</span>
                  </div>
                </li>
                <li>
                  <div className="space-x-2">
                    <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">Terms of Service</Link>
                    <span className="text-gray-500 mx-2">·</span>
                    <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">Privacy</Link>
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 mt-2">Company</h3>
              <ul className="space-y-3">
                <li><Link href="/" className="text-sm text-gray-500 hover:text-gray-700">About Us</Link></li>
                <li><Link href="/" className="text-sm text-gray-500 hover:text-gray-700">Blog</Link></li>
                <li><Link href="/" className="text-sm text-gray-500 hover:text-gray-700">Careers</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 mt-2">Product</h3>
              <ul className="space-y-3">
                <li><Link href="/" className="text-sm text-gray-500 hover:text-gray-700">Pricing</Link></li>
                <li><Link href="/" className="text-sm text-gray-500 hover:text-gray-700">Features</Link></li>
                <li><Link href="/" className="text-sm text-gray-500 hover:text-gray-700">FAQs</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 mt-2">Help</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">support@replance.com</Link>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">San Francisco, CA</Link>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </Container>
    </div>
  );
}
