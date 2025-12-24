"use client";
import { useState, type ChangeEvent } from "react";
import { Sparkles, FileText, RefreshCw } from "lucide-react";
import Image from "next/image";
type IngredientResult = string[] | null;
export default function FoodIngredientAnalyzer() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [ingredients, setIngredients] = useState<IngredientResult>(null);
  const [uploading, setUploading] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");

  // Cloudinary тохиргоо
  const UPLOAD_PRESET = "food-delivery";
  const CLOUD_NAME = "dm9ydx4oz";

  // 1. Cloudinary-руу хуулах функц
  const uploadToCloudinary = async (
    file: File
  ): Promise<string | undefined> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
    }
  };

  // 2. Зураг сонгох үед ажиллах функц
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    console.log("here", file.type);
    // Зөвхөн зураг эсэхийг шалгах
    if (file.type.startsWith("image/")) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setIngredients(null);

      // Хэрэв шууд Cloudinary-руу хуулж URL-ийг нь авах бол:
      setUploading(true);
      const url = await uploadToCloudinary(file);
      if (url) setLogoUrl(url);
      setUploading(false);
    }
  };

  const handleGenerate = async () => {
    if (!logoUrl) {
      alert("Image not uploaded to Cloudinary yet!");
      return;
    }
    setIsAnalyzing(true);
    setIngredients(null);
    try {
      const response = await fetch("http://localhost:999", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: logoUrl }),
      });

      const data = await response.json();

      if (response.ok && data.analysis) {
        setIngredients([data.analysis]);
      } else {
        console.error("Backend error:", data.error);
        alert("ERROR ERROR maybe ur mom ");
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };
  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setIngredients(null);
    setLogoUrl("");
  };
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-8 py-12">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6" />
            <h2 className="text-2xl font-semibold">Image analysis</h2>
          </div>
          <button
            onClick={handleReset}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <RefreshCw className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="mb-8">
          <label className="block relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={uploading}
            />
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-gray-400 transition-colors">
              <p className="text-gray-600">
                {uploading
                  ? "Uploading to Cloudinary..."
                  : "Click to upload or drag and drop JPG, PNG"}
              </p>
            </div>
          </label>

          {previewUrl && (
            <div className="mt-6 flex justify-center">
              <Image
                src={previewUrl}
                alt="Preview"
                width={500}
                height={500}
                className="max-w-md h-auto rounded-lg shadow-md border"
              />
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleGenerate}
              disabled={!selectedFile || isAnalyzing || uploading}
              className="bg-black hover:bg-gray-800 disabled:bg-gray-300 text-white px-8 py-2.5 rounded-lg transition-colors"
            >
              {isAnalyzing ? "Analyzing..." : "Generate"}
            </button>
          </div>
        </div>

        {/* Үр дүнгийн хэсэг */}
        <div className="mt-12 border-t pt-8">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-6 h-6 text-blue-600" />
            <h3 className="text-2xl font-semibold">Here is the summary</h3>
          </div>

          {isAnalyzing ? (
            <div className="flex flex-col items-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black mb-4"></div>
              <p className="text-gray-500 animate-pulse">
                Please wait it may take time!!!!!!
              </p>
            </div>
          ) : ingredients && ingredients.length > 0 ? (
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 leading-relaxed text-gray-700 shadow-inner">
              {ingredients[0]}
            </div>
          ) : (
            <p className="text-gray-500 italic text-center py-10 bg-gray-50 rounded-xl border border-dashed">
              First, enter your image to recognize an ingredients.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
