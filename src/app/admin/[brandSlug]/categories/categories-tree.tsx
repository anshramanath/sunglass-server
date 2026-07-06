"use client";

import { useState } from "react";
import type { FlatCategory } from "@/lib/types";

const GRID = "2fr 1fr 90px 100px 100px";

export default function CategoriesTree({ rows, accent }: { rows: FlatCategory[]; accent: string }) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  function toggle(id: string) {
    setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  const visible = rows.filter((row) => row.ancestorIds.every((id) => !collapsed[id]));

  if (rows.length === 0) {
    return (
      <div style={{ padding: "60px 0", color: "#737373", fontSize: 15, borderTop: "1px solid #e5e5e5" }}>
        No categories yet.
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: GRID, gap: 16, padding: "0 0 10px", borderBottom: "1px solid #000000", fontSize: 12, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: "#737373" }}>
        <div>Name</div>
        <div>Slug</div>
        <div>Sort</div>
        <div>Products</div>
        <div>Views</div>
      </div>

      {visible.map((row) => (
        <div key={row.id} style={{ display: "grid", gridTemplateColumns: GRID, gap: 16, alignItems: "center", padding: "14px 0", borderBottom: "1px solid #e5e5e5" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, paddingLeft: row.depth * 28 }}>
            {row.hasChildren ? (
              <span
                onClick={() => toggle(row.id)}
                style={{ cursor: "pointer", width: 16, fontSize: 13, color: "#737373", transform: collapsed[row.id] ? "rotate(-90deg)" : "rotate(0deg)", display: "inline-block", transition: "transform 120ms" }}
              >
                ⌄
              </span>
            ) : (
              <span style={{ width: 16, display: "inline-block" }} />
            )}
            <span style={{ fontSize: 15, color: row.isLeaf ? "#525252" : undefined }}>{row.name}</span>
          </div>
          <div style={{ fontSize: 14, color: "#737373" }}>{row.slug}</div>
          <div style={{ fontSize: 14 }}>
            {row.depth === 0 ? (
              <span style={{ background: accent, color: "#ffffff", fontSize: 12, fontWeight: 500, padding: "2px 8px", borderRadius: 4 }}>
                {row.sortOrder}
              </span>
            ) : (
              row.sortOrder
            )}
          </div>
          <div style={{ fontSize: 14, color: row.isLeaf ? undefined : "#737373" }}>{row.isLeaf ? row.productCount : "—"}</div>
          <div style={{ fontSize: 14, color: row.isLeaf ? accent : "#737373" }}>
            {row.isLeaf ? (row.viewCount ?? 0).toLocaleString() : "—"}
          </div>
        </div>
      ))}
    </div>
  );
}
