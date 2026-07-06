import { getAnalyticsSummary, getTopProductViews, getTopCategoryViews, getTopProductSales } from "@/lib/admin/analytics";
import type { RankedRow } from "@/lib/types";
import { getBrandBySlug } from "@/lib/brand";

function RankedList({ rows, accent }: { rows: RankedRow[]; accent: string }) {
  if (rows.length === 0) {
    return (
      <div style={{ padding: "24px 0", color: "#737373", fontSize: 14 }}>
        No data yet.
      </div>
    );
  }

  return (
    <div>
      {rows.map((r, i) => (
        <div key={r.name} style={{ padding: "12px 0", borderBottom: "1px solid #e5e5e5" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center", minWidth: 0, flex: 1 }}>
              <span style={{ width: 22, height: 22, borderRadius: "50%", border: `1px solid ${accent}`, color: accent, fontSize: 11, fontWeight: 500, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {i + 1}
              </span>
              <div style={{ minWidth: 0, overflow: "hidden" }}>
                <div style={{ fontSize: 15, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.name}</div>
                {r.subtitle && <div style={{ fontSize: 12, color: "#a3a3a3", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.subtitle}</div>}
              </div>
            </div>
            <span style={{ fontSize: 14, color: "#737373", flexShrink: 0 }}>{r.value}</span>
          </div>
          <div style={{ height: 4, background: "#f0f0f0", marginLeft: 34 }}>
            <div style={{ height: "100%", width: `${r.barPct}%`, background: accent }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function AnalyticsPage({
  params,
}: {
  params: Promise<{ brandSlug: string }>;
}) {
  const { brandSlug } = await params;
  const brand = getBrandBySlug(brandSlug);
  const brandName = brand?.name ?? brandSlug;
  const accent = brand?.accent ?? "#000000";

  const summary = await getAnalyticsSummary(brandSlug);
  const [topProductViews, topCategoryViews, topProductSales] = await Promise.all([
    getTopProductViews(brandSlug, summary.totalViews),
    getTopCategoryViews(brandSlug, summary.totalViews),
    getTopProductSales(brandSlug, summary.unitsSold),
  ]);
  
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 500, letterSpacing: "0.10em", textTransform: "uppercase", color: "#737373", marginBottom: 6 }}>
          {brandName}
        </div>
        <div style={{ fontSize: 34, fontWeight: 400, lineHeight: 1.05, letterSpacing: "-0.01em" }}>
          Analytics
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 1, background: "#e5e5e5" }}>
        <div style={{ background: "#ffffff", padding: "22px 20px" }}>
          <div style={{ fontSize: 32, fontWeight: 400, lineHeight: 1 }}>{summary.totalViews.toLocaleString()}</div>
          <div style={{ fontSize: 13, color: "#737373", marginTop: 8 }}>Total views</div>
        </div>
        <div style={{ background: "#ffffff", padding: "22px 20px" }}>
          <div style={{ fontSize: 32, fontWeight: 400, lineHeight: 1 }}>{summary.unitsSold.toLocaleString()}</div>
          <div style={{ fontSize: 13, color: "#737373", marginTop: 8 }}>Units sold</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: "#737373", marginBottom: 16 }}>
            Top products by views
          </div>
          <RankedList rows={topProductViews} accent={accent} />
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: "#737373", marginBottom: 16 }}>
            Top categories by views
          </div>
          <RankedList rows={topCategoryViews} accent={accent} />
        </div>
      </div>

      <div>
        <div style={{ fontSize: 13, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: "#737373", marginBottom: 16 }}>
          Top products by sales
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 48px" }}>
          <RankedList rows={topProductSales} accent={accent} />
        </div>
      </div>
    </div>
  );
}
