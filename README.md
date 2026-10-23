# Claude Certification Prep

Practice quizzes (MCQs) for the Claude certification exam, organized course by course.
Quizzes are independent practice materials aligned to topics in [Claude Academy](https://academy.claude.com); they are not official exam questions.

## Structure

```
courses/
  claude-101/
    README.md              # lesson checklist + score log
    quizzes/
      lessons-01-05.json   # source of truth
      lessons-01-05.md     # focused review with answer key
      comprehensive-practice.json # 100 scenario-based MCQs for Claude 101
      comprehensive-practice.md   # readable questions and explanations
  <next-course>/...
templates/quiz-template.json
scripts/render_quiz.py     # JSON -> Markdown
```

## Adding a new quiz

1. Copy `templates/quiz-template.json` into `courses/<course>/quizzes/` and name it by lessons, e.g. `lessons-06-10.json`.
2. Fill in the questions.
3. Run `python scripts/render_quiz.py --all` to generate the `.md` files.
4. Update the course `README.md` checklist and score log.
5. Commit: `git add . && git commit -m "Add Claude 101 lessons 6-10 quiz"`.

## Planned courses

- Claude 101 (completed; 100-question scenario-based review set available)
- Claude Code 101
- Claude Platform 101
