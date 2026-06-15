/* proSPORT — shared product data + card renderer (Tailwind classes only) */

const SHOP_PRODUCTS = [
  { name: "Airspeed", priceCents: 1799, compareAtCents: 1999, colors: ["Gunmetal HD","Black HD","Bronze HD"], tag: "Best Seller",
    image: "https://zgcekcoatiskqbdruadg.supabase.co/storage/v1/object/public/bikershades/2022_05_Airspeed-Black-Front.jpg" },
  { name: "Aruba", priceCents: 1200, compareAtCents: 1599, colors: ["Grey Smoke","Silver Brown","Tortoise Brown","Purple Smoke","Gunmetal Smoke","Black Smoke"],
    image: "https://zgcekcoatiskqbdruadg.supabase.co/storage/v1/object/public/bikershades/2018_08_Aruba-PL-Black-Smoke-Front.jpg" },
  { name: "Atlas", priceCents: 1799, colors: ["Silver HD","Gunmetal HD","Gold HD","Black HD"],
    image: "https://zgcekcoatiskqbdruadg.supabase.co/storage/v1/object/public/bikershades/2024_05_Atlas-Black-Front.jpg" },
  { name: "Backspin", priceCents: 1999, colors: ["White Green Smoke","Grey Green Smoke","Glossy Black Green Smoke","Blue Green Smoke"], tag: "New",
    image: "https://zgcekcoatiskqbdruadg.supabase.co/storage/v1/object/public/bikershades/2024_05_Backspin-Glossy-Black-Green-Smoke-Front.jpg" },
  { name: "Convair", priceCents: 1999, colors: ["Silver Smoke","Silver Mirror Smoke","Gunmetal Smoke","Gunmetal Mirror Smoke","Gold Mirror Brown","Gold Brown"], tag: "Fits LG–XLG",
    image: "https://zgcekcoatiskqbdruadg.supabase.co/storage/v1/object/public/bikershades/2022_09_Convair-Gunmetal-Smoke-Front.jpg" },
  { name: "Coupe", priceCents: 1699, colors: ["Silver HD","Tortoise HD","Gray HD","Black HD"],
    image: "https://zgcekcoatiskqbdruadg.supabase.co/storage/v1/object/public/bikershades/2022_09_Coupe-Black-Front.jpg" },
  { name: "Daisy", priceCents: 1599, colors: ["White Smoke","Pink Smoke","Brown Brown","Black Smoke"],
    image: "https://zgcekcoatiskqbdruadg.supabase.co/storage/v1/object/public/bikershades/2024_05_Daisy-Black-Front.jpg" },
  { name: "Eliminator", priceCents: 1700, colors: ["Black Polarized Dark Yellow","Chrome Tinted Clear","Black Tinted Yellow","Black Yellow","Black Tinted Clear","Black Clear"],
    image: "https://zgcekcoatiskqbdruadg.supabase.co/storage/v1/object/public/bikershades/2018_09_Eliminator-Clear-Front.jpg" },
  { name: "Hairpin", priceCents: 1899, colors: ["Silver HD","Gunmetal HD","Bronze HD","Black HD"],
    image: "https://zgcekcoatiskqbdruadg.supabase.co/storage/v1/object/public/bikershades/2022_09_Hairpin-Black-Front.jpg" },
  { name: "Hangar", priceCents: 1799, colors: ["Silver HD","Gunmetal HD","Gold HD"], tag: "New",
    image: "https://zgcekcoatiskqbdruadg.supabase.co/storage/v1/object/public/bikershades/2024_05_Hangar-Gunmetal-Front.jpg" },
  { name: "Hemi", priceCents: 1799, colors: ["Gunmetal HD","Bronze HD","Black HD"],
    image: "https://zgcekcoatiskqbdruadg.supabase.co/storage/v1/object/public/bikershades/2024_05_Hemi-Black-Front.jpg" },
  { name: "Hollywood", priceCents: 1599, colors: ["White Smoke","Tortoise Brown","Black Smoke"],
    image: "https://zgcekcoatiskqbdruadg.supabase.co/storage/v1/object/public/bikershades/2024_05_Hollywood-Black-Front.jpg" },
  { name: "Horizon", priceCents: 1799, maxCents: 2099, colors: ["Tortoise HD","Dark Tortoise HD","Black HD"],
    image: "https://zgcekcoatiskqbdruadg.supabase.co/storage/v1/object/public/bikershades/2022_05_Horizon-Black-Front.jpg" },
  { name: "Jupiter", priceCents: 1999, colors: ["Silver Smoke","Gold Smoke","Gold Green Smoke","Black Smoke"],
    image: "https://zgcekcoatiskqbdruadg.supabase.co/storage/v1/object/public/bikershades/2022_05_Jupiter-Black-Smoke-Front.jpg" },
  { name: "Chopper 901", priceCents: 999, compareAtCents: 1299, colors: ["Black HD","Black Yellow","Black Clear","Black Mirror Smoke","Black Smoke"],
    image: "https://zgcekcoatiskqbdruadg.supabase.co/storage/v1/object/public/bikershades/2018_11_Black-Smoke-Front.jpg" },
  { name: "Locs Cruiser", priceCents: 1099, colors: ["Matte Black Green Mirror","Matte Black Silver Mirror","Matte Black Orange Mirror","Matte Black Blue Mirror","Glossy Black Smoke"],
    image: "https://zgcekcoatiskqbdruadg.supabase.co/storage/v1/object/public/bikershades/2018_11_Gloss-Black-Smoke-Front.jpg" },
];

/* unitsSold is part of the product shape (sales volume from the DB). We attach it
   here, then derive the "Best Seller" badge as the top 3 sellers — computed, not
   hand-picked. */
const UNITS_SOLD = {
  "Airspeed": 4280, "Atlas": 3120, "Backspin": 2680, "Aruba": 2510, "Chopper 901": 2360,
  "Hemi": 1980, "Convair": 1740, "Coupe": 1610, "Hairpin": 1450, "Horizon": 1390,
  "Hangar": 1280, "Locs Cruiser": 1180, "Jupiter": 1120, "Hollywood": 1040,
  "Daisy": 960, "Eliminator": 880
};
SHOP_PRODUCTS.forEach(p => { p.unitsSold = UNITS_SOLD[p.name] ?? 0; });
const BESTSELLER_CUTOFF = SHOP_PRODUCTS.map(p => p.unitsSold).sort((a, b) => b - a)[2] ?? Infinity;

/* ---- swatch derivation from messy colour names ----
   The names are compound frame+lens descriptors ("Glossy Black Green Smoke",
   "Silver Mirror Smoke", "Gold Brown"). We drop the finish/modifier words,
   map the remaining colour tokens to hex, then render the FIRST as the frame
   and the SECOND (if any) as the lens — a two-tone split chip. Works for any
   combination without hand-mapping every weird name. */
const COLOR_HEX = {
  black: "#15181c", white: "#f0f0f0", silver: "#c5cad0", chrome: "#cfd3d7",
  gunmetal: "#4b5157", gold: "#c2a04e", bronze: "#8a5a2b", copper: "#9a5b33",
  tortoise: "#6a4326", gray: "#8c8c8c", grey: "#8c8c8c", smoke: "#565a5e",
  clear: "#e6e6e6", yellow: "#d8c24a", green: "#3f6b4f", blue: "#3a5d8f",
  purple: "#6a5a86", pink: "#d6a3ac", brown: "#6b4a2f", orange: "#c2702e",
  amber: "#b06a2c", red: "#b23b30"
};
const COLOR_MODIFIERS = new Set([
  "glossy", "gloss", "matte", "matt", "dark", "light", "pl", "hd",
  "mirror", "mirrored", "tinted", "tint", "polarized", "polarised",
  "solid", "metallic", "shiny", "flash", "revo"
]);

/* → up to two hex colours: [frame] or [frame, lens] */
function nameToColors(name) {
  const toks = name.toLowerCase().replace(/[\/\-]/g, " ").split(/\s+/).filter(Boolean);
  const out = [];
  for (const t of toks) {
    if (COLOR_MODIFIERS.has(t)) continue;
    const hex = COLOR_HEX[t];
    if (hex && out[out.length - 1] !== hex) out.push(hex);
    if (out.length === 2) break;
  }
  if (out.length === 0) out.push("#9aa0a6");
  return out;
}

/* a small circular chip: solid for one colour, split frame|lens for two */
function swatchChip(name) {
  const c = nameToColors(name);
  const inner = c.length === 1
    ? `<span class="w-full h-full bg-[${c[0]}]"></span>`
    : `<span class="w-1/2 h-full bg-[${c[0]}]"></span><span class="w-1/2 h-full bg-[${c[1]}]"></span>`;
  return `<span class="w-3.5 h-3.5 rounded-full border border-grey-300 overflow-hidden inline-flex shrink-0" title="${name}">${inner}</span>`;
}

function priceFmt(cents) {
  const d = cents / 100;
  return d % 1 === 0 ? "$" + d : "$" + d.toFixed(2);
}

function productCard(p) {
  const swatches = p.colors.slice(0, 4).map(swatchChip).join("");
  const extra = p.colors.length > 4
    ? `<span class="text-2xs text-grey-500 ml-1 self-center">+${p.colors.length - 4}</span>` : "";
  const onSale = p.compareAtCents && p.compareAtCents > p.priceCents;
  const isBestSeller = p.unitsSold >= BESTSELLER_CUTOFF;
  const priceHTML = onSale
    ? `<span class="text-grey-500 line-through mr-1.5">${priceFmt(p.compareAtCents)}</span><span class="text-sale">${priceFmt(p.priceCents)}</span>`
    : `<span class="text-grey-700">${priceFmt(p.priceCents)}${p.maxCents ? "–" + priceFmt(p.maxCents) : ""}</span>`;
  const saleBadge = onSale
    ? `<span class="absolute top-3 right-3 bg-sale text-paper text-2xs uppercase tracking-wide font-medium px-2 py-1">Sale</span>`
    : "";
  const bestBadge = isBestSeller
    ? `<span class="absolute top-3 left-3 whitespace-nowrap bg-paper/90 backdrop-blur-sm text-ink border border-grey-200 text-2xs uppercase tracking-wider font-medium px-2.5 py-1">Best Seller</span>`
    : "";
  const badge = bestBadge + saleBadge;
  return `<a href="product.html" class="group block">
    <div class="relative bg-grey-100 aspect-[4/5] overflow-hidden flex items-center justify-center p-5">
      <img src="${p.image}" alt="${p.name}" loading="lazy" class="w-full h-full object-contain mix-blend-multiply transition-transform duration-[420ms] ease-standard group-hover:scale-[1.04]">
      ${badge}
    </div>
    <div class="mt-3.5">
      <div class="flex items-start justify-between gap-2">
        <p class="text-base">${p.name}</p>
        <button type="button" onclick="event.preventDefault()" class="shrink-0 grid place-items-center text-ink hover:opacity-60 transition-opacity duration-200" aria-label="Save ${p.name}">
          <svg class="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
        </button>
      </div>
      <p class="text-base mt-1">${priceHTML}</p>
      <div class="flex items-center gap-1.5 mt-2.5">${swatches}${extra}</div>
    </div>
  </a>`;
}

function renderGrid(id, list) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = list.map(productCard).join("");
}



/* remove a line item (bag / saved slide-out) */
function removeLineItem(btn) {
  const row = btn.closest('.flex.gap-4');
  if (row) row.remove();
}
