"use client";

import { useState } from "react";

// Artık her görev bir metin DEĞİL, iki bilgisi olan bir nesne:
// metni (text) ve tamamlandı mı (done).
type Task = { text: string; done: boolean };

// COD MW2 "deathscreen" sözleri — 5 görev tamamlanınca biri gösterilir.
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

  // Yeni görev ekle (tamamlanmamış olarak başlar).
  function addTask() {
    if (text.trim() === "") return;
    setTasks([...tasks, { text: text.trim(), done: false }]);
    setText("");
  }

  // Yeşil tike basınca: görevin "tamamlandı" durumunu tersine çevir.
  function toggleTask(index: number) {
    setTasks(
      tasks.map((task, i) =>
        i === index ? { ...task, done: !task.done } : task
      )
    );
  }

  // Görevi sil.
  function deleteTask(index: number) {
    setTasks(tasks.filter((_, i) => i !== index));
  }

  // Kaç görev tamamlanmamış (kalan)?
  const remaining = tasks.filter((t) => !t.done).length;
  // Kaç görev tamamlandı? (5'e ulaşınca motivasyon sözü çıkar)
  const completedCount = tasks.filter((t) => t.done).length;
  const quote = MW2_QUOTES[(completedCount - 5) % MW2_QUOTES.length];

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-500 to-blue-500 flex items-start justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-7 mt-16">
        <h1 className="text-2xl font-bold text-gray-800">📝 Bober To-Do</h1>
        <p className="text-sm text-gray-500 mt-1 mb-6">
          Yapılacaklarını ekle ve takip et.
        </p>

        {/* Görev ekleme alanı */}
        <div className="flex gap-2 mb-5">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            placeholder="Yeni görev yaz..."
            className="flex-1 border-2 border-gray-200 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-400 outline-none focus:border-indigo-500"
          />
          <button
            onClick={addTask}
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-4 rounded-lg"
          >
            Ekle
          </button>
        </div>

        {/* Görev listesi */}
        <ul className="flex flex-col gap-2">
          {tasks.map((task, index) => (
            <li
              key={index}
              className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2"
            >
              {/* Yeşil tamamlama tiki */}
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

              {/* Görev metni */}
              <span
                className={`flex-1 ${
                  task.done ? "line-through text-gray-400" : "text-gray-800"
                }`}
              >
                {task.text}
              </span>

              {/* Silme butonu */}
              <button
                onClick={() => deleteTask(index)}
                className="text-gray-400 hover:text-red-500 font-bold"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>

        {/* Liste boşsa mesaj */}
        {tasks.length === 0 && (
          <p className="text-center text-gray-400 py-6 text-sm">
            Henüz görev yok. İlkini ekle! 🚀
          </p>
        )}

        {/* 5 görev tamamlanınca MW2 motivasyon sözü */}
        {completedCount >= 5 && (
          <div className="mt-5 bg-gray-900 text-gray-100 rounded-lg px-4 py-3 text-center">
            <p className="text-xs tracking-widest text-green-400 mb-1">
              ⭐ {completedCount} GÖREV TAMAMLANDI
            </p>
            <p className="text-sm italic">&ldquo;{quote}&rdquo;</p>
          </div>
        )}

        {/* Sayaç (sadece görev varsa göster) */}
        {tasks.length > 0 && (
          <div className="mt-5 pt-4 border-t border-gray-100 text-sm text-gray-500 text-center">
            {remaining} görev kaldı / {tasks.length} toplam
          </div>
        )}
      </div>
    </main>
  );
}
