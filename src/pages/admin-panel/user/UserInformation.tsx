import Breadcrumb from "@/src/components/admin/Breadcrumb";
import DownArrow from "@/src/components/svg/DownArrow";
import StarIcon from "@/src/components/svg/StarIcon";
import SubscriptionCalender from "@/src/components/svg/SubscriptionCalender";
import { Copy, Edit } from "lucide-react";
import React, { useState } from "react";

const AdminUserInfo: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>();
  return (
    <div className="text-2xl flex flex-col gap-5 w-full p-5 bg-lightYellow text-magenta">
      <div className="flex justify-between items-center">
        <Breadcrumb
          lists={[
            { title: "User Lists", to: "users" },
            { title: "User Information", to: "users/info" },
          ]}
        />

        <button
          type="button"
          className="flex gap-1 transform cursor-pointer hover:duration-300 hover:scale-105 border font-semibold border-magenta py-2 px-3 rounded-md items-center justify-center text-sm"
        >
          <Copy size={15} className="font-semibold" /> Copy
        </button>
      </div>

      <div className="bg-white/60 shadow-md p-3 rounded-lg">
        <div className="flex border-b border-black/10 pb-2 justify-between items-center">
          <span className="text-[20px] font-semibold flex gap-1 items-center">
            <StarIcon />
            User Information
          </span>
          <button
            type="button"
            className="flex gap-1 shadow transform cursor-pointer hover:duration-300 hover:scale-105 border font-semibold border-magenta py-2 px-3 rounded-md items-center justify-center text-sm"
          >
            <Edit size={15} className="font-semibold" /> Edit User
          </button>
        </div>

        <div className="text-black grid grid-cols-3 gap-3 py-4 text-sm">
          <div className="flex gap-1">
            <strong>User Name:</strong>
            <span>Avdhesh Kumar</span>
          </div>

          <div className="flex gap-1">
            <strong>Mobile Number:</strong>
            <span>+91-9898989898</span>
          </div>

          <div className="flex gap-1">
            <strong>Email ID/ User ID:</strong>
            <span>avdhesh.sws@gmail.com</span>
          </div>

          <div className="flex gap-1">
            <strong>Password:</strong>
            <span>avdhesh@123#@</span>
          </div>

          <div className="flex gap-1">
            <strong>Creation Date:</strong>
            <span>02 Jan, 2026</span>
          </div>
        </div>
      </div>

      <div className="bg-white/60 p-3 shadow-md rounded-lg">
        <div className="flex border-b border-black/10 pb-2 justify-between items-center">
          <span className="text-[20px] font-semibold flex gap-1 items-center">
            <SubscriptionCalender />
            Subscription
          </span>
          <button
            type="button"
            className="flex gap-1 shadow transform cursor-pointer hover:duration-300 hover:scale-105 border font-semibold border-magenta py-2 px-3 rounded-md items-center justify-center text-sm"
          >
            <Edit size={15} className="font-semibold" /> Edit Plan
          </button>
        </div>

        {[
          {
            title: "Free Plan",
            expiry: "",
          },
          {
            title: "Basic Plan",
            expiry: "02 April,2025",
          },
          {
            title: "Gold Plan",
            expiry: "10 Feb,2026",
          },
          {
            title: "Elite Plan",
            expiry: "20 April,2026",
          },
        ].map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="bg-white shadow-sm mt-3 rounded-lg "
            >
              <div
                onClick={() => {
                  setOpenIndex(!isOpen ? index : null);
                }}
                className={`${isOpen && "border-b border-black/10 pb-3"} cursor-pointer p-3 flex justify-between items-center gap-2`}
              >
                <div className="flex items-center gap-1">
                  <p className="text-magenta font-semibold text-[15px]">
                    {item?.title}
                  </p>
                  {item?.expiry && (
                    <span className="text-gray-500 text-xs">
                      (Expiry: {item?.expiry})
                    </span>
                  )}
                </div>
                <DownArrow
                  isOpen={isOpen}
                  className={`w-6 h-6 transform duration-500 ${isOpen && "rotate-180"} rotate-0`}
                />
              </div>

              {isOpen && (
                <div className="grid grid-cols-3 gap-2 mt-3  p-3">
                  {[
                    "Name Numero logy (Basic)",
                    "Vedic Switch Word",
                    "Instant Mobile Miracle",
                    "Name Numero logy (Basic)",
                    "Vedic Switch Word",
                    "Instant Mobile Miracle",
                    "Name Numero logy (Basic)",
                    "Vedic Switch Word",
                    "Instant Mobile Miracle",
                  ].map((planlist, pind) => (
                    <div
                      key={pind}
                      className="flex justify-between border border-black/10 items-center hover:bg-bgYellow/20  bg-white shadow cursor-pointer transform hover:duration-300 hover:scale-102 hover:border-none scale-none rounded-lg p-3"
                    >
                      <div className="text-sm text-gray-700">
                        <p className="font-semibold">{planlist}</p>
                        <span className="text-gray-400">
                          (Expiry: 25Jan, 2028)
                        </span>
                      </div>

                      <label className="inline-flex items-center cursor-pointer relative">
                        <input type="checkbox" className="sr-only peer" />

                        <div className="w-12 h-7 bg-gray-300 rounded-full peer-checked:bg-magenta transition-colors duration-300"></div>
                        <div className="absolute top-0 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 translate-y-1 peer-checked:translate-x-5"></div>
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminUserInfo;
