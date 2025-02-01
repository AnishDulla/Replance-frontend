"use client"

import Image from "next/image";
import { Container } from "@/components/Container";
import heroImg from "../../public/img/freelancer1.png";
import { useState } from "react";
import { PreOrderForm } from "@/components/PreOrderForm";

export const Hero = () => {
  const [isPreOrderFormOpen, setIsPreOrderFormOpen] = useState(false);

  const handlePreOrderSubmit = (data: { plan: string; email: string; name: string }) => {
    // Handle the form submission here
    console.log(data);
    setIsPreOrderFormOpen(false);
  };

  return (
    <>
      <Container className="flex flex-wrap ">
        <div className="flex items-center w-full lg:w-1/2">
          <div className="max-w-2xl mb-8">
            <div className="relative mb-6">
              <p className="py-5 text-lg font-bold italic leading-normal lg:text-xl xl:text-xl inline-block px-6 py-2 rounded-full bg-gray-100/80 shadow-sm">
                <span className="bg-gradient-to-r from-indigo-500 to-indigo-600 bg-clip-text text-transparent">
                  🪄 One dashboard. Every freelance job. AI-crafted proposals.
                </span>
              </p>
            </div>
            <h1 className="text-4xl font-bold leading-tight tracking-tight bg-gradient-to-r from-gray-900 to-gray-500 bg-clip-text text-transparent lg:text-4xl lg:leading-tight xl:text-6xl xl:leading-tight dark:from-white dark:to-gray-200">
              Win More Freelance Jobs. In Less Time.
            </h1>

            <p className="py-6 text-lg leading-relaxed text-gray-600 dark:text-gray-300 max-w-prose">
              RepLance helps freelancers win more jobs with less effort by aggregating listings from multiple platforms into one smart dashboard. Our AI crafts tailored proposals and applies for jobs at scale, so you can focus on what you do best—getting paid for your skills.
            </p>

            <div className="flex flex-col items-start space-y-3 sm:space-x-4 sm:space-y-0 sm:items-center sm:flex-row mt-8">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setIsPreOrderFormOpen(true);
                }}
                className="px-8 py-4 text-lg font-medium text-center text-gray-600 bg-[#F4CC86] rounded-md">
                <span className="flex items-center">
                  Pre-Order Now
                  <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                  </svg>
                </span>
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener"
                className="px-8 py-4 text-lg font-medium text-center text-gray-600 bg-[#E7778F] rounded-md">
                <span className="flex items-center">
                  Watch Demo
                  <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 5.14v14.72a1 1 0 001.55.832l11-7.36a1 1 0 000-1.664l-11-7.36A1 1 0 008 5.14z"/>
                  </svg>
                </span>
              </a>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center w-full lg:w-1/2">
          <div className="">
            <Image
              src={heroImg}
              width="616"
              height="617"
              className={"object-cover rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 bg-gradient-to-b from-white/5 to-white/30 p-1"}
              alt="Hero Illustration"
              loading="eager"
              placeholder="blur"
            />
          </div>
        </div>
      </Container>
      <Container>
        <div className="flex flex-col justify-center">
          <div className="text-xl text-center text-gray-700 dark:text-white">
            Aggregate freelance jobs from these networks and <span className="text-indigo-600">apply with AI</span>
          </div>

          <div className="flex flex-wrap justify-center gap-5 mt-10 md:justify-around">
            <div className="text-gray-400 dark:text-gray-400">
              <FreelancerLogo />
            </div>
            <div className="text-gray-400 dark:text-gray-400">
              <ToptalLogo />
            </div>
            <div className="text-gray-400 dark:text-gray-400">
              <UpworkLogo />
            </div>
            <div className="text-gray-400 dark:text-gray-400">
              <FiverrLogo />
            </div>
            <div className="pt-2 text-gray-400 dark:text-gray-400">
              <PeoplePerHourLogo />
            </div>
          </div>
        </div>
      </Container>
      <PreOrderForm 
        isOpen={isPreOrderFormOpen}
        onClose={() => setIsPreOrderFormOpen(false)}
        onSubmit={handlePreOrderSubmit}
      />
    </>
  );
}

const FreelancerLogo = () => (
  <Image
    src="/img/brands/Freelancerlogo.png"
    alt="Freelancer"
    width={150}
    height={31}
  />
);

const PeoplePerHourLogo = () => (
  <Image
    src="/img/brands/peopleperhour.png"
    alt="People Per Hour"
    width={150}
    height={31}
  />
);

const UpworkLogo = () => (
  <Image
    src="/img/brands/upwork.png"
    alt="Upwork"
    width={110}
    height={33}
  />
);

const FiverrLogo = () => (
  <Image
    src="/img/brands/fiverr.png"
    alt="Fiverr"
    width={110}
    height={33}
  />
);

const ToptalLogo = () => (
  <Image
    src="/img/brands/toptal.png"
    alt="Toptal"
    width={110}
    height={33}
  />
);

