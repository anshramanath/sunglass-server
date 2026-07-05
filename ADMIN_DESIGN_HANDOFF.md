# Admin Dashboard — Design Handoff

This document describes what data exists and what each page needs to communicate. Appearance, layout, and structure are left entirely to the designer.

---

## Context

Multi-brand platform. The dashboard is scoped per brand — the active brand determines what data is shown. There are 3 brands. Any page can have an empty state (no data yet for that brand).

The signed-in user is an admin. Their name is available.

---

## Pages

### Overview

A summary of the brand's catalogue and order activity.

**Catalogue counts:**
- Number of products
- Number of variations
- Number of categories
- Number of product images
- Number of products on sale

**Order counts:**
- Total orders placed
- Total revenue (sum of all order totals)
- Total amount refunded

**Recently added products** — the latest few products added to the catalogue. Per product: name, brand, SKU, price, whether it's on sale, sale price if applicable, stock status.

---

### Orders

All orders placed for the brand.

**Per order:**
- Order ID
- Date and time placed
- Customer name (from the shipping address)
- Number of items in the order
- Order total
- Amount refunded (absent if no refund has been issued)
- Status: one of `processing`, `shipped`, `delivered`, `refunded`, `partially_refunded`

Orders can be filtered by status. Each status has a count.

**Order detail** — each order can be expanded to show:
- Full shipping address: name, line1, line2, city, state, postal code, country
- Stripe payment intent ID
- Line items. Per item: product image, product name, SKU, attribute (e.g. "Gloss Black / Standard" — absent for simple products), unit price, quantity, line total

---

### Products

All products in the brand's catalogue.

**Per product:**
- Product image
- Name
- SKU
- Which categories it belongs to (can be multiple)
- Price range (minimum and maximum across variations)
- Sale price (if on sale)
- Whether it is on sale
- Stock status

Products can be filtered by search (name or SKU), by category, and by stock status.

---

### Categories

The brand's category tree. Categories are hierarchical — a category can have a parent and children.

**Per category:**
- Name
- Slug
- Sort order (determines display order in navigation)
- Number of products in this category
- View count (how many times this category page has been visited — can be absent)
- Its children, if any

---

### Analytics

Engagement and sales data for the brand.

**Top products by views** — which products are being seen the most. Per entry: product name, view count.

**Top categories by views** — which categories are being visited the most. Per entry: category name, view count. View count can be absent.

**Top products by sales** — which products have sold the most units. Per entry: product name, SKU, units sold.

---

## Data Fields

**Product:** id, name, slug, sku, brand_slug, sale (bool), featured (bool), min_price_cents, max_price_cents, sale_price_cents, total_sales, view_count, images, variations, categories

**Variation:** sku, attribute (array of `{name, slug}`), sale (bool), regular_price_cents, sale_price_cents, total_sales

**Category:** id, name, slug, sort_order, parent_id, brand_slug, view_count (nullable)

**Order:** id, brand_slug, stripe_payment_intent, status, total_cents, refunded_cents (nullable), shipping_address, created_at

**Order item:** product_slug, sku, name, image_src, price_cents, quantity, attribute (display string, nullable)

**Order statuses:** `processing` · `shipped` · `delivered` · `refunded` · `partially_refunded`

All monetary values are in cents (integers). Divide by 100 for display.
