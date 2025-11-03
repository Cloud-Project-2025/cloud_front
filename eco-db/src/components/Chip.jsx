export default function Chip({ children, className = "" }) {
  return (
    <span className={`inline-flex items-center rounded-md bg-gray-100 text-gray-700 text-xs px-2 py-1 ${className}`}>
      {children}
    </span>
  );
}
