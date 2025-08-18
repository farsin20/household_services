import React from "react";

const Banner = () => {
  const slides = [
    {
      id: 1,
      image: "/images/plumber.jpg",
      text: "Expert Plumbing Services",
    },
    {
      id: 2,
      image: "/images/cleaner.jpg",
      text: "Sparkling Clean Homes",
    },
    {
      id: 3,
      image: "/images/electrician.jpg",
      text: "Trusted Electrical Repairs",
    },
    {
      id: 4,
      image: "/images/pestControl.jpg",
      text: "Safe Pest Control",
    },
  ];

  return (
    <div className="carousel w-full">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          id={`slide${slide.id}`}
          className="carousel-item relative w-full h-64 md:h-[500px] bg-cover bg-center flex items-center justify-center"
          style={{ backgroundImage: `url(${slide.image})` }}
        >
          <div className="bg-transparent bg-opacity-50 p-4 rounded text-white text-center">
            <h2 className="text-2xl md:text-4xl font-bold bg-black/30 p-4">{slide.text}</h2>
          </div>
          <div className="absolute left-5 right-5 top-1/2 flex justify-between transform -translate-y-1/2">
            <a
              href={`#slide${(index - 1 + slides.length) % slides.length + 1}`}
              className="btn btn-circle"
            >
              ❮
            </a>
            <a
              href={`#slide${(index + 1) % slides.length + 1}`}
              className="btn btn-circle"
            >
              ❯
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Banner;
