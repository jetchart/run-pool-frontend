import { useState } from 'react';

interface ExpandableTextProps {
  text: string;
  maxLength: number;
  className?: string;
}

export default function ExpandableText({ text, maxLength, className }: ExpandableTextProps) {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > maxLength;
  const displayText = !expanded && isLong ? text.slice(0, maxLength) + '...' : text;

  return (
    <span className={className}>
      {displayText}
      {isLong && (
        <button
          type="button"
          className="ml-2 text-blue-600 hover:underline text-xs font-medium"
          onClick={() => setExpanded((e) => !e)}
        >
          {expanded ? 'Ver menos' : 'Ver más'}
        </button>
      )}
    </span>
  );
}
