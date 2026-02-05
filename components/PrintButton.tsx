'use client';

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="inline-block bg-white hover:bg-gray-100 text-[#1A1A1A] font-medium px-8 py-3 rounded-lg transition-colors"
    >
      Download PDF
    </button>
  );
}
