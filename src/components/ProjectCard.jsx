export default function ProjectCard({ title, subtitle, onClick }) {
  return (
    <div
      className="w-full h-24 grid grid-cols-[1fr_auto] items-center px-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
      onClick={onClick}
      role="button"
    >
      <div>
        {subtitle && <p className="text-xs text-gray-500 mb-1">{subtitle}</p>}
        <h3 className="text-base font-semibold leading-tight">{title}</h3>
      </div>
      <div className="text-xs text-gray-400">›</div>
    </div>
  );
}
