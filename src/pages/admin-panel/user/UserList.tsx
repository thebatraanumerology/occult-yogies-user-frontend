import Breadcrumb from "@/src/components/admin/Breadcrumb";
import React from "react";

const AdminUsers: React.FC = () => {
  return (
    <div className="text-2xl w-full p-5 bg-lightYellow text-magenta">
        <Breadcrumb lists={[
            {title:'User Lists',to:"users"}
        ]}/>
      <div>Admin Users Lists</div>
    </div>
  );
};

export default AdminUsers;
