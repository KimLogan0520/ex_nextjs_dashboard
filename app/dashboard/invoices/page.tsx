import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/invoices/table';
import { CreateInvoice } from '@/app/ui/invoices/buttons';
import { lusitana } from '@/app/ui/fonts';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import {fetchInvoicesPages} from "@/app/lib/data";

/**
 * useSearchParams: 현재 URL의 매개변수에 접근할 수 있게 해줍니다. 예를 들어, URL '/dashboard/invoices?page=1&query=pending'의 경우 useSearchParams를 통해 {page: '1', query: 'pending'}과 같은 검색 매개변수를 얻을 수 있습니다.
 * usePathname: 현재 URL의 경로명을 읽을 수 있습니다. 예를 들어, 라우트 '/dashboard/invoices'의 경우 usePathname은 '/dashboard/invoices'를 반환합니다.
 * useRouter: 클라이언트 컴포넌트 내에서 라우트 간 탐색을 프로그래밍적으로 가능하게 합니다. 여러 가지 사용 가능한 메서드가 있습니다.
 */

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  }
}) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchInvoicesPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Invoices</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search />
        <CreateInvoice />
      </div>
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}