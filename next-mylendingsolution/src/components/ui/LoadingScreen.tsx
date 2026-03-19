export default function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-body">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-400">Loading...</p>
      </div>
    </div>
  );
}
