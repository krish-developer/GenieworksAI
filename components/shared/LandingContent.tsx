
"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { FaMusic, FaComments, FaCode, FaCamera, FaFilm, FaHistory } from 'react-icons/fa';

const features1 = [
  {
    name: 'AI Conversations',
    description:
      'Engage in intelligent conversations with AI models to gather insights, generate ideas, or simply chat.',
    icon: FaComments,
  },
  {
    name: 'Code Generation',
    description:
      'Automatically generate code snippets or even entire scripts tailored to your specifications.',
    icon: FaCode,
  },
  {
    name: 'Image Generation',
    description:
      'Create unique and personalized images using AI algorithms.',
    icon: FaCamera,
  },
  {
    name: 'Video Generation',
    description:
      'Generate videos based on specific themes, styles, or content.',
    icon: FaFilm,
  },
  {
    name: 'Music Generation',
    description:
      'Explore AI-generated music compositions to enhance your projects or enjoy for leisure.',
    icon: FaMusic,
  },
  {
    name: 'History',
    description:
      'Access the previously asked prompts and their generated responses.',
    icon: FaHistory,
  },
];

const testimonialDummyData = [
  {
    name: "Alice Johnson",
    title: "Marketing Director",
    company: "Tech Solutions Inc.",
    review:
      "Working with your team has been a game-changer for us. The insights we've gained from AI-powered analytics have transformed our marketing strategies. Highly recommend!",
    avatar: "AJ",
  },
  {
    name: "Mark Smith",
    title: "Creative Director",
    company: "Design Studios Co.",
    review:
      "The AI-generated images have exceeded our expectations. They're not just unique but also align perfectly with our brand aesthetics. Great job!",
    avatar: "MS",
  },
  {
    name: "Emily Chen",
    title: "CEO",
    company: "Innovate Tech Solutions",
    review:
      "The AI-generated music compositions have added a new dimension to our projects. They're incredibly versatile and inspiring. We're thrilled with the results!",
    avatar: "EC",
  },
  {
    name: "Sophia Lee",
    title: "Digital Strategist",
    company: "Global Media Group",
    review:
      "Your AI-driven video generation capabilities have revolutionized our content production. We can now create engaging videos faster than ever before, and our audience engagement has skyrocketed. Thank you!",
    avatar: "SL",
  },
];


const faqs = [
  {
    question: "What is AI Conversations?",
    answer:
      "AI Conversations allow you to interact with AI models for various purposes, such as generating ideas or gathering insights.",
  },
  {
    question: "How does Code Generation work?",
    answer:
      "Code Generation uses AI to create code snippets or full scripts based on your input and requirements.",
  },
  {
    question: "Can I generate custom images?",
    answer:
      "Yes, you can create unique and personalized images using our AI algorithms.",
  },
  {
    question: "What kind of videos can I generate?",
    answer:
      "You can generate videos based on specific themes, styles, or content using our AI video generation feature.",
  },
  {
    question: "What is AI-generated music?",
    answer:
      "AI-generated music is created by algorithms designed to compose music, which you can use for projects or personal enjoyment.",
  },
];


const LandingContent = () => {
  const [openFAQIndex, setOpenFAQIndex] = useState<number | null>(null); // State to track which FAQ is open

  const toggleFAQ = (index: number) => {
    if (openFAQIndex === index) {
      setOpenFAQIndex(null); // Close the FAQ if it's already open
    } else {
      setOpenFAQIndex(index); // Open the FAQ
    }
  };

  return (
    <div className="px-10 pb-20">
   
      {/* Features Section */}
      <h2 className="text-center text-4xl text-background font-extrabold mb-10">
        Features
      </h2>
   
      <div className="mx-auto max-w-7xl px-6 lg:px-8 mb-14">
  <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
    <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
      {features1.map((feature) => (
        <div key={feature.name} className="relative pl-16">
          <dt className="text-base font-semibold leading-7 text-white">
          <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-900">
  <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
</div>
            {feature.name}
          </dt>
          <dd className="mt-2 text-base leading-7 text-gray-600">{feature.description}</dd>
        </div>
      ))}
    </dl>
  </div>
</div>

<h2 className="text-center text-4xl text-background font-extrabold mb-10">
        Testimonials
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-16">
        {testimonialDummyData.map((data, index) => (
          <Card
            key={data.name + index}
            className="bg-gray-800 border-none text-background"
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Avatar>
                  <AvatarFallback className="bg-gray-950 text-lg font-normal">
                    {data.avatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-lg">{data.name}</p>
                  <p className="text-sm text-zinc-400">
                    {data.title}, {data.company}
                  </p>
                </div>
              </CardTitle>
              <CardContent className="pt-4 px-0">
                <p>{data.review}</p>
              </CardContent>
            </CardHeader>
          </Card>
        ))}
      </div>


      {/* FAQ Section */}
      <h2 className="text-center text-4xl text-background font-extrabold mb-10">
        FAQ
      </h2>
      <div className="space-y-6 mb-14">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-gray-800 p-6 rounded-lg">
            <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleFAQ(index)}>
            <h3 className="text-xl font-bold text-white">{faq.question}</h3>
            {openFAQIndex === index ? (
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M20 12H4"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              )}
            </div>
            {openFAQIndex === index && (
              <p className="text-zinc-400 mt-4">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="text-center py-1 g-gray-800 text-background">
        <p>&copy; 2024 GenieworksAI. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingContent;
