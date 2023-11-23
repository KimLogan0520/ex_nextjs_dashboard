import '@/app/ui/global.css';
import { inter } from "@/app/ui/fonts";

// 최상단에 위치한 root layout
// 여기에 추가한 모든 ui요소는 모든 페이지에 적용된다.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
