import React from "react";
import NavButton from "./NavButton";
import SeriousIcons from "../SeriousIcons";
import useUserStore from "../../src/store/dataStore";
import { resetDemo } from "../../src/store/localDb";

const ResetDemo = ({ onReset }) => {
  const handleReset = () => {
    if (!window.confirm("Reset the demo? This erases your changes in this browser and restores the sample map.")) return;
    resetDemo();
    useUserStore.getState().fetchUsers();
    onReset?.();
  };

  return (
    <NavButton
      onClick={handleReset}
      icon={SeriousIcons.Trash}
      label="Reset Demo"
      subtext="Erase your changes and restore the sample map."
      colorClass="bg-white/5 hover:bg-white/10"
      iconColor="text-slate-400"
    />
  );
};

export default ResetDemo;
