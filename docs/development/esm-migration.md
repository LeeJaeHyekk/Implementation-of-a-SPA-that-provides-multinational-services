# ESM (ECMAScript Modules) 사용 현황

이 프로젝트는 완전히 ESM 문법을 사용하고 있습니다.

## 설정 확인

### 1. package.json
```json
{
  "type": "module"  // ✅ ESM 모드 활성화
}
```

### 2. tsconfig.json
```json
{
  "compilerOptions": {
    "module": "ESNext",           // ✅ ESM 모듈 시스템
    "moduleResolution": "Bundler", // ✅ 최신 번들러 해상도
    "target": "ESNext",            // ✅ 최신 ECMAScript 타겟
    "esModuleInterop": true        // ✅ CommonJS 호환성
  }
}
```

### 3. 설정 파일들
모든 설정 파일이 ESM 문법을 사용합니다:
- ✅ `next.config.js` - ESM (`import`/`export default`)
- ✅ `eslint.config.js` - ESM (`import`/`export default`)
- ✅ `postcss.config.js` - ESM (`import`/`export default`)
- ✅ `tailwind.config.ts` - ESM (`import`/`export default`)

## ESM 문법 사용

### Import 문법
```typescript
// ✅ ESM import
import { functionName } from './module'
import type { TypeName } from './types'
import defaultExport from './default'

// ✅ JSON 모듈 import (최신 표준)
import data from './data.json' with { type: 'json' }
```

### Export 문법
```typescript
// ✅ Named export
export function myFunction() {}
export const myConstant = 'value'
export type MyType = {}

// ✅ Default export
export default function Component() {}
export default config

// ✅ Re-export
export * from './module'
export { named } from './module'
```

### CommonJS 미사용
프로젝트 내에서 다음 CommonJS 문법은 사용하지 않습니다:
- ❌ `require()`
- ❌ `module.exports`
- ❌ `exports.`
- ❌ `__dirname` / `__filename` (대신 `import.meta.url` 사용 가능)

## 최신 ESM 기능

### 1. Import Attributes (with)
TypeScript 5.5+ 및 최신 Node.js에서 지원하는 `with` 구문 사용:
```typescript
// ✅ 최신 표준
import jsonData from './data.json' with { type: 'json' }

// ❌ 구식 (deprecated)
import jsonData from './data.json' assert { type: 'json' }
```

### 2. Top-level await
ESM에서는 최상위 레벨에서 `await` 사용 가능:
```typescript
// ✅ ESM에서 가능
const data = await fetchData()
```

### 3. Dynamic import
동적 import 사용:
```typescript
// ✅ ESM 동적 import
const module = await import('./module.js')
```

## 파일 확장자

TypeScript 프로젝트이므로:
- `.ts` / `.tsx` 파일 사용
- TypeScript 컴파일러가 ESM으로 변환
- 런타임에서는 Next.js가 번들링하여 처리

## 호환성

### Next.js 16
- ✅ 완전한 ESM 지원
- ✅ App Router는 기본적으로 ESM
- ✅ `import.meta.url` 지원

### Node.js
- ✅ Node.js 18+ 권장 (ESM 완전 지원)
- ✅ `package.json`의 `"type": "module"`로 ESM 모드 활성화

## 확인 사항

프로젝트 전체에서 ESM 문법이 올바르게 사용되고 있는지 확인:
- ✅ 모든 import/export가 ESM 문법 사용
- ✅ CommonJS 문법 없음
- ✅ 설정 파일들이 ESM 사용
- ✅ JSON import가 최신 `with` 구문 사용

## 참고 자료

- [MDN: ES Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- [Node.js: ES Modules](https://nodejs.org/api/esm.html)
- [TypeScript: Module Resolution](https://www.typescriptlang.org/docs/handbook/module-resolution.html)

