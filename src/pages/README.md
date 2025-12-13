# Pages Directory (Legacy)

⚠️ **이 디렉토리는 레거시 코드입니다.**

현재 프로젝트는 Next.js App Router를 사용하며, 라우팅은 `src/app/` 디렉토리에서 처리됩니다.

이 디렉토리의 파일들은 Pages Router에서 App Router로 마이그레이션하기 전의 레거시 코드입니다.
현재는 사용되지 않지만, 다른 워크트리에서 참조할 수 있으므로 유지됩니다.

## 현재 라우팅 구조

- `/search` → `src/app/search/page.tsx`
- `/favorites` → `src/app/favorites/page.tsx`
- `/trademark/[id]` → `src/app/trademark/[id]/page.tsx`

## 마이그레이션 완료

모든 페이지가 App Router로 마이그레이션되었습니다.

