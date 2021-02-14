import * as React from "react";

interface EditorProps {
  id: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function Editor(props: EditorProps) {
  const { id, value, onChange } = props;

  return (
    <textarea
      className="p-4 rounded-none"
      id={id}
      value={value}
      onChange={onChange}
    />
  );
}
