import React from "react";
import NavButton from "./NavButton";
import SeriousIcons from "../SeriousIcons";
import { getDb } from "../../src/store/localDb";
import { analyzeMap } from "../../src/utils/analyzeMap";

const AnalyzeButton = ({ onResult }) => {
  const handleAnalyze = () => {
    try {
      onResult(analyzeMap(getDb()));
    } catch (err) {
      onResult(`Error: ${err.message}`);
    }
  };

  return (
    <NavButton
      onClick={handleAnalyze}
      icon={SeriousIcons.Sparkle}
      label="Analyze"
      subtext="Find single points of failure. Runs in your browser."
      colorClass="bg-white/5"
      iconColor="text-blue-400"
    />
  );
};

export default AnalyzeButton;
