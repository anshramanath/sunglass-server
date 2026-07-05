import { getOrders } from "@/lib/admin/orders";
import { getBrandBySlug } from "@/lib/brand";
import OrdersTable from "./orders-table";

export default async function OrdersPage({
  params,
}: {
  params: Promise<{ brandSlug: string }>;
}) {
  const { brandSlug } = await params;
  const brand = getBrandBySlug(brandSlug);
  const brandName = brand?.name ?? brandSlug;
  const accent = brand?.accent ?? "#000000";

  const orders = await getOrders(brandSlug);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 500, letterSpacing: "0.10em", textTransform: "uppercase", color: "#737373", marginBottom: 6 }}>
          {brandName}
        </div>
        <div style={{ fontSize: 34, fontWeight: 400, lineHeight: 1.05, letterSpacing: "-0.01em" }}>
          Orders
        </div>
      </div>

      <OrdersTable orders={orders} accent={accent} />
    </div>
  );
}
