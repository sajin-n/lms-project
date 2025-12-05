export default function Card({ children, className = "" }) {
  return (
    <div className={`bg-white border border-gray-200 rounded-xl shadow-sm p-6 text-gray-800 hover:shadow-md transition-all duration-200 hover:-translate-y-1 ${className}`}>
      {children}
    </div>
  );
}