export default function SkeletonProductCard() {
  return (
    <div className="animate-pulse bg-white rounded-xl shadow-md overflow-hidden flex flex-col">
      <div className="bg-gray-300 h-48 w-full" />

      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-300 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-2/3" />

        <div className="mt-3 flex justify-between">
          <div className="h-4 bg-gray-300 rounded w-16" />
          <div className="h-4 bg-gray-300 rounded w-12" />
        </div>
      </div>
    </div>
  );
}