
export default function button({ setActiveTab, activeTab }) {
  return (
    <div className="max-w-5xl mx-auto px-8 py-12">
      <div className="flex gap-2 mb-12">
        <button
          onClick={() => setActiveTab("analysis")}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            activeTab === "analysis"
              ? "bg-gray-100 text-gray-900"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Image analysis
        </button>
        <button
          onClick={() => setActiveTab("recognition")}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            activeTab === "recognition"
              ? "bg-gray-100 text-gray-900"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Ingredient recognition
        </button>
        <button
          onClick={() => setActiveTab("creator")}
          className={`px-6 py-2 rounded-lg font-medium transition-colors  ${
            activeTab === "creator"
              ? "bg-gray-100 text-gray-900"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Image creator
        </button>
      </div>
    </div>
  );
}
