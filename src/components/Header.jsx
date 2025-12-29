import React from "react";
import { useState } from "react";
import { Link, NavLink } from "react-router";
const Header = () => {
  const [Open1, setOpen1] = useState(false);
  const [Open2, setOpen2] = useState(false);
  const [Open3, setOpen3] = useState(false);
  const [Open4, setOpen4] = useState(false);
  const [Open5, setOpen5] = useState(false);
  return (
    <>
      <div className="m-0 p-0 bg-black w-full h-10 flex justify-center items-center">
        <h2 className="text-white text-xl font-medium">
          Super Deal! Free Shipping on Orders Over ₹999
        </h2>
        <div className=" relative left-90 text-black bg-white rounded-2xl w-24 h-8 flex items-center justify-center"> Login/Signup </div>
      </div>
      <div className=" bg-[#D9D9D9] h-20 flex justify-between items-baseline-last px-20">
        <div className="bold m-2 px-2 text-2xl text-black relative left-3">
          JATIN MENS WEAR
        </div>
        <div className="relative bottom-0 gap-5 px-2 flex left-30">
          <button onClick={() =>
             setOpen1(!Open1)} className="text-black">
            TopWears ▼
          </button>

          {Open1 && (
            <div className="absolute right-80 mt-2 top-7 w-40 bg-white shadow-lg rounded">
              <a className="block px-4 py-2 hover:bg-gray-100">Plain T-shirt</a>
              <a className="block px-4 py-2 hover:bg-gray-100">
                Printed t-shirts
              </a>
              <a className="block px-4 py-2 hover:bg-gray-100">Polo T-shirt</a>
              <a className="block px-4 py-2 hover:bg-gray-100">
                Rugged T-shirt
              </a>
              <a className="block px-4 py-2 hover:bg-gray-100">
                Oversize T-shirt
              </a>
              <a className="block px-4 py-2 hover:bg-gray-100">Plain Shirt</a>
              <a className="block px-4 py-2 hover:bg-gray-100">
                {" "}
                Printed Shirt
              </a>
              <a className="block px-4 py-2 hover:bg-gray-100">Checked Shirt</a>
              <a className="block px-4 py-2 hover:bg-gray-100">
                Oversized Shirt
              </a>
              <a className="block px-4 py-2 hover:bg-gray-100">
                Trending Shirt
              </a>
              <a className="block px-4 py-2 hover:bg-gray-100">
                Half-Sleeved Shirt
              </a>
            </div>
          )}
          <button onClick={() => setOpen2(!Open2)} className="text-black">
            Bottom Wear▼
          </button>

          {Open2 && (
            <div className="absolute right-60 top-7 mt-2 w-40 bg-white shadow-lg rounded">
              <a className="block px-4 py-2 hover:bg-gray-100">Plain Pants</a>
              <a className="block px-4 py-2 hover:bg-gray-100">Formal Pants</a>
              <a className="block px-4 py-2 hover:bg-gray-100">Denim jeans</a>
              <a className="block px-4 py-2 hover:bg-gray-100">Cargos</a>
              <a className="block px-4 py-2 hover:bg-gray-100">Joggers Pants</a>
              <a className="block px-4 py-2 hover:bg-gray-100">
                Japanese formal Pants
              </a>
              <a className="block px-4 py-2 hover:bg-gray-100">
                Boot Cut Jeans
              </a>
              <a className="block px-4 py-2 hover:bg-gray-100">
                Plain Black jeans
              </a>
            </div>
          )}
          <button onClick={() => setOpen5(!Open5)} className="text-black">
            Combos ▼
          </button>

          {Open5 && (
            <div className="absolute right-40 top-7 mt-2 w-40 bg-white shadow-lg rounded">
              <a className="block px-4 py-2 hover:bg-gray-100">
                3 Tshirts at 999/-
              </a>
              <a className="block px-4 py-2 hover:bg-gray-100">
                2 Shirts at 1099/-
              </a>
              <a className="block px-4 py-2 hover:bg-gray-100">
                Shirt Pant combo
              </a>
              <a className="block px-4 py-2 hover:bg-gray-100">
                4 Tshirt Combo
              </a>
            </div>
          )}
          <button onClick={() => setOpen3(!Open3)} className="text-black">
            Winter-Wear ▼
          </button>

          {Open3 && (
            <div className="absolute right-20 top-7 mt-2 w-40 bg-white shadow-lg rounded">
              <a className="block px-4 py-2 hover:bg-gray-100">
                Plain Hoodie
              </a>
              <a className="block px-4 py-2 hover:bg-gray-100">
                Printed Hoodie
              </a>
              <a className="block px-4 py-2 hover:bg-gray-100">
                Plain Sweatshirts
              </a>
              <a className="block px-4 py-2 hover:bg-gray-100">
               Anime Style Hoodies
              </a>
              <a className="block px-4 py-2 hover:bg-gray-100">
               Oversized Sweatshirts
              </a>
              <a className="block px-4 py-2 hover:bg-gray-100">
                Winter Jackets
              </a>
            </div>
          )}
          <button onClick={() => setOpen4(!Open4)} className="text-black">
            New Arrivals ▼
          </button>

          {Open4   && (
            <div className="absolute right-0 top-7 mt-2 w-40 bg-white shadow-lg rounded">
              <a className="block px-4 py-2 hover:bg-gray-100">
                Checked Shirts
              </a>
              <a className="block px-4 py-2 hover:bg-gray-100">
                Denim Jeans
              </a>
              <a className="block px-4 py-2 hover:bg-gray-100">
                Cargo Pants
              </a>
              <a className="block px-4 py-2 hover:bg-gray-100">
                Prada Half Sleeve Shirt
              </a>
              <a className="block px-4 py-2 hover:bg-gray-100">
                Gucci Printed T-shirt
              </a>
            </div>
          )}
        </div>
        <div className="relative right-10 bottom-10 w-10 h-8 rounded-2xl bg-white flex justify-center items-center"> cart</div>
      </div>
    </>
  );
};
export default Header;
