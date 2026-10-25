export default function Loading() {
  return (
    <div className="container-page animate-pulse py-10">
      <div className="mb-8 h-8 w-56 rounded bg-gray-200" />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, index) => (
          <div key={index} className="surface overflow-hidden">
            <div className="h-40 bg-gray-200" />
            <div className="space-y-3 p-4">
              <div className="h-4 w-2/3 rounded bg-gray-200" />
              <div className="h-4 w-1/2 rounded bg-gray-200" />
              <div className="h-8 rounded bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}