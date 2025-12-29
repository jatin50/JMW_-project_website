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
      <div className=" bg-[#D9D9D9] h-20 flex justify-between items-baseline-last px-20">
        <div className="bold m-2 px-2 text-2xl text-black relative left-3">
          JATIN MENS WEAR
        </div>
      </div>
      <div className="bg-[#FDEA22] h-12 w-xl rounded-4xl shadow-xl relative left-85 top-8  flex justify-between items-center p-10">
        <div className="font-medium text-xl p-2 relative left-4 ">Cart</div>
        <div className="font-medium text-xl p-2 ">..................</div>
        <div className="font-medium text-xl p-2">Address</div>
        <div className="font-medium text-xl p-2 ">..................</div>
        <div className="font-medium text-xl p-2 relative right-4">Payment</div>
      </div>
      <div className=" flex items-center gap-5 justify-between">
        <div className=" bg-[#D9D9D9]/20 rounded-2xl relative top-12  h-110 w-3/5 flex-col item centre justify-center ">

        <div className=" w-full h-80 rounded-3xl relative top-2 flex items-center justify-center">
          
            <img
              className=" h-full rounded-xl shadow-xl "
              src="/public/bartang island.webp"
              alt=""
              srcset=""
            />
          </div>
          <div className=" relative top-4 text-2xl font-medium left-30  ">
            Price: <span className="line-through text-gray-600/30"> ₹799</span> ₹499
          </div>
          <div className=" relative top-4 text-2xl font-medium left-30 w-3/4  ">
            Product Name: Casual Shirt
            Lorem ipsum dolor sit, amet consectetur adipisicing elit.
          </div>
        </div>
        <div className="bg-amber-300 w-1/2 h-100 relative top-12 rounded-3xl">
          
        </div>
      </div>
    </>
  );
};
export default Cart;
