import { NavLink } from "react-router-dom";

const MenuItem = ({ icon, label, to }) => {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          `
          flex items-center gap-2 px-4 py-3 rounded
          cursor-pointer
          ${
            isActive
              ? "bg-slate-700 text-white"
              : "text-slate-300 hover:bg-slate-700"
          }
        `
        }
      >
        <span>{icon}</span>
        <span>{label}</span>
      </NavLink>
    </li>
  );
};

export default MenuItem;
