const Highlight = ({ children, accent }) => {
  return (
    <div
      className={`p-6 rounded-xl text-lg leading-relaxed shadow
        text-slate-800 bg-white
        ${
          accent
            ? "border-l-4 border-amber-400 bg-gradient-to-r from-amber-50 to-yellow-50"
            : "border-l-4 border-indigo-500"
        }
      `}
    >
      {children}
    </div>
  );
};

export default Highlight;
