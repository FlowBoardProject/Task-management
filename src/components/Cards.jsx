// import React from "react";
// import  "./CardsStyle.css" ;
import React from "react";

const Cards = () => {
  const cardList = [
    {
      title: "lorem lorem lorem",
      description: "loremis simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknow",
    //   imageUrl: "/api/placeholder/400/300"
    },
    {
      title: "lorem lorem lorem",
      description: "loremis simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknow",
    //   imageUrl: "/api/placeholder/400/300"
    },
    {
      title: "lorem lorem lorem",
      description: "loremis simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknow",
    //   imageUrl: "/api/placeholder/400/300"
    },
  ];

  return (
    <>
      {cardList.map((card, id) => (
        <div
          key={id}
          className="group relative flex flex-col cursor-pointer bg-white justify-center py-6 px-10 text-center items-center mt-12 
            rounded-tl-[35px] rounded-br-[35px] shadow-2xl md:min-h-[340px] w-full max-w-screen-md min-h-[260px] 
            transition-all duration-300 hover:scale-105 overflow-hidden"
        >
          {/* Overlay with image that appears on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <img
              src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df"
              alt={card.title}
              className="w-full h-full object-cover"
            />
            {/* Dark overlay to maintain text readability */}
            <div className="absolute inset-0 bg-black/50" />
          </div>

          {/* Card content */}
          <div className="relative z-10 group-hover:text-white transition-colors duration-300">
            <p className="text-[24px] font-bold uppercase mb-7">
              {card.title}
            </p>
            <p className="text-[15px] font-medium leading-4 w-full">
              {card.description}
            </p>
          </div>
        </div>
      ))}
    </>
  );
};

export default Cards;