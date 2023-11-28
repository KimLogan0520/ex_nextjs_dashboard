import '@/app/ui/global.css';
import { inter } from "@/app/ui/fonts";
import { Metadata } from "next";


/**
 * You can also include a metadata object ( 아래처럼 메타데이터 오브젝트를... ) layout.js 또는 page.js에 추가할 수 있음...
 * 어느 layout.js (여기선 layout.tsx)에 속해있는 metadata라도 그것을 사용하는 모든 페이지에 상속되어진다.
 * 하지만 특정 페이지에만 적용하고 싶은 메타데이타가 있다면 해당 page.tsx에 아래와 같이 추가로 작성하여 사용하면됨 ( 부모로부터 물려받아도 다시 override된다. )
 */
export const metadata: Metadata = {
  title: {
    template: '%s | Acme Dashboard',
    default: 'Acme Dashboard',
  },
  description: 'The official Next.js Course Dashboard, built with App Router.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
}

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
