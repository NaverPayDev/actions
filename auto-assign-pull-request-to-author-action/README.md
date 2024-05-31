# auto-assign-pull-request-to-author-action

![assign](./src/assets/assign.jpeg)

## 설명

- Pull Request 생성 시 생성자를 자동 assign 합니다.

## 사용 방법

- 프로젝트 root의 `.github/workflows` 경로에 아래와 같이 `.yaml` 파일을 작성합니다.

```yaml
# 기호에 맞게 변경해주세요
name: auto assign pull request to author

on:
    # Pull Request가 생성되었을때 실행됩니다.
    pull_request:
        types:
            - opened

jobs:
    auto_assign_pull_request_to_author:
        runs-on: ubuntu-latest
        steps:
            - uses: NaverPayDev/actions/auto-assign-pull-request-to-author-action@main
              with:
                  # github action 실행을 위한 토큰입니다.
                  GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

```

## 실행 결과

![example](./src/assets/example.png)
