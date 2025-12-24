import { Sparkles, FileText, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
export default function ImageCreator() {
  const [loading, setloading] = useState(false);
  const [prompt, setPrompt] = useState("");

  const [imageResult, setImageResult] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (imageResult) URL.revokeObjectURL(imageResult);
    };
  }, [imageResult]);

  const recognize = async () => {
    console.log("prompt", prompt);
    if (!prompt) return alert("Please enter a description!");

    setloading(true);
    setImageResult(null);

    try {
      const response = await fetch("http://localhost:999/image-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      if (data.image) {
        setImageResult(data.image);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setloading(false);
    }
  };

  const handleReset = () => {
    setloading(false);
    setPrompt("");
    if (imageResult) URL.revokeObjectURL(imageResult);
    setImageResult(null);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-8 py-12">
        <div className="flex items-center justify-between mb-4 pb-6">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6" />
            <h2 className="text-2xl font-semibold">Food image creator</h2>
          </div>
          <button
            className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            onClick={handleReset}
          >
            <RefreshCw className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div>
          <p className="text-gray-600 mb-8">
            What food image do you want? Describe it briefly.
          </p>
        </div>

        <div className="block w-full border border-gray-300 rounded-lg p-4">
          <input
            type="text"
            placeholder="Describe the food, and AI will create images."
            className="w-full outline-none focus:ring-0 border-0 h-10"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={recognize}
            disabled={loading}
            className="bg-gray-800 hover:bg-black disabled:bg-gray-300 text-white px-8 py-2.5 rounded-lg font-medium transition-colors cursor-pointer"
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>

        <div className="mt-12 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-6 h-6" />
            <h3 className="text-2xl font-semibold">Result</h3>
          </div>

          {imageResult ? (
            <div className="mt-4 rounded-xl overflow-hidden border border-gray-200 shadow-lg">
              <Image
                src={imageResult}
                alt="Generated Food"
                width={800} // Set a base width
                height={600} // Set a base height
                className="w-full h-auto"
              />
            </div>
          ) : (
            <div className="py-20 border-2 border-dashed border-gray-100 rounded-xl flex items-center justify-center">
              <p className="text-gray-400 italic">
                {loading
                  ? "AI is cooking your image..."
                  : "First, enter your text to generate an image."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
