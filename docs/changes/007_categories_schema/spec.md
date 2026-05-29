# 스펙

## 목표

`prototype/schema_2.sql` 반영: `categories` 테이블로 기본·커스텀 카테고리를 관리하고, 레시피는 `category_id` FK로 연결한다. UI에서 「기타」 선택 후 직접 입력한 이름이 커스텀 카테고리로 저장된다.

## 시나리오

1. 베이킹에서 카테고리 「머핀」 선택 → 기본 `categories` 행 FK
2. 「기타」 + 「마카롱」 입력 → `categories`(user_id, name=마카롱) 생성 후 FK
3. 수정 시 동일 이름이면 기존 커스텀 행 재사용

## 범위 밖

- 재료 창고(pantry) 카테고리 정규화 (여전히 VARCHAR)
