import { Sparkles, FileText, RefreshCw } from "lucide-react";
import { useState } from "react";

export default function IngredientRecognition() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [description, setDescription] = useState("");

  const [ingredients, setIngredients] = useState<string | null>(null);

  const recognizeIngredients = async () => {
    if (!description.trim()) return alert("Please describe the food first!");

    setIsAnalyzing(true);
    setIngredients(null);

    try {
      const response = await fetch(
        "https://ai-model-back-end.onrender.com/ingredient-generator",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ description }),
        }
      );

      if (!response.ok) throw new Error("Failed to connect to server");

      const data = await response.json();

      if (data.result) {
        setIngredients(data.result);
      } else {
        setIngredients("Could not identify ingredients.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Connection failed. Ensure your server is running on port 999.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setIsAnalyzing(false);
    setIngredients(null);
    setDescription("");
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-8 py-12">
        <div className="flex items-center justify-between mb-4 pb-6">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6" />
            <h2 className="text-2xl font-semibold">Ingredient recognition</h2>
          </div>
          <button
            onClick={handleReset}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <RefreshCw className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="block w-full border border-gray-300 rounded-lg p-4">
          <textarea
            placeholder="Describe the food..."
            className="w-full outline-none border-0 h-32 resize-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={recognizeIngredients}
            disabled={isAnalyzing}
            className="bg-black text-white px-8 py-2.5 rounded-lg disabled:bg-gray-300"
          >
            {isAnalyzing ? "Analyzing..." : "Generate"}
          </button>
        </div>

        <div className="mt-12">
          <h3 className="text-2xl font-semibold flex items-center gap-3 mb-4">
            <FileText className="w-6 h-6" /> Result
          </h3>
          <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 min-h-25">
            {ingredients ? (
              <p className="text-gray-800 whitespace-pre-wrap">{ingredients}</p>
            ) : (
              <p className="text-gray-400 italic">Results will appear here.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
