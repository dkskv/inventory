import React from "react";

export const Ellipsis: React.FC<{ children: string | undefined | null }> = ({
  children,
}) => {
  return (
    <div
      title={children ?? undefined}
      style={{
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
      }}
    >
      {children}
    </div>
  );
};
