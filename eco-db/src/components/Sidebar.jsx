export default function Sidebar() {
  return (
    <aside className="w-[72px] bg-[#1e1b4b] flex flex-col items-center">
      <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white grid place-items-center mt-5 font-bold">
        A
      </div>
      <nav className="flex flex-col gap-3 mt-2">
        <button className="w-9 h-9 rounded-[10px] bg-[#4f46e5]" aria-label="Projects" />
        <button className="w-9 h-9 rounded-[10px] bg-[#2b2764]" aria-label="Folder 1" />
        <button className="w-9 h-9 rounded-[10px] bg-[#2b2764]" aria-label="Folder 2" />
      </nav>
      <div className="text-indigo-200 text-xs mt-auto mb-3">v0.1</div>
    </aside>
  );
}
