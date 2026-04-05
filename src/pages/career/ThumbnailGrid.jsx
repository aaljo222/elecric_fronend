const ThumbnailGrid = ({ items, onOpen }) => (
  <div className="grid grid-cols-3 gap-6 p-8">
    {items.map((it) => (
      <div
        key={it.src}
        onClick={() => onOpen(it)}
        className="cursor-pointer group"
      >
        <div className="aspect-[4/3] overflow-hidden rounded-xl border shadow">
          <img
            src={it.src}
            className="w-full h-full object-cover group-hover:scale-105 transition"
            alt=""
          />
        </div>
        <p className="mt-2 text-sm text-center text-gray-600">
          {it.label}
        </p>
      </div>
    ))}
  </div>
);

export default ThumbnailGrid
