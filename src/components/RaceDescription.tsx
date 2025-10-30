import React, { useState } from "react";

interface RaceDescriptionProps {
  description?: string;
}

const MAX_LENGTH = 120;

const RaceDescription: React.FC<RaceDescriptionProps> = ({ description }) => {
  const [expanded, setExpanded] = useState(false);
  if (!description) return null;
  const isLong = description.length > MAX_LENGTH;
  const shownText = expanded || !isLong ? description : description.slice(0, MAX_LENGTH) + "...";
  return (
    <span className="text-sm font-normal">
      {shownText}
      {isLong && (
        <button
          type="button"
          className="ml-2 text-blue-600 hover:underline text-xs font-medium"
          onClick={() => setExpanded((e) => !e)}
        >
          {expanded ? "Ver menos" : "Ver más"}
        </button>
      )}
    </span>
  );
};

export default RaceDescription;
