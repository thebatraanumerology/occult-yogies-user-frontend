import { Home } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

type BreadcrumbChild = {
  title?: string | undefined;
  to?: string;
};
type BreadcrumbType = {
  lists?: BreadcrumbChild[];
};
const Breadcrumb: React.FC<BreadcrumbType> = ({ lists }) => {
  return (
    <ul className="flex gap-1 items-center text-lg">
      <li>
        <Link
          to="/admin/dashboard"
          className="flex  items-center after:content-['/'] after:text-sm"
        >
          <Home size={18} className="me-1" />
        </Link>
      </li>
      {lists?.map((list, ind) => (
        <li key={ind} className={`text-sm text-gray-800`}>
          {lists?.length == ind + 1 ? (
            <span className="text-gray-700">{list?.title}</span>
          ) : (
            <Link
              to={`lists/${list?.to ?? "#"}`}
              className={`flex text-magenta gap-1 items-center after:content-["/"]`}
            >
              {list?.title}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
};

export default Breadcrumb;
