import { DeliveryDashboard } from "@/components/delivery-dashboard"

export default function DashboardPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-amber-950 to-slate-900 p-4">
      <div className="w-full max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-amber-400 mb-6">Pharoah LORM Dashboard</h1>
        <DeliveryDashboard />
      </div>
    </main>
  )
}
