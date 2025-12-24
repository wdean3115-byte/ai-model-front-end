"use client";
import Header from "./components/Header";
import Buttoon from "./components/Button";
import ImageCreator from "./components/ImgageCreator";
import IngredientRecognition from "./components/IngredientRecognition";
import FoodIngredientAnalyzer from "./components/FoodImageAnalyzer";
import { useState } from "react";
import Chatbox from "./components/chatbox";
export default function Home() {
  const [activeTab, setActiveTab] = useState("analysis");

  return (
    <div className=" flex flex-col gap-6 items-center ">
      <Header />
      <Buttoon setActiveTab={setActiveTab} activeTab={activeTab} />
      <div className="w-145 flex flex-col gap-6">
        {activeTab === "analysis" && <FoodIngredientAnalyzer />}
        {activeTab === "recognition" && <IngredientRecognition />}
        {activeTab === "creator" && <ImageCreator />}
      </div>
      <Chatbox />
    </div>
  );
}
