import React, { useState } from "react";
import Navbar from "../components/layout/Navbar";

function QueriesPage() {
  const [input, setInput] = useState("");
  const [questions, setQuestions] = useState([]);

  function addQuestion() {
    if (!input) return;

    setQuestions([...questions, input]);

    setInput("");
  }

  return (
    <>
      <Navbar />
      <div className="container py-5">
        <h1 className="mb-4">Queries</h1>

        <div className="d-flex gap-2">
          <input
            className="form-control"
            placeholder="Ask your question"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <button className="btn btn-success" onClick={addQuestion}>
            Submit
          </button>
        </div>

        <div className="mt-4">
          {questions.map((item, index) => (
            <div key={index} className="card p-3 mb-2">
              {item}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default QueriesPage;
