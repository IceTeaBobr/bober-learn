"use client";

import { useState } from "react";

// Each task: text, done (completed?) and date.
type Task = { text: string; done: boolean; date: string };

// COD MW2 "deathscreen" quotes — one shows after 5 tasks are completed.
const MW2_QUOTES = [
  "The only easy day was yesterday. — U.S. Navy SEALs",
  "If you find yourself in a fair fight, you didn't plan your mission properly. — David Hackworth",
  "Hesitation is the seed of disaster.",
  "There are no extraordinary men... just extraordinary circumstances that ordinary men are forced to deal with. — William Halsey",
  "It is well that war is so terrible, otherwise we should grow too fond of it. — Robert E. Lee",
];

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [text, setText] = useState("");
  const [date, setDate] = useState(""); // selected date (optional)
  const [showBeaver, setShowBeaver] = useState(false); // is the dancing beaver visible

  // Add a new task (starts as not completed).
  function addTask() {
    if (text.trim() === "") return;
    setTasks([...tasks, { text: text.trim(), done: false, date: date }]);
    setText("");
    setDate("");
  }

  // Toggle a task's completed state when the green tick is clicked.
  function toggleTask(index: number) {
    const wasDone = tasks[index].done;
    setTasks(
      tasks.map((task, i) =>
        i === index ? { ...task, done: !task.done } : task
      )
    );
    // Only play the beaver when a task is NEWLY completed (not when un-checking).
    if (!wasDone) {
      setShowBeaver(true);
      setTimeout(() => setShowBeaver(false), 2500);
    }
  }

  // Delete a task.
  function deleteTask(index: number) {
    setTasks(tasks.filter((_, i) => i !== index));
  }

  // Counters.
  const remaining = tasks.filter((t) => !t.done).length;
  const completedCount = tasks.filter((t) => t.done).length;
  const quote = MW2_QUOTES[(completedCount - 5) % MW2_QUOTES.length];

  return (
    <main className="min-h-screen bg-[#39ff14] flex items-start justify-center p-6">
      {/* Minecraft-style warning text in the corner */}
      <div className="font-minecraft fixed top-4 right-4 z-50 text-[10px] leading-relaxed text-red-700 text-right max-w-[170px]">
        WE STEAL YOUR DATA!
      </div>

      {/* Gothic frame + ornaments around the edges */}
      <div className="pointer-events-none fixed inset-3 z-40 border-4 border-double border-black/60 rounded-lg" />
      <div className="pointer-events-none fixed inset-0 z-40 select-none text-black/70">
        <span className="absolute top-2 left-3 text-5xl leading-none">⚜</span>
        <span className="absolute top-2 right-3 text-5xl leading-none">⚜</span>
        <span className="absolute bottom-2 right-3 text-5xl leading-none">⚜</span>
        <div className="absolute top-1 left-1/2 -translate-x-1/2 text-2xl tracking-[0.6em] text-black/50">
          ✠ ⚜ ✠ ⚜ ✠
        </div>
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-2xl tracking-[0.6em] text-black/50">
          ✠ ⚜ ✠ ⚜ ✠
        </div>
      </div>

      {/* DARK TRIAD warning sign — bottom-left corner (meme style) */}
      <div className="pointer-events-none fixed bottom-4 left-4 z-50">
        <svg width="92" height="82" viewBox="0 0 100 90">
          <polygon
            points="50,6 96,86 4,86"
            fill="#FFD400"
            stroke="black"
            strokeWidth="7"
            strokeLinejoin="round"
          />
          <text
            x="50"
            y="56"
            textAnchor="middle"
            fontSize="13"
            fontWeight="bold"
            fill="black"
            fontFamily="Arial, sans-serif"
          >
            DARK
          </text>
          <text
            x="50"
            y="72"
            textAnchor="middle"
            fontSize="13"
            fontWeight="bold"
            fill="black"
            fontFamily="Arial, sans-serif"
          >
            TRIAD
          </text>
        </svg>
      </div>

      {/* Dancing beaver — appears for 2.5s when a task is completed */}
      {showBeaver && (
        <>
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div className="text-8xl animate-beaver">🦫</div>
          </div>
          <p className="fixed bottom-6 right-6 z-50 text-2xl font-extrabold text-black pointer-events-none">
            GOOD JOB, IDIOT 🎉
          </p>
        </>
      )}

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-7 mt-16">
        <h1 className="text-2xl font-bold text-gray-800">📝 Bober To-Do</h1>
        <p className="text-sm text-gray-500 mt-1 mb-6">
          Add and track your tasks.
        </p>

        {/* Add task area */}
        <div className="mb-5">
          <div className="flex gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTask()}
              placeholder="Write a new task..."
              className="flex-1 border-2 border-gray-200 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-400 outline-none focus:border-indigo-500"
            />
            <button
              onClick={addTask}
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-4 rounded-lg"
            >
              Add
            </button>
          </div>
          {/* Date picker (optional) */}
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-2 border-2 border-gray-200 rounded-lg px-3 py-2 text-gray-900 text-sm outline-none focus:border-indigo-500"
          />
        </div>

        {/* Task list */}
        <ul className="flex flex-col gap-2">
          {tasks.map((task, index) => (
            <li
              key={index}
              className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2"
            >
              {/* Green completion tick */}
              <button
                onClick={() => toggleTask(index)}
                className={`w-6 h-6 flex-shrink-0 rounded-full border-2 flex items-center justify-center text-sm ${
                  task.done
                    ? "bg-green-500 border-green-500 text-white"
                    : "border-gray-300 text-transparent hover:border-green-400"
                }`}
              >
                ✓
              </button>

              {/* Task text + date */}
              <div className="flex-1 min-w-0">
                <span
                  className={
                    task.done ? "line-through text-gray-400" : "text-gray-800"
                  }
                >
                  {task.text}
                </span>
                {task.date && (
                  <span className="block text-xs text-gray-400 mt-0.5">
                    📅 {task.date}
                  </span>
                )}
              </div>

              {/* Delete button */}
              <button
                onClick={() => deleteTask(index)}
                className="text-gray-400 hover:text-red-500 font-bold"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>

        {/* Empty state */}
        {tasks.length === 0 && (
          <p className="text-center text-gray-400 py-6 text-sm">
            No tasks yet. Add your first one! 🚀
          </p>
        )}

        {/* MW2 motivational quote after 5 completed tasks */}
        {completedCount >= 5 && (
          <div className="mt-5 bg-gray-900 text-gray-100 rounded-lg px-4 py-3 text-center">
            <p className="text-xs tracking-widest text-green-400 mb-1">
              ⭐ {completedCount} TASKS COMPLETED
            </p>
            <p className="text-sm italic">&ldquo;{quote}&rdquo;</p>
          </div>
        )}

        {/* Counter (only when there are tasks) */}
        {tasks.length > 0 && (
          <div className="mt-5 pt-4 border-t border-gray-100 text-sm text-gray-500 text-center">
            {remaining} left / {tasks.length} total
          </div>
        )}
      </div>
    </main>
  );
}
