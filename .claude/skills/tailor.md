---
name: tailor
description: 공고에 맞춰 이력서를 자동 테일러링하는 스킬
user_invocable: true
---

# /tailor — 공고 맞춤 이력서 생성

채용 공고 텍스트를 분석하여 master.yaml에서 관련 항목을 선별하고, 요약문과 불릿을 공고에 맞게 재작성하여 맞춤 이력서 variant를 생성합니다.

## 사용법

```
/tailor
(공고 텍스트를 대화에 붙여넣기)

/tailor cv/jobs/toss-frontend.txt
(파일 경로 전달)
```

## 실행 절차

### 1. 입력 파싱
- 인자가 파일 경로처럼 보이면 (`/`, `.`, `cv/`로 시작) Read 도구로 파일 읽기
- 아니면 인자 전체를 공고 텍스트로 처리
- 인자가 없으면 사용자에게 공고 텍스트를 붙여넣으라고 안내

### 2. 마스터 데이터 로드
- `cv/master.yaml` 읽기 — 모든 경력, 프로젝트, 스킬, 불릿 데이터

### 3. 공고 분석
- 필수 기술 스택 추출
- 요구 경험 및 키워드 식별
- 회사명과 포지션 파악
- 우대 사항 파악

### 4. 항목 선별
- 마스터에서 공고와 관련도 높은 프로젝트/불릿 선택
- 기술 스택 매칭 + 키워드 오버랩 기준
- 관련도 순으로 정렬

### 5. 재작성
- **요약문**: 공고의 핵심 요구사항에 맞춰 강조점 조정
- **하이라이트 불릿**: 공고 키워드를 자연스럽게 반영
- **프로젝트 불릿**: 공고에서 원하는 경험과 매칭되도록 어조 조정
- 섹션 순서를 관련도 기준으로 재배치

### 6. 출력 생성
variant config 파일 생성:

```yaml
# cv/variants/tailored-{company}.yaml
variant: "tailored-{company}"
title: "이력서 ({company})"
subtitle: "{position} 지원용"
summary: default  # 또는 summary_text로 인라인 오버라이드
theme: default    # 회사 브랜드 색상 알면 별도 테마 생성
modes: [resume, career]

# /tailor가 인라인으로 재작성한 요약/불릿
summary_text: "재작성된 요약문..."
highlight_bullets_text:
  - "재작성된 불릿 1"
  - "재작성된 불릿 2"

sections:
  - type: experience
    filter: [all]
  - type: projects
    filter: [tailored-{company}, all]  # 태그 기반 선별
    max: 4
  - type: oss
  - type: sideProjects
    filter: [tailored-{company}, all]
```

선택적으로 테마 파일도 생성:
```yaml
# cv/themes/{company}.yaml (회사 브랜드 색상이 알려진 경우)
```

### 7. 결과 보고
사용자에게 보여줄 내용:
- 선택된 항목 / 제외된 항목
- 재작성된 부분과 이유
- 프리뷰 방법: `pnpm dev` 후 `/cv/resume-tailored-{company}` 접속
- 프로덕션 적용: `pnpm build` 실행

## 제약 조건

1. **날조 금지**: master.yaml에 없는 경력, 기술, 성과를 만들지 않는다
2. **재작성만**: 기존 내용의 강조점과 키워드를 공고에 맞게 조정한다
3. **master 보존**: master.yaml을 절대 수정하지 않는다. 맞춤 요약/불릿은 variant config의 `summary_text`와 `highlight_bullets_text`에 인라인으로 넣는다
4. **투명성**: 무엇을 변경했고 왜 변경했는지 반드시 보여준다

## 프로젝트 구조 참고

```
cv/
  master.yaml          # 단일 진실 원천 (읽기 전용)
  variants/
    general.yaml       # 기본 이력서
    instructor.yaml    # 강사용
    freelancer.yaml    # 프리랜서용
    toss.yaml          # Toss 맞춤
    tailored-*.yaml    # /tailor가 생성하는 파일들
  themes/
    default.yaml       # 기본 테마
    toss.yaml          # Toss 테마
  jobs/                # 공고 텍스트 보관 (선택)
```
