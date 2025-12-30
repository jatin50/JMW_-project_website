import React from "react";
const Cart = () => {
  return (
    <>
      <div className="m-0 p-0 bg-black w-full h-10 flex justify-center items-center">
        <h2 className="text-white text-xl font-medium">
          Super Deal! Free Shipping on Orders Over ₹999
        </h2>
        <div className=" relative left-90 text-black bg-white rounded-2xl w-24 h-8 flex items-center justify-center">
          {" "}
          Login/Signup{" "}
        </div>
      </div>
      <div className=" bg-[#D9D9D9] h-20 flex justify-between items-baseline-last">
        <div className="bold m-2  text-2xl text-black relative left-3">
          JATIN MENS WEAR
        </div>
      </div>
      <div className="bg-[#FDEA22] h-12 w-xl rounded-4xl shadow-xl relative left-85 top-8  flex justify-between items-center p-2">
        <div className="font-medium text-xl p-2 relative left-4 ">Cart</div>
        <div className="font-medium text-xl p-2 ">..................</div>
        <div className="font-medium text-xl p-2">Address</div>
        <div className="font-medium text-xl p-2 ">..................</div>
        <div className="font-medium text-xl p-2 relative right-4">Payment</div>
      </div>

      <div className=" flex items-center gap-5 justify-between">
        <div className=" bg-[#D9D9D9]/20 rounded-2xl relative top-12  h-auto w-3/5 flex-col items-center justify-center ">
          <div className="w-11/12 h-60 outline-1 flex rounded-xl shadow-2xl my-4 mr-2 ml-2">
            <div className=" w-60 h-50 rounded-3xl relative top-2 flex items-center justify-center">
              <img
                className=" h-full rounded-xl  relative left-2 shadow-xl "
                src="/bartang island.webp"
                alt=""
                srcset=""
              />
            </div>
            <div className="flex-col h-50 gap-2">
              <div className=" relative top-4 text-xl font-medium left-8  ">
                Price:{" "}
                <span className="line-through text-gray-600/30"> ₹799</span>{" "}
                ₹499
              </div>
              <div className=" relative top-4 text-xl font-medium left-8 w-3/4  ">
                Product Name: Casual Shirt Lorem ipsum dolor sit, amet
                consectetur adipisicing elit.
              </div>
              <div className=" relative top-4 text-xl font-medium left-8 outline-1 w-18 px-1  rounded-sm bg-[#D9D9D9]/30   ">
                Size- M
              </div>
              <div className=" relative top-4 text-xl font-medium left-8 outline-1 w-28 px-1 my-1  rounded-sm bg-[#D9D9D9]/30   ">
                Color-Black
              </div>
              <label
                className="relative top-3 text-xl font-medium left-7"
                htmlFor="quantity"
              >
                Quantity
              </label>
              <select
                className="w-15 h-5 text-black  relative top-4 text-xl font-medium left-8 outline-1 px-1 my-1"
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
            <div className="bg-white sticky mt-5 mr-8 flex items-center justify-center outline-1 w-16 h-8 rounded-2xl">
              D
            </div>
          </div>
          <div className="w-11/12 h-60 outline-1 flex rounded-2xl shadow-2xl my-4 mr-2 ml-2">
            <div className=" w-60 h-50 rounded-3xl relative top-2 flex items-center justify-center">
              <img
                className=" h-full rounded-xl  relative left-2 shadow-xl "
                src="/bartang island.webp"
                alt=""
                srcset=""
              />
            </div>
            <div className="flex-col h-50 gap-2">
              <div className=" relative top-4 text-xl font-medium left-8  ">
                Price:{" "}
                <span className="line-through text-gray-600/30"> ₹799</span>{" "}
                ₹499
              </div>
              <div className=" relative top-4 text-xl font-medium left-8 w-3/4  ">
                Product Name: Casual Shirt Lorem ipsum dolor sit, amet
                consectetur adipisicing elit.
              </div>
              <div className=" relative top-4 text-xl font-medium left-8 outline-1 w-18 px-1  rounded-sm bg-[#D9D9D9]/30   ">
                Size- M
              </div>
              <div className=" relative top-4 text-xl font-medium left-8 outline-1 w-28 px-1 my-1  rounded-sm bg-[#D9D9D9]/30   ">
                Color-Black
              </div>
              <label
                className="relative top-3 text-xl font-medium left-7"
                htmlFor="quantity"
              >
                Quantity
              </label>
              <select
                className="w-15 h-5 text-black  relative top-4 text-xl font-medium left-8 outline-1 px-1 my-1"
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
            <div className="bg-white sticky mt-5 mr-8 flex items-center justify-center outline-1 w-16 h-8 rounded-2xl">
              D
            </div>
          </div>
        </div>
        <div className=" bg-[#D9D9D9]/20 rounded-2xl relative top-8 h-auto w-3/5 flex-col  items-center justify-center ">
          <div className="w-11/12 h-30 outline-1 bg-linear-to-r from-white via bg-yellow-300 to-yellow-500 rounded-xl m-5 flex-col gap-1 items-center justify-center">
            <div className=" relative top-0  w-auto h-10 outline-1 rounded-t-xl  flex items-center justify-center">
              BONUS OFFERS
            </div>
            <div className=" flex items-center justify-center mt-4">
              SAVE EXTRA 10% OFF USING CODE - JMW10
            </div>
          </div>
        <div className="w-11/12 h-50 p-2 m-5 rounded-2xl outline-1 flex-col gap-3 ">
        <div className="flex items-center justify-center w-full text-2xl font-medium underline">
          Total Items(2)
          </div>
          <div className=" flex items-baseline text-xl font-medium mt-3 ml-8">Price Total...............................................₹2499</div>
          <div className=" flex items-baseline text-xl font-medium mt-1 ml-8">Discount...............................................₹499</div>
          <div className=" flex items-baseline text-xl font-medium mt-1 ml-8">Shipping............................................... <span className="line-through text-gray-700/30 mr-1"> ₹49 </span> FREE </div>
          <div className=" flex items-baseline text-xl font-medium mt-1 ml-8">Cart Total...............................................₹2099</div>
          </div>
          <div className="flex items-center justify-center w-50 ml-50 my-7 h-10 bg-blue-500 text-white rounded-xl mt-4">
            ORDER NOW
          </div>
        </div>

      </div>
    </>
  );
};
export default Cart;
