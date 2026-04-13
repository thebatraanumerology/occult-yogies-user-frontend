import Breadcrumb from "@/src/components/admin/Breadcrumb";
import Plan from "@/src/components/svg/Plan";
import StarIcon from "@/src/components/svg/StarIcon";
import { Edit } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const AdminPlanInfo: React.FC = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  return (
    <div className="text-2xl flex flex-col gap-5 w-full p-5 bg-lightYellow text-magenta">
      <div className="flex justify-between items-center">
        <Breadcrumb
          lists={[
            { title: "Plans", to: "plans" },
            { title: "Plan Information", to: "plans/info" },
          ]}
        />
        <div></div>
      </div>

      <div className="bg-white/60 shadow-md p-3 rounded-lg">
        <div className="flex border-b border-black/10 pb-2 justify-between items-center">
          <span className="text-[20px] font-semibold flex gap-1 items-center">
            <StarIcon />
            Plan Information
          </span>
          <button
            type="button"
            onClick={() => {
              setModalVisible(!modalVisible);
            }}
            className="flex gap-1 shadow transform cursor-pointer hover:duration-300 hover:scale-105 border font-semibold border-magenta py-2 px-3 rounded-md items-center justify-center text-sm"
          >
            <Edit size={15} className="font-semibold" /> Edit Plan
          </button>
        </div>

        <div className="text-black grid grid-cols-3 gap-3 py-4 text-sm">
          <div className="flex gap-1">
            <strong>Plan Name:</strong>
            <span>Elite Plan</span>
          </div>

          <div className="flex gap-1">
            <strong>Valid For:</strong>
            <span>5 Years</span>
          </div>

          <div className="flex gap-1">
            <strong>Max Users:</strong>
            <span>5000</span>
          </div>
        </div>
      </div>

      <div className="bg-white/60 p-3 shadow-md rounded-lg">
        <div className="flex border-b border-black/10 pb-2 justify-between items-center">
          <span className="text-[20px] font-semibold flex gap-1 items-center">
            <Plan className="w-6 h-6" />
            Packages Lists
          </span>
          <Link
            to={"/admin/packages"}
            className="flex gap-1 shadow transform cursor-pointer hover:duration-300 hover:scale-105 border font-semibold border-magenta py-2 px-3 rounded-md items-center justify-center text-sm"
          >
            <Edit size={15} className="font-semibold" /> View All Packages
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-1  p-3">
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
              className="flex justify-between border border-black/10 items-center hover:bg-bgYellow/20 hover:border-none bg-white shadow hover:scale-102 scale-none cursor-pointer transform hover:duration-300 rounded-lg p-3"
            >
              <div className="text-sm text-gray-700">
                <p className="font-semibold">{planlist}</p>
                <span className="text-gray-400">(Expiry: 25Jan, 2028)</span>
              </div>

              <label className="inline-flex items-center cursor-pointer relative">
                <input type="checkbox" className="sr-only peer" />

                <div className="w-12 h-7 bg-gray-300 rounded-full peer-checked:bg-magenta transition-colors duration-300"></div>
                <div className="absolute top-0 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 translate-y-1 peer-checked:translate-x-5"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {modalVisible && (
        <div className="fixed inset-0 bg-black/50 shadow flex items-center z-99 justify-center">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-4">
            <div className="relative flex justify-center border-b border-black/10 items-center pb-3">
              <h2 className="text-lg text-black font-semibold">Edit Plan</h2>
              <button
                onClick={() => {
                  setModalVisible(!modalVisible);
                }}
                type="button"
                className="absolute hover:bg-gray-300 cursor-pointer -top-7 -right-7 bg-gray-200 text-black w-9 rounded-full h-9 hover:text-black"
              >
                &times;
              </button>
            </div>

            <div className="w-full max-w-2xl p-3">
              <div className="grid grid-cols-3 items-center gap-4 mb-4">
                <label className="text-sm text-black text-right">
                  Plan Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  className="col-span-2 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-gray-300 placeholder:text-gray-400/60"
                  placeholder="Enter Plan Name"
                />
              </div>

              <div className="grid grid-cols-3 items-center gap-4 mb-4">
                <label className="text-sm text-black text-right">
                  Valid for <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  className="col-span-2 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-gray-300 placeholder:text-gray-400/60"
                  placeholder="Enter Validity"
                />
              </div>

              <div className="grid grid-cols-3 items-center gap-4">
                <label className="text-sm text-black text-right">
                  Max Users <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  className="col-span-2 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-gray-300 placeholder:text-gray-400/60"
                  placeholder="Enter Max Users"
                />
              </div>
            </div>

            <div className="flex justify-center border-t border-black/10 pt-3 gap-2">
              <button
                type="button"
                className="flex gap-1 shadow transform cursor-pointer duration-300 hover:scale-105 scale-none border font-semibold border-magenta py-2 px-4 rounded-md items-center justify-center text-sm"
              >
                Reset
              </button>

              <button
                type="button"
                className="flex gap-1 shadow transform cursor-pointer duration-300 hover:scale-105 scale-none border font-semibold bg-magenta text-white py-2 px-4 rounded-md items-center justify-center text-sm"
              >
                Save & Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPlanInfo;
