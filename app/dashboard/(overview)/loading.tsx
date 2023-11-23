import DashBoardSkeleton from '@/app/ui/skeletons';

// 이 컴포넌트는 route groups을 사용했기 때문에 대시보드 개요 페이지에만 적용됨.
//
export default function Loading() {
    return <DashBoardSkeleton />;
}