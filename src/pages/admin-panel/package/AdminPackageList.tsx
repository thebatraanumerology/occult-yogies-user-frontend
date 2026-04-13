import Breadcrumb from "@/src/components/admin/Breadcrumb";
import CustomTooltip from "@/src/components/CustomTooltip";
import Plan from "@/src/components/svg/Plan";
import { Edit, Edit2, Trash2 } from "lucide-react";
import React, { useState } from "react";

const AdminPackageList: React.FC = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  return (
    <div className="text-2xl w-full p-5 bg-lightYellow text-magenta">
      <Breadcrumb lists={[{ title: "Packages", to: "packages" }]} />

      <div className="bg-white/60 shadow-md mt-4 p-3 rounded-lg">
        <div className="flex border-b border-black/10 pb-2 justify-between items-center">
          <span className="text-[20px] font-semibold flex gap-1 items-center">
            <Plan className="w-5 h-5" />
            All Packages
          </span>

          <button
            type="button"
            onClick={() => {
              setModalVisible(!modalVisible);
            }}
            className="flex gap-1 shadow transform cursor-pointer hover:duration-300 hover:scale-105 border font-semibold border-magenta py-2 px-3 rounded-md items-center justify-center text-sm"
          >
            <Edit size={15} className="font-semibold" /> Create Packages
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-3">
          {[
            {
              title: "Mobile Package (Basic)",
              expiry: "2 Jan,2024",
            },
            {
              title: "Mobile Package",
              expiry: "12 March,2026",
            },
            { title: "Swtich Word Package", expiry: "15 April,2026" },
            { title: "Swtich Word Package", expiry: "15 April,2026" },
            { title: "Swtich Word Package", expiry: "15 April,2026" },
            { title: "Swtich Word Package", expiry: "15 April,2026" },
            { title: "Swtich Word Package", expiry: "15 April,2026" },
          ].map((lists, ind) => (
            <div
              key={ind}
              className="border bg-white hover:bg-bgYellow/10 cursor-pointer border-black/10 shadow p-3 flex justify-between items-center rounded-md"
            >
              <div>
                <p className="text-[15px] text-black font-semibold">
                  {lists?.title}
                </p>
                <p className="text-xs text-gray-500">
                  (Expiry: {lists?.expiry})
                </p>
              </div>
              <div className="flex gap-2">
                <CustomTooltip title="Edit">
                  <button
                    type="button"
                    onClick={() => {
                      setModalVisible(!modalVisible);
                    }}
                    className="bg-blue-500 text-white p-2 rounded-sm cursor-pointer"
                  >
                    <Edit2 size={18} />
                  </button>
                </CustomTooltip>
                <CustomTooltip title="Remove">
                  <button
                    type="button"
                    className="bg-red-500 text-white p-2 rounded-sm cursor-pointer"
                  >
                    <Trash2 size={18} />
                  </button>
                </CustomTooltip>
              </div>
            </div>
          ))}
        </div>
      </div>

      {modalVisible && (
        <div className="fixed inset-0 bg-black/50 shadow flex items-center z-99 justify-center">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-4">
            <div className="relative flex justify-center border-b border-black/10 items-center pb-3">
              <h2 className="text-lg text-black font-semibold">Edit Package</h2>
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
                  Package Name <span className="text-red-600">*</span>
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
                  Package URL <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  className="col-span-2 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-gray-300 placeholder:text-gray-400/60"
                  placeholder="Enter Package URL"
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

export default AdminPackageList;
