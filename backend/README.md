# Yakssok Backend (약쏙 백엔드)

## ✅ 코드 품질 관리

본 프로젝트는 `pre-commit`을 사용하여 Git에 코드가 커밋되기 전에 자동으로 코드 품질(포맷팅, 린팅, 타입 체크)을 검사합니다.

로컬 환경 설정 시 `pip install pre-commit`, `pre-commit install`을 한 번만 실행해주면, 이후 `git commit`을 할 때마다 자동으로 검사가 수행됩니다.(실행 위치 : YAKSSOK\backend>)

    ```bash
    pip install pre-commit
    # 코드 품질 도구 설정 (최초 1회)
    pre-commit install
    ```
