import React from "react";

const AboutPage = () => {
  return (
    <div className="max-w-3xl mx-auto p-6 rounded-lg shadow-lg bg-gray-900 text-gray-100 mt-8">
      <div className="flex flex-col items-center text-center">
        <img
          src={'https://res.cloudinary.com/ddvozdtkg/image/upload/v1750528107/Derrick_Ngari_Mumbi-removebg-preview_mwkrq5.png'}
          alt="Derrick Mumbi"
          className="w-32 h-32 rounded-full object-cover border-4 border-emerald-500"
        />
        <h1 className="text-3xl font-bold mt-4">About Me</h1>
        <p className="text-emerald-500 text-lg mt-2">Derrick Mumbi</p>
      </div>

      <div className="mt-6 space-y-4 text-gray-300 leading-relaxed">
        <p>
          👋 Hi, I’m <span className="text-emerald-500 font-semibold">Derrick Mumbi</span> — a passionate Computer Science student, aspiring software developer, and AI enthusiast based in Kenya.
        </p>
        <p>
          Currently in my 3rd year, I’m dedicated to gaining the skills and experience needed to build impactful, innovative software solutions. From coding in <span className="text-emerald-400">HTML, CSS, and JavaScript</span> to mastering <span className="text-emerald-400">React, Node.js, Express, and database design</span>, I’m on a mission to create tools that help businesses and communities thrive.
        </p>
        <p>
          Right now, I’m focusing on deepening my knowledge of <span className="text-emerald-400">AI, SaaS platforms, and data modeling</span> as I prepare for an upcoming industrial attachment in 2025. My goal is to apply these skills in a real-world environment, making a difference and gaining hands-on experience.
        </p>
        <p>
          Coding is more than just a career path for me — it’s a way to solve problems, connect people, and create tools that make life better. I’m excited to build a future that blends technology and entrepreneurship.
        </p>
      </div>

      <div className="mt-6 flex flex-col items-center space-y-2">
        <h2 className="text-lg font-semibold text-emerald-500">Let’s Connect</h2>
        <a
          href="mailto:derrickngari03@gmail.com"
          className="text-emerald-400 hover:underline"
        >
          derrickngari03@gmail.com
        </a>
        <a
          href="https://www.linkedin.com/in/derrick-ngari/"
          className="text-emerald-400 hover:underline"
        >
          LinkedIn
        </a>
        <a
          href="https://www.github.com/derrickngari"
          className="text-emerald-400 hover:underline"
        >
          GitHub
        </a>
      </div>
    </div>
  );
};

export default AboutPage;
