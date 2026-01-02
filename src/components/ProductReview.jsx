import React from "react";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
const ProductReview = () => {
  const sizes = ["S", "L", "XL"];
  const colors = [
    { name: "Blue", value: "blue", class: "bg-blue-500" },
    { name: "Red", value: "red", class: "bg-red-500" },
    { name: "Yellow", value: "yellow", class: "bg-yellow-400" },
    { name: "Green", value: "green", class: "bg-green-500" },
    { name: "Pink", value: "pink", class: "bg-pink-500" },
  ];

  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const Spec = ({ label, value }) => (
    <div>
      <p className="text-sm font-medium">{label}</p>
      <p className="text-sm text-gray-500">{value}</p>
    </div>
  );

  const accordionData = [
    {
      id: "specs",
      title: "Specifications",
      subtitle: "Technical details and features",
      content: (
        <div className="grid grid-cols-2 gap-x-10 gap-y-6">
          <Spec label="Fabric" value="Imported Poly Knit" />
          <Spec label="Neck" value="High Neck Zipper" />
          <Spec label="Pattern" value="Solid" />
          <Spec label="Hemline" value="Ribbed" />
          <Spec label="Sleeve" value="Ribbed Full Sleeves" />
          <Spec label="Inner Lining" value="Bonded Fleece" />
          <Spec label="Pocket" value="2" />
        </div>
      ),
    },
    {
      id: "description",
      title: "Description",
      subtitle: "Product overview and details",
      content: (
        <p className="text-sm text-gray-600">
          Premium winter wear designed for comfort, warmth, and style.
        </p>
      ),
    },
    {
      id: "returns",
      title: "Returns, Exchange, & Refund Policy",
      subtitle: "7 days easy returns and exchange",
      content: (
        <p className="text-sm text-gray-600">
          Easy 7-day return & exchange available.
        </p>
      ),
    },
    {
      id: "marketed",
      title: "Marketed By",
      subtitle: "Company and distributor information",
      content: (
        <p className="text-sm text-gray-600">JATIN MENS WEAR Pvt Ltd, India</p>
      ),
    },
  ];
  const [openId, setOpenId] = useState("NULL");

  return (
    <>
      <div className="m-2 h-full flex gap-10">
        <div className="w-4/5 h-auto flex items-center justify-center  bg-[#D9D9D9]/20 rounded-2xl max-h-130">
          <div className="flex-col m-2">
            <div>
              <img
                className="w-1/2 h-auto  relative left-5 m-2 rounded-xl "
                src="/bartang island.webp"
                alt=""
              />
            </div>
            <div>
              <img
                className="w-1/2 h-auto  relative left-5 m-2 rounded-xl "
                src="/bartang island.webp"
                alt=""
              />
            </div>
            <div>
              <img
                className="w-1/2 h-auto  relative left-5 m-2 rounded-xl "
                src="/bartang island.webp"
                alt=""
              />
            </div>
          </div>
          <div>
            <img
              className="w-3xl h-auto  relative right-20  rounded-xl"
              src="/bartang island.webp"
              alt=""
            />
          </div>
        </div>
        <div className="w-3/5 h-140 overflow-y-scroll no-scrollbar    bg-[#D9D9D9]/20 rounded-2xl">
          <div className="w-11/12  h-auto  m-3 p-2  rounded-xl text-xl font-medium flex-col gap-4">
            <div>
              Price:{" "}
              <span className="line-through text-gray-500/50 mr-2">
                ₹1299/-{" "}
              </span>{" "}
              ₹999/ -
            </div>
            <div>Desciption: Lorem ipsum dolor sit amet.</div>
          </div>
          <div className="w-11/12 h-30 outline-1 bg-linear-to-r from-white via bg-yellow-300 to-yellow-500 rounded-xl m-3 flex-col gap-1 items-center justify-center">
            <div className=" relative top-0  w-auto h-10 outline-1 rounded-t-xl  flex items-center justify-center">
              BONUS OFFERS
            </div>
            <div className=" flex items-center justify-center mt-4">
              BUY 3 GET ONE FREE GIFT OF WORTH ₹499 TO ₹1499 !
            </div>
          </div>
          {/* SIZE */}
          <div>
            <p className="mb-2 font-medium m-3">Size:</p>
            <div className="flex gap-3 m-3">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-12 h-10 rounded-lg border text-sm font-medium
                ${
                  selectedSize === size
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-gray-200 text-black border-gray-300"
                }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          {/* COLOR */}
          <div>
            <p className="mb-2 font-medium m-3 "> Colors:</p>
            <div className="flex gap-3 m-3">
              {colors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setSelectedColor(color.value)}
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center
                ${
                  selectedColor === color.value
                    ? "border-blue-600"
                    : "border-gray-300"
                }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full ${color.class}`}
                  ></span>
                </button>
              ))}
            </div>
          </div>
          <div className="mb-2 font-medium m-3 flex gap-1">
            <p>Quantity:</p>
            <select
              className="w-15 h-5 text-black  relative m-1 outline-1 rounded-2xl "
              name=" Quantity"
              id=""
            >
              <option className="text-black text-s" value="1">
                1
              </option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
          </div>
          <div className="m-3 w-11/12 h-10  flex justify-center items-center gap-4 ">
            <button className="m-1 w-60 h-12 shadow-s rounded-xl text-xl bg-[#FBFE3A] ">
              Add To Cart
            </button>
            <button className="m-1 w-60 h-12 shadow-s rounded-xl text-xl bg-[#FFA322] ">
              Buy Now
            </button>
          </div>
          <div className="m-3 w-11/12 h-10  flex items-center gap-4 cursor-pointer">
            <p className="text-xl font-medium ">Check For Availability</p>
            <input
              className="bg-white text-black outline rounded-sm w-1/3 pl-3 "
              type="number"
              placeholder="Enter pincode here"
              name="pincode"
              id=" pincode"
              min={100000}
              max={999999}
            />
          </div>
          <div className="w-11/12 flex items-center justify-center h-10 text-xl font-medium">
            Product Details
          </div>
          <div className="border-t m-3 pt-4">
            {accordionData.map((item) => (
              <div key={item.id} className="border-b">
                <button
                  onClick={() => setOpenId(openId === item.id ? null : item.id)}
                  className="w-full flex justify-between items-center py-4 text-left"
                >
                  <div>
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-sm text-gray-500">{item.subtitle}</p>
                  </div>

                  <ChevronDown
                    className={`transition-transform duration-300 ${
                      openId === item.id ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* CONTENT */}
                {openId === item.id && (
                  <div className="pb-6">{item.content}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className=" w-full rounded-xl bg-[#D9D9D9]/20  h-30">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolore, quaerat!</div>
    </>
  );
};
export default ProductReview;
