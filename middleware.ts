import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

export default NextAuth(authConfig).auth;

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};

/**
 * Middleware를 사용하는 장점은 보호된(route가 보호되어야 하는) 경로가 Middleware에서 인증을 확인하기 전까지 렌더링조차 시작되지 않기 때문에, 애플리케이션의 보안과 성능을 모두 향상시킬 수 있다는 것입니다.
 */