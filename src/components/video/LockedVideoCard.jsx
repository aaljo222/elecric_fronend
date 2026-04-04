const LockedVideoCard = ({ locked }) => (
  <article className="flex flex-col bg-white rounded-xl overflow-hidden border border-gray-100 opacity-60">
    <div className="relative h-56 bg-gray-200 flex items-center justify-center">
      <Lock className="text-gray-400" size={48} />
    </div>
    <div className="p-8 flex flex-col flex-grow">
      <span className="text-gray-500 font-bold text-xs uppercase tracking-widest mb-2 block">
        {locked.subject || "영상 강의"}
      </span>
      <h3 className="text-2xl font-bold text-gray-900 mb-3 leading-tight line-clamp-2 min-h-[3.5rem]">
        {locked.title}
      </h3>
      <div className="mt-auto">
        <button
          disabled
          className="w-full py-3 bg-gray-100 text-gray-400 text-lg font-bold rounded-xl cursor-not-allowed"
        >
          수강 불가 (영상 준비중)
        </button>
      </div>
    </div>
  </article>
);

export default LockedVideoCard;
