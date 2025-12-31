import React from "react";
const Address = () => {
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
        <div className="font-medium text-xl p-2 relative left-4 ">
          {" "}
          <span class="inline-flex items-center justify-center w-5 h-5 rounded-full mx-1 bg-green-600 text-white text-sm">
            ✓
          </span>
          Cart
        </div>
        <div className="font-medium text-xl p-2 ">..................</div>
        <div className="font-medium text-xl p-2">
          {" "}
          <span class="inline-flex items-center justify-center w-5 h-5 rounded-full mx-1  text-black text-sm">
            ✓
          </span>
          Address
        </div>
        <div className="font-medium text-xl p-2 ">..................</div>
        <div className="font-medium text-xl p-2 relative right-4">
          {" "}
          <span class="inline-flex items-center justify-center w-5 h-5 rounded-full mx-1  text-black text-sm">
            ✓
          </span>
          Payment
        </div>
      </div>

      <div className=" flex items-center gap-5 justify-between">
        <div className=" bg-[#D9D9D9]/20 rounded-2xl relative top-12  h-auto w-3/5 flex-col items-center justify-center ">
          <div className="w-11/12 h-auto outline-1 p-3 m-3 flex-col rounded-2xl gap-1">
            <div className="text-2xl font-medium">Address Details</div>
            <div className="flex">
              <div>
                <label className="m-2" htmlFor="email">
                  First Name:
                </label>
                <input
                  className="w-1/2 h-10 p-2 m-2 bg-white outline-1 rounded-md"
                  type="text"
                  name="first name"
                  id=" first Name"
                  required={true}
                />
              </div>
              <div>
                <label className="m-2" htmlFor="email">
                  Last Name:
                </label>
                <input
                  className="w-1/2 h-10 p-2 m-2 bg-white outline-1 rounded-md"
                  type="text"
                  name="last name"
                  id=" last Name"
                  required={true}
                />
              </div>
            </div>
            <div>
              <label className="m-2" htmlFor="address line-1">
                Address line-1:
              </label>
              <input
                className="w-1/2 h-10 p-2 bg-white outline-1 rounded-md"
                type="text"
                name="address line-1"
                id="address line-1"
                required={true}
              />
              <div>
                <label className="m-2" htmlFor="address line-2">
                  Address line-2:
                </label>
                <input
                  className="w-1/2 h-10 p-2 my-2 bg-white outline-1 rounded-md"
                  type="text"
                  name="address line-2"
                  id="address line-2"
                  required={true}
                />
              </div>
              <div className="flex">
                <div>
                  <label className="m-2" htmlFor="email">
                    District:
                  </label>
                  <input
                    className="w-2/3 h-10 m-2 p-1 bg-white outline-1 rounded-md"
                    type="text"
                    name="address"
                    id="address"
                    required={true}
                  />
                </div>
                <div>
                  <label className="m-2" htmlFor="email">
                    City:
                  </label>
                  <input
                    className="w-2/3 h-10 m-2 p-1 bg-white outline-1 rounded-md"
                    type="text"
                    name="address"
                    required={true}
                    id="address"
                  />
                </div>
                <div>
                  <label className="m-2" htmlFor="email">
                    State:
                  </label>
                  <input
                    className="w-2/3 h-10 m-2 p-1 bg-white outline-1 rounded-md"
                    type="text"
                    name="address"
                    id="address"
                    required={true}
                  />
                </div>
                <div>
                  <label className="m-2" htmlFor="email">
                    Pincode:
                  </label>
                  <input
                    className="w-2/3 h-10 m-2 p-1 bg-white outline-1 rounded-md"
                    type="number"
                    min={100000}
                    max={999999}
                    name="pincode"
                    id="pincode"
                    required={true}
                  />
                </div>
              </div>
              <div>
                <label className="m-2" htmlFor="email">
                  Email:
                </label>
                <input
                  className="w-1/2 h-10 p-2 my-2 bg-white outline-1 rounded-md"
                  type="email"
                  name="email"
                  id="email"
                  required={true}
                />
              </div>
              <div>
                <label className="m-2" htmlFor="Contact">
                  Contact Number:
                </label>
                <input
                  className="w-1/2 h-10 p-2 my-2 bg-white outline-1 rounded-md"
                  type="number"
                  min={1000000000}
                  max={9999999999}
                  name="Contact"
                  id="Contact"
                  required={true}
                />
              </div>
              <div className=" p-2 my-2 mx-1 underline">
                {" "}
                Use Current Location
                <input
                  className="m-1 w-6 h-4 p-2"
                  type="checkbox"
                  name=""
                  id=""
                />
              </div>
            </div>
          </div>
        </div>
        <div className=" bg-[#D9D9D9]/20 rounded-2xl relative top-12 h-auto w-3/5 flex-col  items-center justify-center ">
          <div className="w-11/12 h-30 outline-1 bg-linear-to-r from-white via bg-yellow-300 to-yellow-500 rounded-xl m-5 flex-col gap-1 items-center justify-center">
            <div className=" relative top-0  w-auto h-10 outline-1 rounded-t-xl  flex items-center justify-center">
              BONUS OFFERS
            </div>
            <div className=" flex items-center justify-center mt-4">
              SAVE EXTRA 10% OFF USING CODE - JMW10{" "}
              <button className="w-22 h-8 bg-white/40 text-shadow-white rounded-2xl outline-1 mx-2">
                Apply Now
              </button>
            </div>
          </div>
          <div className="w-11/12 h-50 p-2 m-5 rounded-2xl outline-1 flex-col gap-3 ">
            <div className="flex items-center justify-center w-full text-2xl font-medium underline">
              Total Items(2)
            </div>
            <div className=" flex items-baseline text-xl font-medium mt-3 ml-8">
              Price Total...............................................₹2499
            </div>
            <div className=" flex items-baseline text-xl font-medium mt-1 ml-8">
              Discount...............................................₹499
            </div>
            <div className=" flex items-baseline text-xl font-medium mt-1 ml-8">
              Shipping...............................................{" "}
              <span className="line-through text-gray-700/30 mr-1"> ₹49 </span>{" "}
              FREE{" "}
            </div>
            <div className=" flex items-baseline text-xl font-medium mt-1 ml-8">
              Cart Total...............................................₹2099
            </div>
          </div>
          <div className="flex items-center justify-center w-50 ml-50 my-7 h-10 bg-blue-500 text-white rounded-xl mt-4">
            CHECKOUT
          </div>
        </div>
      </div>
    </>
  );
};
export default Address;
