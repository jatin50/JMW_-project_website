import React from "react";

const Footer = () => {
  return (
    <>
      <div className="bg-[#221E1E] text-white p-4 absolute bottom-0 w-full h-50 ">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <div className="text-xl font-semibold relative left-10 mr-10">
              JATIN MENS WEAR
              <div>Premium menswear crafted for everyday style. Est. 2015.</div>
            </div>

            <div className="flex space-x-4 gap-4 flex-col relative top-8">
              <a href="#" className="hover:underline">
                About Us
              </a>
              <a href="#" className="hover:underline">
                Contact
              </a>
              <a href="#" className="hover:underline">
                Privacy Policy
              </a>
              <a href="https://github.com/jatin50" className="hover:underline">
                Github
              </a>
            </div>
            <div className="flex space-x-4 gap-4 flex-col relative top-10">
              <a href="#" className="hover:underline">
             Customer Support
              </a>
              <a href="#" className="hover:underline">
                Shipping & Returns
              </a>
              <a href="#" className="hover:underline">
                FAQS
              </a>
              <a href="#" className="hover:underline">
                Feedback
              </a>
            </div>
            <div className="flex space-x-4 gap-4 flex-col relative top-10">
              <a href="#" className="hover:underline">
             Terms and Conditions
              </a>
              <a href="#" className="hover:underline">
              Privacy Policy
              </a>
              <a href="#" className="hover:underline">
               Instagram
              </a>
              <a href="#" className="hover:underline">
                Twitter(X)
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Footer;
