import { AppSidebar } from "@/components/appSidebar";

export default function MainAppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <div className="w-full flex">
        <AppSidebar />
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
}
