import { useState } from "react";
import CareerModal from "./CareerModal";

const CareerMenuItem = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <li
        onClick={() => setOpen(true)}
        className="flex items-center gap-2
                   px-3 py-2 rounded cursor-pointer
                   text-amber-300 hover:bg-slate-800
                   transition"
      >
        <span>🔥</span>
        <span className="font-semibold">이재오 이력</span>
      </li>

      {open && <CareerModal onClose={() => setOpen(false)} />}
    </>
  );
};

export default CareerMenuItem;
