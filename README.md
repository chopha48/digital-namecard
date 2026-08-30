# 디지털 명함 (Digital Namecard)

김민수 · 마케팅 매니저의 1인용 디지털 명함 페이지입니다.
빌드 단계 없는 순수 정적 사이트(HTML/CSS/JS)라 그대로 호스팅하면 됩니다.

## 구성

| 파일 | 역할 |
| --- | --- |
| `index.html` | 명함 마크업. 첫 페인트 전에 테마를 정하는 인라인 스크립트 포함 |
| `style.css` | 라이트/다크 테마 토큰, 카드 레이아웃, 애니메이션 |
| `script.js` | 테마 토글, `theme-color` 메타 갱신 등 상호작용 |

## 로컬에서 보기

```bash
npx serve .
# 또는
python -m http.server 8000
```

## 배포

Vercel에 정적 사이트로 배포합니다. 프레임워크 프리셋은 **Other**,
빌드 명령 없음, 출력 디렉터리는 저장소 루트입니다.
`main` 브랜치에 푸시하면 자동으로 재배포됩니다.

## 내용 수정하기

- 이름·직함·연락처: `index.html` 본문 텍스트를 직접 수정
- 프로필 사진: `index.html`의 아바타 SVG를 지우고 `<img src="photo.jpg">` 주석 해제
- 색상: `style.css` 상단의 CSS 변수(`:root`, `[data-theme="dark"]`) 수정
