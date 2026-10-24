import React from 'react';
import Cardmessages from '../utils/Cardmessages.js';

function Card() {
  return (
    <div className="mx-auto mt-10 grid w-full max-w-[1400px] grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {Cardmessages.map((messages) => (
        <div
          key={messages.id}
          className="flex h-full min-h-[280px] flex-col rounded-2xl border border-slate-200 bg-white p-6 text-slate-900 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
        >
          <h2 className="min-h-14 text-center text-xl font-bold leading-snug">
            {messages.title}
          </h2>

          <p className="mt-3 flex-grow text-center text-base leading-relaxed text-slate-500">
            {messages.description}
          </p>

          <button
            type="button"
            onClick={() => console.log(messages.title)}
            className="mt-auto w-full rounded-lg border border-slate-200 bg-black px-4 py-3 text-base font-semibold text-white transition-all duration-300 hover:bg-slate-800"
          >
            {messages.buttonText}
          </button>
        </div>
      ))}
    </div>
  );
}

export default Card;