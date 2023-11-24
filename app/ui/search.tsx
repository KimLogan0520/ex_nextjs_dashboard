'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export default function Search() {
  const searchParams = useSearchParams();
  const pathname = usePathname(); // console.log('==> pathname :', pathname); /dashboard/invoices
  const { replace } = useRouter();

  // function handleSearch(term: string) {
  //   // console.log('*==========> input창에 입력한 검색어 :', term);
  //   const params = new URLSearchParams(searchParams);
  //
  //   if ( term ) {
  //     params.set('query', term);
  //   } else {
  //     params.delete('query');
  //   }
  //   // console.log('*==========> params by URLSearchParams:', params.get('query'));
  //   /**
  //    * URLSearchParams는 URL 쿼리 매개변수를 조작하기 위한 유틸리티 메서드를 제공하는 Web API입니다. 복잡한 문자열 리터럴을 생성하는 대신에 이를 사용하여 ?page=1&query=a와 같은 파라미터 문자열을 얻을 수 있습니다.
  //    */
  //
  //   /**
  //    * params.toString()에 의해서, 입력바에 유저가 입력한 검색값이 URL에 친화적인 형식으로 translate된다.
  //    * 또한 유저가 검색어를 입력했을때, 페이지의 리로드 없이 Next.js의 클라이언트사이드 네비게이션 덕에 URL이 업데이트 된다.
  //    */
  //   replace(`${pathname}?${params.toString()}`);
  // }

  const handleSearch = useDebouncedCallback((term: string) => {
    // console.log('*=======> Searching :', term);

    const params = new URLSearchParams(searchParams);
    params.set('page', '1');

    if ( term ) {
      params.set('query', term);
    } else {
      params.delete('query');
    }

    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        // placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value)
        }}
        defaultValue={searchParams.get('query')?.toString()}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
