const BRAND_NAMES: Record<string, string> = {
  "bikershades": "BikerShades",
  "prosport-sunglasses": "proSPORT Sunglasses",
  "sunglass-monster": "Sunglass Monster",
};

const CATALOGUE_STATS = [
  { label: "Products", value: "24" },
  { label: "On sale", value: "8" },
  { label: "Featured", value: "6" },
  { label: "Categories", value: "12" },
];

const ORDER_STATS = [
  { label: "Active orders", value: "3" },
  { label: "Completed orders", value: "18" },
  { label: "Revenue", value: "$2,840.00" },
];

const RECENT_PRODUCTS = [
  { id: "1", name: "Route 66 Wraparound", categories: ["Riding", "Sport"], price: "$98.00", sale: "$79.00", featured: true },
  { id: "2", name: "Ridge Aviator", categories: ["Riding"], price: "$88.00", sale: null, featured: false },
  { id: "3", name: "Highway Polarized", categories: ["Sport"], price: "$128.00", sale: "$98.00", featured: true },
  { id: "4", name: "Overland Shield", categories: ["Riding", "Accessories"], price: "$110.00", sale: null, featured: false },
];

export default async function OverviewPage({
  params,
}: {
  params: Promise<{ brandSlug: string }>;
}) {
  const { brandSlug } = await params;
  const brandName = BRAND_NAMES[brandSlug] ?? brandSlug;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 13, fontWeight: 500, letterSpacing: "0.10em", textTransform: "uppercase", color: "#737373", marginBottom: 6 }}>
          {brandName}
        </div>
        <div style={{ fontSize: 34, fontWeight: 400, lineHeight: 1.05, letterSpacing: "-0.01em" }}>
          Overview
        </div>
      </div>

      <div>
        <div style={{ fontSize: 13, fontWeight: 500, color: "#737373", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>
          Catalogue
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, background: "#e5e5e5" }}>
          {CATALOGUE_STATS.map((stat) => (
            <div key={stat.label} style={{ background: "#ffffff", padding: "22px 20px" }}>
              <div style={{ fontSize: 32, fontWeight: 400, lineHeight: 1 }}>{stat.value}</div>
              <div style={{ fontSize: 13, color: "#737373", marginTop: 8 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div style={{ fontSize: 13, fontWeight: 500, color: "#737373", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>
          Orders
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: "#e5e5e5" }}>
          {ORDER_STATS.map((stat) => (
            <div key={stat.label} style={{ background: "#ffffff", padding: "22px 20px" }}>
              <div style={{ fontSize: 32, fontWeight: 400, lineHeight: 1 }}>{stat.value}</div>
              <div style={{ fontSize: 13, color: "#737373", marginTop: 8 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div style={{ fontSize: 13, fontWeight: 500, color: "#737373", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>
          Recently added products
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "56px 2fr 1.4fr 120px 100px 100px", gap: 16, padding: "0 0 10px", borderBottom: "1px solid #000000", fontSize: 12, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: "#737373" }}>
          <div />
          <div>Name</div>
          <div>Categories</div>
          <div>Price</div>
          <div>Sale</div>
          <div>Featured</div>
        </div>
        {RECENT_PRODUCTS.map((p) => (
          <div key={p.id} style={{ display: "grid", gridTemplateColumns: "56px 2fr 1.4fr 120px 100px 100px", gap: 16, alignItems: "center", padding: "14px 0", borderBottom: "1px solid #e5e5e5" }}>
            <div style={{ width: 44, height: 56, background: "#f5f5f5" }} />
            <div style={{ fontSize: 15 }}>{p.name}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {p.categories.map((cat) => (
                <span key={cat} style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.02em", border: "1px solid #e5e5e5", padding: "3px 9px", color: "#525252", whiteSpace: "nowrap" }}>
                  {cat}
                </span>
              ))}
            </div>
            <div style={{ fontSize: 14, textDecoration: p.sale ? "line-through" : "none", color: p.sale ? "#737373" : "#000000" }}>
              {p.price}
            </div>
            <div style={{ fontSize: 13, color: p.sale ? "#000000" : "#737373" }}>
              {p.sale ?? "—"}
            </div>
            <div style={{ fontSize: 13, color: p.featured ? "#000000" : "#737373" }}>
              {p.featured ? "Featured" : "—"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
