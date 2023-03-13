import { useState, useEffect, useRef } from "react";
import axios from "axios";

import './App.css'
import FlashcardList from "./FlashcardList";

function App() {
  const [flashcards, setFlashcards] = useState([]);
  const [categories, setCategories] = useState([]);

  const amountEl = useRef();
  const categoryEl = useRef();

  useEffect(() => {
    axios
      .get('https://opentdb.com/api_category.php')
      .then(res => setCategories(res.data.trivia_categories))
  }, [])

  useEffect(() => {
    axios
      .get(`https://opentdb.com/api.php?amount=15`)
      .then(res => {
        setFlashcards(res.data.results.map((questionItem, index) => {
          const answer = decodeString(questionItem.correct_answer);
          const options = [...questionItem.incorrect_answers, answer]
          return {
            id: `${index}-${Date.now()}`,
            question: decodeString(questionItem.question),
            answer: answer,
            options: (options.sort(() => Math.random() - 0.5)).map(option => decodeString(option))
          }
        }))
      })
  }, [])

  function decodeString(str) {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = str;
    return textarea.value;
  }

  function handleSubmit(e) {
    e.preventDefault();
    axios
      .get('https://opentdb.com/api.php', {
        params: {
          amount: amountEl.current.value,
          category: categoryEl.current.value,
        }
      })
      .then(res => {
        setFlashcards(res.data.results.map((questionItem, index) => {
          const answer = decodeString(questionItem.correct_answer);
          const options = [...questionItem.incorrect_answers, answer]
          return {
            id: `${index}-${Date.now()}`,
            question: decodeString(questionItem.question),
            answer: answer,
            options: (options.sort(() => Math.random() - 0.5)).map(option => decodeString(option))
          }
        }))
      })
  }

  return (
    <>
      <form className="header" onSubmit={handleSubmit}>
        {/* Categories */}
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select id="category" ref={categoryEl}>
            <option value="">Any Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>
        {/* Number of Questions */}
        <div className="form-group">
          <label htmlFor="amount">Number of Questions</label>
          <input type="number" id="amount" min="1" step="1" max="50" defaultValue={15} ref={amountEl} />
        </div>
        {/* Button */}
        <div className="form-group">
          <button type="submit" className="btn">Generate</button>
        </div>
      </form>
      <FlashcardList flashcards={flashcards} />
    </>
  );
}


export default App;
