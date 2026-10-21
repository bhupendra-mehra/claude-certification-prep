import json
from pathlib import Path

import streamlit as st


@st.cache_data
def load_quiz():
    quiz_path = Path(__file__).resolve().parent / "quizzes" / "lessons-01-05.json"
    with open(quiz_path, "r", encoding="utf-8") as f:
        return json.load(f)


def reset_quiz():
    st.session_state.question_index = 0
    st.session_state.answers = {}
    st.session_state.score = 0
    st.session_state.show_result = False


def main():
    quiz = load_quiz()
    questions = quiz["questions"]

    st.set_page_config(page_title=f"{quiz['course']} Quiz", page_icon="✅", layout="wide")
    st.title(f"{quiz['course']} - {quiz['title']}")
    st.caption(f"Course URL: {quiz['course_url']}")

    if "question_index" not in st.session_state:
        reset_quiz()

    # Sidebar for navigation and stats
    with st.sidebar:
        st.subheader("Quiz progress")
        total = len(questions)
        answered = len(st.session_state.answers)
        st.metric("Answered", f"{answered}/{total}")

        if st.button("Reset quiz"):
            reset_quiz()

    current_index = st.session_state.question_index

    if current_index >= len(questions):
        score = 0
        for q in questions:
            if st.session_state.answers.get(q["id"]) == q["answer"]:
                score += 1

        st.success(f"Quiz complete! Final score: {score}/{len(questions)}")

        st.subheader("Review")
        for q in questions:
            selected = st.session_state.answers.get(q["id"])
            is_correct = selected == q["answer"]
            st.markdown(f"### Q{q['id']} ({q['lesson']})")
            st.write(q["prompt"])
            for option in q["options"]:
                option_label = option[0]  # e.g. 'A'
                if option_label == q["answer"]:
                    option_text = f"**{option}**"
                else:
                    option_text = option
                st.write(f"- {option_text}")

            if is_correct:
                st.write("✅ Correct")
            else:
                st.write(f"❌ Your answer: {selected or 'No answer'}")
                st.write(f"Correct answer: {q['answer']}")
            st.write(f"Why: {q['explanation']}")
            st.markdown("---")

        return

    question = questions[current_index]
    st.subheader(f"Question {question['id']} of {len(questions)}")
    st.write(question["prompt"])

    options = question["options"]
    answer_map = {"A": 0, "B": 1, "C": 2, "D": 3}

    # Build a radio list using the actual option text.
    selected_option = st.radio(
        "Choose one answer:",
        options,
        index=None,
        key=f"q_{question['id']}",
    )

    if selected_option:
        selected_letter = selected_option[0] if selected_option else None
    else:
        selected_letter = None

    if st.button("Submit answer"):
        if selected_option is None:
            st.warning("Please choose an answer before submitting.")
        else:
            st.session_state.answers[question["id"]] = selected_letter
            correct_answer = question["answer"]
            is_correct = selected_letter == correct_answer

            if is_correct:
                st.success("Correct ✅")
            else:
                st.error(f"Incorrect ❌ Correct answer: {correct_answer}")

            st.info(f"Explanation: {question['explanation']}")

            st.session_state.question_index += 1
            st.rerun()


if __name__ == "__main__":
    main()
