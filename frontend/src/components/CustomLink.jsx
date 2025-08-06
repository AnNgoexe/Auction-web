import { NavLink } from "react-router-dom";

const CustomLink = ({ to, className = '', children }) => {
  const linkStyles =
    "text-[15px] font-medium text-gray-600 font-sans cursor-pointer list-none";

  return (
    <NavLink to={to} className={`${className} ${linkStyles}`}>
      {children}
    </NavLink>
  );
};

export default CustomLink;
