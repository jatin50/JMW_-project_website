import React from "react";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
const Home = () => {
  const filters = [
    {
      id: "categories",
      label: "CATEGORIES",
      option1: "topwear",
      option2: "bottomwear",
      option3: "winterwear",
      option4: "New Arrival",
    },
    {
      id: "colors",
      label: "COLORS",
      option1: "Black",
      option2: "White",
      option3: "Red",
      option4: "Blue",
    },
    {
      id: "size",
      label: "SIZE",
      option1: "Small",
      option2: "Medium",
      option3: "Large",
      option4: "Extra Large",
    },
    {
      id: "pattern",
      label: "PATTERN",
      option1: "Plain",
      option2: "Printed",
      option3: "Checked",
      option4: "Solid",
    },
    {
      id: "fabric",
      label: "FABRIC",
      option1: "Cotton",
      option2: "Polyester",
      option3: "Wool",
      option4: "Satin",
    },
    {
      id: "combo",
      label: "COMBO",
      option1: "buy 2 get 1",
      option2: "buy 3 get 2",
      option3: "buy 4 get 3",
      option4: "buy 5 get 4",
    },
  ];
  const [openFilter, setOpenFilter] = useState(null);

  const toggleFilter = (id) => {
    setOpenFilter(openFilter === id ? null : id);
  };
  return (
    <>
      <div className="w-full h-auto ">
        <div className="w-full h-25 flex justify-center items-center text-2xl font-medium bg-[#FFF04A]">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit.
        </div>
        <div className=" w-full h-10 mt-5 flex items-center justify-center ">
          <div className=" w-11/12 h-10 mt-5  flex items-center justify-between ">
            <div className=" bg-[#D9D9D9]/20 text-xl font-medium text-black rounded-2xl w-30 shadow-xl h-8 flex justify-center items-center">
              TopWear
            </div>
            <div className=" bg-[#D9D9D9]/20 text-xl font-medium text-black rounded-2xl w-30 shadow-xl h-8 flex justify-center items-center">
              Bottom-Wear
            </div>
            <div className=" bg-[#D9D9D9]/20 text-xl font-medium text-black rounded-2xl w-30 shadow-xl h-8 flex justify-center items-center">
              Combos
            </div>
            <div className=" bg-[#D9D9D9]/20 text-xl font-medium text-black rounded-2xl w-30 shadow-xl h-8 flex justify-center items-center">
              Winter-Wear
            </div>
            <div className=" bg-[#D9D9D9]/20 text-xl font-medium text-black rounded-2xl w-30 shadow-xl h-8 flex justify-center items-center">
              New Arrival
            </div>
          </div>
        </div>
        <div className="w-full h-auto p-2 mt-10  flex justify-center items-center gap-4">
          <div className="w-1/3 h-auto min-h-100  flex justify-center">
            <div className="w-4/5 h-auto  bg-[#D9D9D9]/20 shadow-2xl rounded-2xl p-4">
              <h2 className="text-center font-semibold mb-4">FILTER</h2>

              {filters.map((filter) => (
                <div key={filter.id} className="border-b">
                  <button
                    onClick={() => toggleFilter(filter.id)}
                    className="w-full flex justify-between items-center py-3 text-sm font-medium"
                  >
                    {filter.label}
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${
                        openFilter === filter.id ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openFilter === filter.id && (
                    <div className="pb-3 pl-2 space-y-2 text-sm text-gray-600">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" /> {filter.option1}
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" /> {filter.option2}
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" /> {filter.option3}
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" /> {filter.option4}
                      </label>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="w-2/3 h-140 bg-[#D9D9D9]/20 overflow-y-scroll no-scrollbar rounded-xl mt-2">
            <div className="flex-col w-full h-auto p-2">
              <div className="w-11/12 h-auto outline-1 rounded-2xl text-xl font-medium flex-col items-center justify-center m-10 p-2 pb-7 shadow-2xl">
                <h1 className="text-2xl font-bold my-2 ">About Us</h1>
                Since 2015, we’ve been crafting men’s fashion that blends
                timeless style with modern trends. Our focus is on quality
                fabrics, perfect fits, and designs that elevate everyday wear.
                From casual essentials to statement pieces, we create clothing
                for men who value confidence, comfort, and authenticity.
              </div>
              <div className="w-full h-140 outline-1 rounded-2xl">
                {/* product listing would go here */}
                {/* on selecting different filters the product will be listed and on default some products will be shown */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Home;
