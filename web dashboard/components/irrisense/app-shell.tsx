import type { ReactNode } from "react"
import { Sidebar } from "./sidebar"
import { TopBar } from "./top-bar"

export function AppShell({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#f4f6f9]">
      <Sidebar />
      <div className="lg:pl-[220px]">
        <TopBar title={title} />
        <main className="mx-auto max-w-[1600px] px-4 py-6 md:px-6 md:py-8">{children}</main>
      </div>
    </div>
  )
}
