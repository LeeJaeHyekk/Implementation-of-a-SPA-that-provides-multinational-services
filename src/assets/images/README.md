# Assets 이미지 폴더

이 폴더는 소스 코드에서 직접 import해서 사용하는 이미지 파일을 저장합니다.

## 사용 방법

### TypeScript/React에서 import
```tsx
import logo from '@/assets/images/logo.png'
import icon from '@/assets/images/icon.svg'

<img src={logo} alt="Logo" />
```

### Next.js Image 컴포넌트에서 사용
```tsx
import Image from 'next/image'
import logo from '@/assets/images/logo.png'

<Image src={logo} alt="Logo" width={200} height={200} />
```

## 경로 규칙
- `@/assets/images/` 경로로 import
- TypeScript 타입 지원을 위해 `next-env.d.ts`에 타입 정의가 필요할 수 있습니다

## 권장 사항
- 작은 아이콘, 로고 등 자주 사용하는 이미지
- 빌드 시 최적화가 필요한 이미지
- 동적으로 변경되는 이미지

