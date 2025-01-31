import Image from "next/image";
import React from "react";
import { Container } from "@/components/Container";

import userOneImg from "../../public/img/user1.jpg";
import userTwoImg from "../../public/img/user2.jpg";
import userThreeImg from "../../public/img/user3.jpg";

export const Testimonials = () => {
  const testimonials = [
    {
      text: "Share a real testimonial that hits some of your benefits from one of your popular customer.",
      image: userOneImg,
      name: "Sarah Steiner",
      title: "VP Sales at Google"
    },
    {
      text: "Make sure you only pick the right sentence to keep it short and simple.",
      image: userTwoImg,
      name: "Dylan Ambrose",
      title: "Lead marketer at Netflix"
    },
    {
      text: "This is an awesome landing page template I've seen. I would use this for anything.",
      image: userThreeImg,
      name: "Gabrielle Winn",
      title: "Co-founder of Acme Inc"
    }
  ];

  // Duplicate testimonials for seamless scrolling
  const allTestimonials = [...testimonials, ...testimonials, ...testimonials];

  return (
    <Container>
      <div className="relative">
        {/* First row */}
        <div className="overflow-hidden mb-2">
          <div className="animate-scroll flex gap-6 py-2">
            {allTestimonials.map((testimonial, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 w-[300px] flex flex-col justify-between bg-gray-100 px-6 rounded-xl py-8 dark:bg-trueGray-800"
              >
                <p className="text-lg leading-normal mb-4">
                  {testimonial.text.split(/(testimonial|right sentence|awesome)/i).map((part, i) => {
                    if (/(testimonial|right sentence|awesome)/i.test(part)) {
                      return <Mark key={i}>{part}</Mark>;
                    }
                    return part;
                  })}
                </p>

                <Avatar
                  image={testimonial.image}
                  name={testimonial.name}
                  title={testimonial.title}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Second row - moving in opposite direction */}
        <div className="overflow-hidden">
          <div className="animate-scroll-reverse flex gap-6 py-2">
            {allTestimonials.map((testimonial, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 w-[300px] flex flex-col justify-between bg-gray-100 px-6 rounded-xl py-8 dark:bg-trueGray-800"
              >
                <p className="text-lg leading-normal mb-4">
                  {testimonial.text.split(/(testimonial|right sentence|awesome)/i).map((part, i) => {
                    if (/(testimonial|right sentence|awesome)/i.test(part)) {
                      return <Mark key={i}>{part}</Mark>;
                    }
                    return part;
                  })}
                </p>

                <Avatar
                  image={testimonial.image}
                  name={testimonial.name}
                  title={testimonial.title}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
};

interface AvatarProps {
  image: any;
  name: string;
  title: string;
}

function Avatar(props: Readonly<AvatarProps>) {
  return (
    <div className="flex items-center space-x-3">
      <div className="flex-shrink-0 overflow-hidden rounded-full w-10 h-10">
        <Image
          src={props.image}
          width="40"
          height="40"
          alt="Avatar"
          placeholder="blur"
        />
      </div>
      <div>
        <div className="text-base font-medium">{props.name}</div>
        <div className="text-sm text-gray-600 dark:text-gray-400">{props.title}</div>
      </div>
    </div>
  );
}

function Mark(props: { readonly children: React.ReactNode }) {
  return (
    <>
      {" "}
      <mark className="text-indigo-800 bg-indigo-100 rounded-md ring-indigo-100 ring-4 dark:ring-indigo-900 dark:bg-indigo-900 dark:text-indigo-200">
        {props.children}
      </mark>{" "}
    </>
  );
}
