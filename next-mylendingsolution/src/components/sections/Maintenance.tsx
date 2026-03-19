import AppLogo from "@/components/icons/AppLogo";

export default function Maintenance() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-900" />
      </div>
      <div className="animate-enter">
        <AppLogo className="mx-auto mb-6" width={180} height={54} />
        <div className="w-32 h-32 mx-auto mb-6">
          <img src="/images/icon-maintenance.png" alt="Maintenance" className="w-full h-full object-contain" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-3">Penyelenggaraan</h1>
        <p className="text-gray-400 max-w-xs mx-auto">
          Sistem sedang menjalani penyelenggaraan. Sila kembali sebentar lagi.
        </p>
      </div>
    </div>
  );
}
