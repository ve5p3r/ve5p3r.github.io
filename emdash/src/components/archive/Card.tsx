import { type ReactNode } from "react";

export function Card({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <>
      <div className="card">
        <h3>{title}</h3>
        {children}
      </div>
    </>
  );
}
