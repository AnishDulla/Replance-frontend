"use client";
import Link from "next/link";
import Image from "next/image"
import { Disclosure } from "@headlessui/react";

export const Navbar = () => {
  const navigation = [
    "Product",
    "Features",
    "Pricing",
    "Company",
    "Blog",
    "Demo",
    "Email Sender",
  ];

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Helper function to get the correct href for navigation items
  const getItemHref = (item: string) => {
    if (item === "Product") return "/";
    if (item === "Features") return "/features";
    if (item === "Pricing") return "/";
    if (item === "Company") return "/";
    if (item === "Blog") return "/";
    if (item === "Demo") return "/demo";
    if (item === "Email Sender") return "/email-sender";
    return `/${item.toLowerCase().replace(/\s+/g, '-')}`;
  };

  return (
    <div className="w-full fixed top-0 bg-white z-50 border-b border-gray-200">
      <nav className="container relative flex flex-wrap items-center justify-between p-4 mx-auto lg:justify-between xl:px-0">
        {/* Logo  */}
        <Link href="/">
          <span className="flex items-center space-x-2 text-2xl text-[#71797E] font-normal">
              <span>
                <Image
                  src="/img/logo1.svg"
                  width="48"
                  alt="N"
                  height="48"
                  className="w-12"
                />
              </span>
            <span>RepLance</span>
          </span>
        </Link>

        {/* Centered navigation */}
        <div className="hidden lg:flex flex-1 justify-center">
          <ul className="flex items-center space-x-8">
            {navigation.map((menu, index) => (
              <li key={index}>
                <Link 
                  href={getItemHref(menu)} 
                  onClick={(e) => menu === "Features" ? handleScroll(e, 'features') : null}
                  className="text-base text-gray-600 hover:text-gray-900"
                >
                  {menu}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* login buttons */}
        <div className="hidden lg:flex items-center gap-4">
          <Link href="/" className="px-6 py-2 text-white bg-indigo-600 rounded-md">
            Login
          </Link>
        </div>
                
        {/* Mobile menu */}
        <Disclosure>
          {({ open }) => (
            <>
                <Disclosure.Button
                  aria-label="Toggle Menu"
                  className="px-2 py-1 ml-auto text-gray-500 rounded-md lg:hidden hover:text-indigo-500 focus:text-indigo-500 focus:bg-indigo-100 focus:outline-none">
                  <svg
                    className="w-6 h-6 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24">
                    {open ? (
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"
                      />
                    ) : (
                      <path
                        fillRule="evenodd"
                        d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
                      />
                    )}
                  </svg>
                </Disclosure.Button>

                <Disclosure.Panel className="flex flex-wrap w-full my-5 lg:hidden">
                  <>
                    {navigation.map((item, index) => (
                      <Link 
                        key={index} 
                        href={getItemHref(item)} 
                        onClick={(e) => item === "Features" ? handleScroll(e, 'features') : null}
                        className="w-full px-4 py-2 -ml-4 text-gray-500 rounded-md hover:text-indigo-500 focus:text-indigo-500 focus:bg-indigo-100 focus:outline-none"
                      >
                        {item}
                      </Link>
                    ))}
                    <Link href="/login" className="w-full px-6 py-2 mt-3 text-center text-white bg-indigo-600 rounded-md lg:ml-5">         
                      Login
                    </Link>
                  </>
                </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </nav>
    </div>
  );
}

