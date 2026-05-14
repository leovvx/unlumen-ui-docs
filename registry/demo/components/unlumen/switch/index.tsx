"use client";

import { useState } from "react";
import { Switch } from "@/registry/components/unlumen/switch";

export const SwitchDemo = ({
  labelSide = "right",
}: {
  labelSide?: "left" | "right";
}) => {
  const [wifi, setWifi] = useState(true);
  const [bluetooth, setBluetooth] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="flex flex-col gap-4 p-8">
      <Switch
        checked={wifi}
        onCheckedChange={setWifi}
        label="Wi-Fi"
        labelSide={labelSide}
      />
      <Switch
        checked={bluetooth}
        onCheckedChange={setBluetooth}
        label="Bluetooth"
        labelSide={labelSide}
      />
      <Switch
        checked={notifications}
        onCheckedChange={setNotifications}
        label="Notifications"
        labelSide={labelSide}
      />
      <Switch
        checked={darkMode}
        onCheckedChange={setDarkMode}
        label="Dark mode"
        labelSide={labelSide}
      />
    </div>
  );
};
