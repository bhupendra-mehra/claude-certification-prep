#!/usr/bin/env python3
"""Render a quiz JSON file into a readable Markdown file next to it.

Usage:  python scripts/render_quiz.py courses/claude-101/quizzes/lessons-01-05.json
        python scripts/render_quiz.py --all
"""
import json, sys, pathlib

def render(path: pathlib.Path):
    d = json.loads(path.read_text(encoding="utf-8"))
    out = [f"# {d['course']} - {d['title']}", "", f"Course: {d['course_url']}", "", "Lessons covered:"]
    out += [f"- {l}" for l in d["lessons"]]
    out += ["", "---", ""]
    for q in d["questions"]:
        out.append(f"### Q{q['id']}. [Lesson {q['lesson']}] {q['prompt']}")
        out.append("")
        for i, opt in enumerate(q["options"]):
            out.append(f"- {chr(65+i)}. {opt}")
        out.append("")
    out += ["---", "", "## Answer key", "", "| Q | Lesson | Answer | Why |", "|---|---|---|---|"]
    for q in d["questions"]:
        out.append(f"| {q['id']} | {q['lesson']} | {q['answer']} | {q['explanation']} |")
    md = path.with_suffix(".md")
    md.write_text("\n".join(out) + "\n", encoding="utf-8")
    print("wrote", md)

if __name__ == "__main__":
    args = sys.argv[1:]
    if args == ["--all"]:
        for p in sorted(pathlib.Path("courses").rglob("quizzes/*.json")):
            render(p)
    elif args:
        render(pathlib.Path(args[0]))
    else:
        print(__doc__)
