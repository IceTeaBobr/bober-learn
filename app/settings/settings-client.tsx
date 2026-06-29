"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const TIMEZONES = [
  "Europe/Istanbul",
  "Europe/London",
  "Europe/Berlin",
  "America/New_York",
  "America/Los_Angeles",
  "Asia/Tokyo",
  "Asia/Dubai",
  "Australia/Sydney",
];

export default function SettingsClient({
  userName,
  userEmail,
}: {
  userName: string;
  userEmail: string;
}) {
  const [dark, setDark] = useState(false);
  const [tz, setTz] = useState("Europe/Istanbul");
  const [clock, setClock] = useState("");
  const [showLayers, setShowLayers] = useState(false); // reveal lasagna on click
  const [showClassified, setShowClassified] = useState(false); // reveal recipe on click

  // sound icon that runs away from the cursor
  const [soundPos, setSoundPos] = useState({ x: 50, y: 30 });
  const soundBoxRef = useRef<HTMLDivElement>(null);

  // load saved preferences
  useEffect(() => {
    const savedDark = localStorage.getItem("bober-dark") === "1";
    const savedTz = localStorage.getItem("bober-tz");
    setDark(savedDark);
    if (savedTz) setTz(savedTz);
  }, []);

  // persist + apply dark mode
  useEffect(() => {
    localStorage.setItem("bober-dark", dark ? "1" : "0");
  }, [dark]);

  useEffect(() => {
    localStorage.setItem("bober-tz", tz);
  }, [tz]);

  // live clock in the selected timezone
  useEffect(() => {
    function tick() {
      try {
        setClock(
          new Intl.DateTimeFormat("en-GB", {
            timeZone: tz,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }).format(new Date())
        );
      } catch {
        setClock("--:--:--");
      }
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [tz]);

  // sound icon dodges the cursor by jumping to a random spot in its box
  function dodge() {
    const box = soundBoxRef.current;
    if (!box) return;
    const w = box.clientWidth - 48;
    const h = box.clientHeight - 48;
    setSoundPos({
      x: Math.max(0, Math.random() * w),
      y: Math.max(0, Math.random() * h),
    });
  }

  const shell = dark ? "bg-gray-900 text-gray-100" : "bg-white text-gray-800";
  const card = dark
    ? "bg-gray-800 border-gray-700"
    : "bg-gray-50 border-gray-100";
  const sub = dark ? "text-gray-400" : "text-gray-500";

  return (
    <main className="min-h-screen bg-transparent flex items-start justify-center p-6">
      <div className={`w-full max-w-md rounded-2xl shadow-xl p-7 mt-12 ${shell}`}>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">⚙️ Settings</h1>
          <Link href="/" className="text-sm text-indigo-400 hover:underline">
            ← Back
          </Link>
        </div>

        {/* 1) Gece modu */}
        <section className={`border rounded-xl p-4 mb-4 ${card}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">🌙 Gece Modu</p>
              <p className={`text-xs ${sub}`}>Karanlık temayı aç/kapat</p>
            </div>
            <button
              onClick={() => setDark((d) => !d)}
              className={`w-12 h-7 rounded-full transition relative ${
                dark ? "bg-indigo-500" : "bg-gray-300"
              }`}
              aria-label="dark mode"
            >
              <span
                className={`absolute top-0.5 w-6 h-6 bg-white rounded-full transition-all ${
                  dark ? "left-[22px]" : "left-0.5"
                }`}
              />
            </button>
          </div>
        </section>

        {/* 2) Time zone */}
        <section className={`border rounded-xl p-4 mb-4 ${card}`}>
          <p className="font-semibold mb-1">🕓 Zaman Dilimi</p>
          <select
            value={tz}
            onChange={(e) => setTz(e.target.value)}
            className={`w-full border-2 rounded-lg px-3 py-2 mt-1 outline-none ${
              dark
                ? "bg-gray-700 border-gray-600 text-gray-100"
                : "bg-white border-gray-200 text-gray-900"
            }`}
          >
            {TIMEZONES.map((z) => (
              <option key={z} value={z}>
                {z.replace("_", " ")}
              </option>
            ))}
          </select>
          <p className={`text-sm mt-2 ${sub}`}>
            Şu anki saat: <span className="font-mono">{clock}</span>
          </p>
        </section>

        {/* 3) Kişisel bilgiler */}
        <section className={`border rounded-xl p-4 mb-4 ${card}`}>
          <p className="font-semibold mb-2">👤 Kişisel Bilgiler</p>
          <div className={`text-sm space-y-1 ${sub}`}>
            <p>
              İsim: <span className="font-medium">{userName || "—"}</span>
            </p>
            <p>
              Email: <span className="font-medium">{userEmail}</span>
            </p>
          </div>
        </section>

        {/* 4) Layers of Security — lazanya sadece butona basinca acilir */}
        <section className={`border rounded-xl p-4 mb-4 ${card}`}>
          <button
            onClick={() => setShowLayers((s) => !s)}
            className="w-full flex items-center justify-between font-semibold"
          >
            <span>🔒 Layers of Security</span>
            <span className={sub}>{showLayers ? "▲" : "▼"}</span>
          </button>
          {showLayers && (
            <div className="mt-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/lasagna.jpg"
                alt="A slice of lasagna — layers of security"
                className="mx-auto rounded-lg max-h-64"
              />
              <p className={`text-[10px] text-center mt-2 ${sub}`}>
                Photo:{" "}
                <a
                  href="https://commons.wikimedia.org/wiki/File:Lasagna_2022.jpg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Derk29
                </a>{" "}
                / Wikimedia Commons, CC BY-SA 4.0
              </p>
            </div>
          )}
        </section>

        {/* 5) Kaçan ses ikonu */}
        <section className={`border rounded-xl p-4 mb-4 ${card}`}>
          <p className="font-semibold mb-1">🔊 Ses</p>
          <p className={`text-xs mb-2 ${sub}`}>
            Sesi açmayı dene... (ikon imleçten kaçar)
          </p>
          <div
            ref={soundBoxRef}
            className={`relative h-28 rounded-lg ${
              dark ? "bg-gray-700" : "bg-gray-100"
            }`}
          >
            <button
              onMouseEnter={dodge}
              onClick={dodge}
              style={{ left: soundPos.x, top: soundPos.y }}
              className="absolute w-12 h-12 rounded-full bg-indigo-500 text-white text-xl flex items-center justify-center shadow-lg transition-all duration-200"
              aria-label="sound"
            >
              🔊
            </button>
          </div>
        </section>

        {/* Classified — gizli lazanya tarifi (orijinal) */}
        <section className="border-2 border-red-700 rounded-xl p-4 mb-4 bg-stone-900 text-stone-100">
          <button
            onClick={() => setShowClassified((s) => !s)}
            className="w-full flex items-center justify-between font-bold tracking-widest text-red-400"
          >
            <span>🕵️ CLASSIFIED</span>
            <span className="text-stone-400">{showClassified ? "▲" : "▼"}</span>
          </button>
          {showClassified && (
            <div className="mt-3 font-mono text-[12px] leading-relaxed text-stone-200">
              <p className="text-red-400 border border-red-700 inline-block px-2 py-0.5 mb-3 -rotate-2">
                ⛔ TOP SECRET — EYES ONLY
              </p>
              <h3 className="font-bold text-amber-300 mb-1">
                Homemade Sicilian Lasagna (Lasagne alla Siciliana)
              </h3>
              <p className="text-stone-400 mb-3">Serves 6–8 · ~2 hours</p>

              <p className="font-bold text-amber-300">RAGÙ</p>
              <ul className="list-disc list-inside mb-2">
                <li>2 tbsp olive oil</li>
                <li>1 onion, 1 carrot, 1 celery stalk — finely diced</li>
                <li>2 garlic cloves, minced</li>
                <li>400 g ground beef + 200 g Italian sausage (casing removed)</li>
                <li>100 ml dry red wine</li>
                <li>700 ml tomato passata + 2 tbsp tomato paste</li>
                <li>1 bay leaf, pinch of sugar, salt &amp; pepper, fresh basil</li>
              </ul>

              <p className="font-bold text-amber-300">LAYERS</p>
              <ul className="list-disc list-inside mb-2">
                <li>500 g lasagna sheets</li>
                <li>1 small eggplant, sliced &amp; lightly fried (the Sicilian touch)</li>
                <li>250 g ricotta</li>
                <li>3 hard-boiled eggs, sliced</li>
                <li>200 g caciocavallo (or provolone), diced</li>
                <li>200 g mozzarella, torn</li>
                <li>120 g grated pecorino</li>
              </ul>

              <p className="font-bold text-amber-300">METHOD</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>
                  Soften onion, carrot &amp; celery in the oil (8–10 min); add
                  garlic for 1 min.
                </li>
                <li>
                  Raise heat, brown the beef &amp; sausage well. Pour in the wine
                  and let it cook off.
                </li>
                <li>
                  Stir in tomato paste, then passata, bay leaf and sugar.
                  Simmer low for 60–90 min; season and finish with torn basil.
                </li>
                <li>Fry the eggplant slices; drain on paper. Boil the sheets if needed.</li>
                <li>Loosen the ricotta with a splash of milk, salt &amp; pepper.</li>
                <li>
                  Build ~4 layers: ragù → pasta → ricotta dabs → egg slices →
                  eggplant → caciocavallo → mozzarella → pecorino. Repeat.
                </li>
                <li>Finish with ragù, mozzarella and a thick pecorino blanket.</li>
                <li>
                  Bake at 180°C (350°F): 25 min covered, then 15 min uncovered
                  until bubbling and golden.
                </li>
                <li>Rest 15 min before cutting — non-negotiable. Buon appetito.</li>
              </ol>
            </div>
          )}
        </section>

        {/* 6) C1'in isteği — tadinda: sessiz & terk edilmis */}
        <section className={`border rounded-xl p-4 opacity-60 ${card}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">🔇 Abandoned</p>
              <p className={`text-xs italic ${sub}`}>
                left behind, and entirely silent.
              </p>
            </div>
            <button
              disabled
              className="w-12 h-7 rounded-full bg-gray-400 cursor-not-allowed relative"
            >
              <span className="absolute top-0.5 left-0.5 w-6 h-6 bg-white/70 rounded-full" />
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
