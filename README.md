# @NaverPayDev/actions

- 레포지토리 유지보수에 유용한 action을 모아놓은 레포입니다.
- 해당 레포는 모노레포 구조로 여러 액션을 포함하며, 필요한 액션만 선택하여 사용하실 수 있습니다.
- 사용법은 하단 액션 목록의 각 액션별 리드미를 참고해주세요.

## 관리 중인 액션 목록

### [Issues](./issue)

- [request-issue-attribute-action](./issue/request-issue-attribute-action/README.md)
  - issue 생성 시 없는 내용에 대해 작성자에게 작성 요청 comment 를 생성합니다.

### [Pull Requests](./pr)

- [do-not-merge-action](./pr/do-not-merge-action/README.md)
  - 특정 라벨이 부착된 Pull Request의 병합을 막습니다.
- [require-approval-comment-action](./pr/require-approval-comment-action/README.md)
  - comment 없는 단순 approve를 반려합니다.
- [auto-assign-pull-request-to-author-action](./pr/auto-assign-pull-request-to-author-action/README.md)
  - pull request에 생성자를 자동으로 assign 합니다.

### [discussions](./discussion)

- [create-discussion](./discussion/create-discussion/README.md)
  - 미리 작성된 template을 기반으로 discussion을 생성합니다.

### [repos](./repo)

- [delete-stale-branch](./repo/delete-stale-branch/README.md)
  - 최근 업데이트가 없는 방치된 브랜치를 삭제합니다.
