# 정적 이미지 폴더

이 폴더는 Next.js의 `public/` 디렉토리 내에 있으며, 정적 이미지 파일을 저장합니다.

## 사용 방법

### HTML/JSX에서 사용
```tsx
<img src="/images/logo.png" alt="Logo" />
```

### CSS에서 사용
```css
background-image: url('/images/background.jpg');
```

### Next.js Image 컴포넌트에서 사용
```tsx
import Image from 'next/image'

<Image src="/images/logo.png" alt="Logo" width={200} height={200} />
```

## 경로 규칙
- 파일은 `/images/` 경로로 접근 가능합니다
- 예: `public/images/logo.png` → `/images/logo.png`

