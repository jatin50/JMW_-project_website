import React from "react";
import { useState } from "react";
import { Link, NavLink } from "react-router";
import { ShoppingCart } from "lucide-react";
import Cart from "./Cart.jsx";
const Header = () => {
  const [openMenu, setOpenMenu] = useState(null);
  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
    setTimeout(() => {
      setOpenMenu(null);
    }, 12000);
  };

  const [showLogin, setShowLogin] = useState(false);
  const [EnterOTP, setEnterOTP] = useState(false);
  const handleClick = () => {
    setShowLogin(false);
    setEnterOTP(true);
  };
  return (
    <>
      <div className="m-0 p-0 bg-black w-full h-10 flex justify-center items-center">
        <h2 className="text-white text-xl font-medium">
          Super Deal! Free Shipping on Orders Over ₹999
        </h2>
        <button
          onClick={() => setShowLogin(true)}
          className=" relative left-90 text-black bg-white rounded-2xl w-24 h-8 flex items-center justify-center"
        >
          {" "}
          Login/Signup{" "}
        </button>
        {showLogin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setShowLogin(false)}
            />
            <div className="relative bg-white w-full max-w-sm rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Login</h2>

              <input
                type="text"
                placeholder="Email or Phone"
                className="w-full border p-2 rounded mb-3"
                required={true}
              />

              <button
                onClick={handleClick}
                className="w-full bg-black text-white py-2 rounded"
              >
                Get OTP
              </button>
            </div>
          </div>
        )}

        {EnterOTP && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => {
                setEnterOTP(false);
              }}
            />
            <div className="relative bg-white w-full max-w-sm rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Login</h2>
              <input
                type="number"
                placeholder="Enter OTP"
                className="w-full border p-2 rounded mb-3"
                required={true}
              />
              <button className="w-full bg-black text-white py-2 rounded">
                Enter OTP
              </button>
            </div>
          </div>
        )}
      </div>
      <div className=" bg-[#D9D9D9] h-20 flex justify-between items-baseline-last ">
        <div className="bold m-2 px-2 text-2xl text-black relative left-3">
          JATIN MENS WEAR
        </div>
        <div className="relative bottom-0 gap-5 px-2 flex left-30">
          <button onClick={() => toggleMenu("topWears")} className="text-black">
            TopWears ▼
          </button>

          {openMenu === "topWears" && (
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
          <button
            onClick={() => toggleMenu("bottomWears")}
            className="text-black"
          >
            Bottom Wear▼
          </button>

          {openMenu === "bottomWears" && (
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
          <button onClick={() => toggleMenu("combos")} className="text-black">
            Combos ▼
          </button>

          {openMenu === "combos" && (
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
          <button
            onClick={() => toggleMenu("winterWear")}
            className="text-black"
          >
            Winter-Wear ▼
          </button>

          {openMenu === "winterWear" && (
            <div className="absolute right-20 top-7 mt-2 w-40 bg-white shadow-lg rounded">
              <a className="block px-4 py-2 hover:bg-gray-100">Plain Hoodie</a>
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
          <button
            onClick={() => toggleMenu("newArrivals")}
            className="text-black"
          >
            New Arrivals ▼
          </button>

          {openMenu === "newArrivals" && (
            <div className="absolute right-0 top-7 mt-2 w-40 bg-white shadow-lg rounded">
              <a className="block px-4 py-2 hover:bg-gray-100">
                Checked Shirts
              </a>
              <a className="block px-4 py-2 hover:bg-gray-100">Denim Jeans</a>
              <a className="block px-4 py-2 hover:bg-gray-100">Cargo Pants</a>
              <a className="block px-4 py-2 hover:bg-gray-100">
                Prada Half Sleeve Shirt
              </a>
              <a className="block px-4 py-2 hover:bg-gray-100">
                Gucci Printed T-shirt
              </a>
            </div>
          )}
        </div>
        <div className="relative right-10 bottom-6 w-10 h-8 rounded-2xl bg-white flex justify-center items-center">
          <Link to="/Cart">
            <ShoppingCart className="w-6 h-6 text-black" />
          </Link>
        </div>
      </div>
    </>
  );
};
export default Header;
