"use client";

import { useState } from "react";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import type { Order } from "@/lib/types";

const STATUS_LABEL: Record<string, string> = {
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  refunded: "Refunded",
  partially_refunded: "Partially Refunded",
};

const GRID = "1.2fr 1.4fr 1.1fr 0.7fr 1fr 1.2fr 32px";

function formatDate(iso: string) {
  const d = new Date(iso);
  return (
    d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) +
    " · " +
    d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
  );
}

function displayId(id: string) {
  return "#" + id.slice(-8).toUpperCase();
}

export default function OrdersTable({ orders, accent }: { orders: Order[]; accent: string }) {
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  function statusColor(status: string) {
    if (status === "refunded" || status === "partially_refunded") return accent;
    if (status === "processing") return "#737373";
    return "#000000";
  }

  const filterDefs = [
    { value: "all", label: `All (${orders.length})` },
    ...Object.entries(STATUS_LABEL).map(([value, label]) => ({
      value,
      label: `${label} (${orders.filter((o) => o.status === value).length})`,
    })),
  ];

  const visible = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
        {filterDefs.map((f) => {
          const active = filter === f.value;
          return (
            <div
              key={f.value}
              onClick={() => { setFilter(f.value); setExpanded(null); }}
              style={{
                padding: "11px 18px",
                fontSize: 14,
                fontWeight: 500,
                letterSpacing: "0.02em",
                cursor: "pointer",
                whiteSpace: "nowrap",
                flexShrink: 0,
                border: `1px solid ${active ? accent : "#000000"}`,
                background: active ? accent : "#ffffff",
                color: active ? "#ffffff" : "#000000",
              }}
            >
              {f.label}
            </div>
          );
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: GRID, gap: 16, padding: "0 0 10px", borderBottom: "1px solid #000000", fontSize: 12, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: "#737373" }}>
        <div>Order</div>
        <div>Placed</div>
        <div>Customer</div>
        <div>Items</div>
        <div>Total</div>
        <div>Status</div>
        <div />
      </div>

      {visible.map((o) => {
        const isExpanded = expanded === o.id;
        const itemCount = o.items.reduce((s, i) => s + i.quantity, 0);
        const sc = statusColor(o.status);
        const hasRefund = o.refundedCents > 0;

        return (
          <div key={o.id} style={{ borderBottom: "1px solid #e5e5e5" }}>
            <div
              onClick={() => setExpanded(isExpanded ? null : o.id)}
              style={{ display: "grid", gridTemplateColumns: GRID, gap: 16, alignItems: "center", padding: "16px 0", cursor: "pointer" }}
            >
              <div style={{ fontSize: 14 }}>{displayId(o.id)}</div>
              <div style={{ fontSize: 14, color: "#737373" }}>{formatDate(o.createdAt)}</div>
              <div style={{ fontSize: 14 }}>{o.shippingAddress.name}</div>
              <div style={{ fontSize: 14 }}>{itemCount}</div>
              <div style={{ fontSize: 14 }}>{formatPrice(o.totalCents)}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: sc }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: sc, flexShrink: 0 }} />
                {STATUS_LABEL[o.status] ?? o.status}
              </div>
              <div style={{ fontSize: 16, color: "#737373", textAlign: "center", transform: isExpanded ? "rotate(0deg)" : "rotate(180deg)", transition: "transform 120ms" }}>
                ⌄
              </div>
            </div>

            {isExpanded && (
              <div style={{ background: "#fafafa", padding: "24px 24px 28px", marginBottom: 8 }}>
                <div style={{ display: "grid", gridTemplateColumns: hasRefund ? "1fr 1fr 1fr" : "1fr 1fr", gap: 32, marginBottom: 24 }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: "#737373", marginBottom: 10 }}>Shipping address</div>
                    <div style={{ fontSize: 14, lineHeight: 1.6 }}>
                      <div>{o.shippingAddress.name}</div>
                      <div>{o.shippingAddress.line1}</div>
                      {o.shippingAddress.line2 && <div>{o.shippingAddress.line2}</div>}
                      <div>{o.shippingAddress.city}, {o.shippingAddress.state} {o.shippingAddress.postal_code}</div>
                      <div>{o.shippingAddress.country}</div>
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: "#737373", marginBottom: 10 }}>Payment</div>
                    <div style={{ fontSize: 14, color: "#737373", fontFamily: "monospace" }}>{o.paymentIntent}</div>
                  </div>
                  {hasRefund && (
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: "#737373", marginBottom: 10 }}>Refunded</div>
                      <div style={{ fontSize: 14, color: sc }}>{formatPrice(o.refundedCents)}</div>
                    </div>
                  )}
                </div>

                <div style={{ fontSize: 12, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", color: "#737373", marginBottom: 10 }}>Items</div>
                {o.items.map((item, idx) => (
                  <div
                    key={item.id}
                    style={{ display: "grid", gridTemplateColumns: "44px 2fr 1fr 1fr 0.6fr 1fr", gap: 16, alignItems: "center", padding: "10px 0", borderTop: idx === 0 ? "none" : "1px solid #e5e5e5" }}
                  >
                    {item.imageSrc ? (
                      <Image src={item.imageSrc} alt={item.name} width={36} height={46} style={{ objectFit: "cover", background: "#f0f0f0", flexShrink: 0 }} />
                    ) : (
                      <div style={{ width: 36, height: 46, background: "#f0f0f0", flexShrink: 0 }} />
                    )}
                    <div>
                      <div style={{ fontSize: 14 }}>{item.name}</div>
                      {item.attribute && <div style={{ fontSize: 12, color: "#737373" }}>{item.attribute}</div>}
                    </div>
                    <div style={{ fontSize: 13, color: "#737373" }}>{/* sku not stored on order_items */}</div>
                    <div style={{ fontSize: 14 }}>{formatPrice(item.priceCents)}</div>
                    <div style={{ fontSize: 14, color: "#737373" }}>×{item.quantity}</div>
                    <div style={{ fontSize: 14 }}>{formatPrice(item.priceCents * item.quantity)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
