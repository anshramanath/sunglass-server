/* @ds-bundle: {"format":3,"namespace":"AritziaDesignSystem_fb1eba","components":[{"name":"Ladybug","sourcePath":"components/brand/Ladybug.jsx"},{"name":"Wordmark","sourcePath":"components/brand/Wordmark.jsx"},{"name":"ColorSwatches","sourcePath":"components/commerce/ColorSwatches.jsx"},{"name":"PriceTag","sourcePath":"components/commerce/PriceTag.jsx"},{"name":"ProductCard","sourcePath":"components/commerce/ProductCard.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Eyebrow","sourcePath":"components/core/Eyebrow.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"Tag","sourcePath":"components/core/Tag.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"SizeSelect","sourcePath":"components/forms/SizeSelect.jsx"},{"name":"ToggleGroup","sourcePath":"components/forms/ToggleGroup.jsx"}],"sourceHashes":{"components/brand/Ladybug.jsx":"536fe03fbc0d","components/brand/Wordmark.jsx":"7e09052217b0","components/commerce/ColorSwatches.jsx":"ef1eb134573c","components/commerce/PriceTag.jsx":"0e59f590c53b","components/commerce/ProductCard.jsx":"a7e0ea277ac6","components/core/Button.jsx":"2c21b3bf689a","components/core/Eyebrow.jsx":"efa96edcb5f1","components/core/IconButton.jsx":"585189fbd883","components/core/Tag.jsx":"f983f0e41240","components/forms/Input.jsx":"24d7191f85ec","components/forms/SizeSelect.jsx":"119ddf5ed393","components/forms/ToggleGroup.jsx":"40954fdfdd29","ui_kits/aritzia_web/BagScreen.jsx":"643f395f2409","ui_kits/aritzia_web/Footer.jsx":"e931e8a0e267","ui_kits/aritzia_web/HomeScreen.jsx":"a5eff8af16cc","ui_kits/aritzia_web/PdpScreen.jsx":"a26a064ba836","ui_kits/aritzia_web/PlpScreen.jsx":"6b4e66dc7687","ui_kits/aritzia_web/SignInScreen.jsx":"a3426d46e1ae","ui_kits/aritzia_web/TopNav.jsx":"54b555f9fcef","ui_kits/aritzia_web/data.js":"ee1e761ad579","ui_kits/aritzia_web/helpers.jsx":"1226b656cf2c"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.AritziaDesignSystem_fb1eba = window.AritziaDesignSystem_fb1eba || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/brand/Ladybug.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Aritzia Ladybug — the brand mascot, rendered from the image asset.
 * Use `tone="black"` on light surfaces (footer is dark, so use "white"
 * there). Never redraw the bug; always render the asset.
 */
function Ladybug({
  tone = "black",
  size = 40,
  src,
  alt = "Aritzia ladybug",
  style,
  ...rest
}) {
  const asset = src || (tone === "white" ? "assets/ladybug-white.png" : "assets/ladybug-black.png");
  return /*#__PURE__*/React.createElement("img", _extends({
    src: asset,
    alt: alt,
    style: {
      height: size,
      width: "auto",
      display: "block",
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { Ladybug });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Ladybug.jsx", error: String((e && e.message) || e) }); }

// components/brand/Wordmark.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Aritzia Wordmark — the ARITZIA logo. Rendered from the image asset so
 * the custom serif stays accurate. `tone` picks the black or white cut.
 * `src` lets you point at a relative copy of the asset if your file sits
 * elsewhere than the design-system root.
 */
function Wordmark({
  tone = "black",
  height = 26,
  src,
  alt = "Aritzia",
  style,
  ...rest
}) {
  const asset = src || (tone === "white" ? "assets/aritzia-wordmark-white.png" : "assets/aritzia-wordmark-black.png");
  return /*#__PURE__*/React.createElement("img", _extends({
    src: asset,
    alt: alt,
    style: {
      height,
      width: "auto",
      display: "block",
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { Wordmark });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Wordmark.jsx", error: String((e && e.message) || e) }); }

// components/commerce/ColorSwatches.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Aritzia ColorSwatches — the row of small circular colour chips under a
 * product. Selectable, with a "+N" overflow when a style has more colours
 * than `max`. A swatch value can be a CSS colour or an image URL (prints).
 */
function ColorSwatches({
  colors = [],
  max = 5,
  selectedIndex = 0,
  size = 16,
  onSelect,
  style,
  ...rest
}) {
  const shown = colors.slice(0, max);
  const overflow = colors.length - shown.length;
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      ...style
    }
  }, rest), shown.map((c, i) => {
    const isImg = typeof c.value === "string" && (c.value.includes("/") || c.value.includes("."));
    const selected = i === selectedIndex;
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      "aria-label": c.name,
      title: c.name,
      onClick: () => onSelect && onSelect(i),
      style: {
        width: size,
        height: size,
        padding: 0,
        borderRadius: "var(--radius-circle)",
        background: isImg ? `center/cover url(${c.value})` : c.value,
        border: "1px solid var(--grey-300)",
        boxShadow: selected ? "0 0 0 1px var(--aritzia-white), 0 0 0 2px var(--aritzia-black)" : "none",
        cursor: "pointer",
        flex: "none",
        boxSizing: "border-box"
      }
    });
  }), overflow > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "13px",
      color: "var(--color-text)",
      marginLeft: "2px"
    }
  }, "+", overflow));
}
Object.assign(__ds_scope, { ColorSwatches });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/commerce/ColorSwatches.jsx", error: String((e && e.message) || e) }); }

// components/commerce/PriceTag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Aritzia PriceTag — plain text pricing. On markdown, the original is
 * struck through in grey and the sale price follows in red. Supports a
 * range ("$44.99 - $48.99") for multi-variant styles.
 */
function PriceTag({
  price,
  compareAt,
  size = "base",
  style,
  ...rest
}) {
  const fontSize = size === "lg" ? "21px" : size === "sm" ? "13px" : "15px";
  const onSale = compareAt != null;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      fontFamily: "var(--font-sans)",
      fontSize,
      fontWeight: "var(--fw-regular)",
      color: "var(--color-text)",
      display: "inline-flex",
      gap: "8px",
      alignItems: "baseline",
      ...style
    }
  }, rest), onSale && /*#__PURE__*/React.createElement("span", {
    style: {
      textDecoration: "line-through",
      color: "var(--grey-500)"
    }
  }, compareAt), /*#__PURE__*/React.createElement("span", {
    style: {
      color: onSale ? "var(--color-text-sale)" : "var(--color-text)"
    }
  }, price));
}
Object.assign(__ds_scope, { PriceTag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/commerce/PriceTag.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Aritzia Button — sharp-cornered, monochrome.
 * primary  : solid black, white text (Add to Bag, Sign In)
 * secondary: white, 1px black border (Sign in with a Code)
 * ghost    : underlined text link (Shop Now)
 */
function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  href,
  children,
  style,
  ...rest
}) {
  const pads = {
    sm: "10px 18px",
    md: "15px 26px",
    lg: "18px 30px"
  };
  const fontSize = size === "sm" ? "13px" : "15px";
  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    width: fullWidth ? "100%" : "auto",
    padding: variant === "ghost" ? 0 : pads[size],
    fontFamily: "var(--font-sans)",
    fontSize: variant === "ghost" ? "15px" : fontSize,
    fontWeight: "var(--fw-medium)",
    lineHeight: 1.1,
    letterSpacing: "var(--tracking-wide)",
    borderRadius: "var(--radius-none)",
    border: "1px solid transparent",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.4 : 1,
    transition: "background var(--dur-fast) var(--ease-standard), opacity var(--dur-fast) var(--ease-standard)",
    textDecoration: "none",
    boxSizing: "border-box",
    WebkitFontSmoothing: "antialiased"
  };
  const variants = {
    primary: {
      background: "var(--color-action)",
      color: "var(--color-action-text)",
      borderColor: "var(--color-action)"
    },
    secondary: {
      background: "var(--aritzia-white)",
      color: "var(--aritzia-black)",
      borderColor: "var(--aritzia-black)"
    },
    ghost: {
      background: "transparent",
      color: "var(--aritzia-black)",
      borderColor: "transparent",
      textDecoration: "underline",
      textUnderlineOffset: "4px",
      textDecorationThickness: "1px",
      letterSpacing: "var(--tracking-normal)"
    }
  };
  const styles = {
    ...base,
    ...variants[variant],
    ...style
  };
  const Tag = href ? "a" : "button";
  return /*#__PURE__*/React.createElement(Tag, _extends({
    href: href,
    disabled: href ? undefined : disabled,
    style: styles,
    onMouseEnter: e => {
      if (disabled) return;
      if (variant === "primary") e.currentTarget.style.background = "var(--color-action-hover)";
      if (variant === "secondary") {
        e.currentTarget.style.background = "var(--aritzia-black)";
        e.currentTarget.style.color = "var(--aritzia-white)";
      }
      if (variant === "ghost") e.currentTarget.style.opacity = "0.6";
    },
    onMouseLeave: e => {
      if (variant === "primary") e.currentTarget.style.background = "var(--color-action)";
      if (variant === "secondary") {
        e.currentTarget.style.background = "var(--aritzia-white)";
        e.currentTarget.style.color = "var(--aritzia-black)";
      }
      if (variant === "ghost") e.currentTarget.style.opacity = "1";
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Eyebrow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Aritzia Eyebrow — the tiny uppercase, wide-tracked label that sits
 * above a collection headline ("The Al Fresco Collection") or heads a
 * footer column ("Get Help"). The only place uppercase is allowed.
 */
function Eyebrow({
  children,
  inverse = false,
  as = "div",
  style,
  ...rest
}) {
  const Tag = as;
  return /*#__PURE__*/React.createElement(Tag, _extends({
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "13px",
      fontWeight: "var(--fw-medium)",
      letterSpacing: "0.10em",
      textTransform: "uppercase",
      color: inverse ? "var(--color-text-inverse)" : "var(--color-text)",
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Eyebrow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Eyebrow.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Aritzia IconButton — a bare hairline-icon control (search, bag,
 * bookmark, nav actions). Pass a Lucide/SVG node as children.
 * `round` gives the circular play/pause style control.
 */
function IconButton({
  label,
  round = false,
  size = 24,
  badge,
  children,
  style,
  ...rest
}) {
  const box = round ? 44 : size + 16;
  return /*#__PURE__*/React.createElement("button", _extends({
    "aria-label": label,
    title: label,
    style: {
      position: "relative",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: box,
      height: box,
      padding: 0,
      color: "var(--aritzia-black)",
      background: "transparent",
      border: round ? "1px solid currentColor" : "none",
      borderRadius: round ? "var(--radius-pill)" : "var(--radius-none)",
      cursor: "pointer",
      transition: "opacity var(--dur-fast) var(--ease-standard)",
      ...style
    },
    onMouseEnter: e => e.currentTarget.style.opacity = "0.6",
    onMouseLeave: e => e.currentTarget.style.opacity = "1"
  }, rest), children, badge != null && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: 2,
      right: 2,
      minWidth: 16,
      height: 16,
      padding: "0 4px",
      background: "var(--aritzia-black)",
      color: "var(--aritzia-white)",
      fontSize: 10,
      fontWeight: "var(--fw-medium)",
      lineHeight: "16px",
      textAlign: "center",
      borderRadius: "var(--radius-pill)"
    }
  }, badge));
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/core/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Aritzia Tag — the small merchandising / status label that sits on
 * product imagery ("Deeper Markdown", "3 Heights", "New", "Styled").
 * White chip, sharp corners, sentence case. `tone="solid"` flips to
 * black-on-white for stronger callouts.
 */
function Tag({
  children,
  tone = "light",
  style,
  ...rest
}) {
  const tones = {
    light: {
      background: "var(--aritzia-white)",
      color: "var(--aritzia-black)",
      border: "none"
    },
    outline: {
      background: "transparent",
      color: "var(--aritzia-black)",
      border: "1px solid var(--aritzia-black)"
    },
    solid: {
      background: "var(--aritzia-black)",
      color: "var(--aritzia-white)",
      border: "none"
    }
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      padding: "5px 10px",
      fontFamily: "var(--font-sans)",
      fontSize: "12px",
      fontWeight: "var(--fw-regular)",
      lineHeight: 1,
      letterSpacing: "0.01em",
      borderRadius: "var(--radius-none)",
      whiteSpace: "nowrap",
      ...tones[tone],
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tag.jsx", error: String((e && e.message) || e) }); }

// components/commerce/ProductCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Aritzia ProductCard — the PLP / carousel tile. Image on a grey studio
 * sweep with an optional corner tag and a bookmark/save control, then the
 * product name, price, and colour swatches beneath. No border, no shadow,
 * no rounding — editorial restraint.
 */
function ProductCard({
  image,
  name,
  price,
  compareAt,
  tag,
  colors,
  brand,
  saved = false,
  onSave,
  onSelectColor,
  selectedColor = 0,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      fontFamily: "var(--font-sans)",
      display: "flex",
      flexDirection: "column",
      ...style
    },
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false)
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      background: "var(--color-surface-product)",
      aspectRatio: "77 / 100",
      overflow: "hidden"
    }
  }, image && /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: name,
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block"
    }
  }), tag && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 12,
      bottom: 12
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Tag, null, tag)), /*#__PURE__*/React.createElement("button", {
    "aria-label": saved ? "Saved" : "Save",
    onClick: onSave,
    style: {
      position: "absolute",
      top: 12,
      right: 12,
      width: 28,
      height: 28,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      background: "transparent",
      border: "none",
      cursor: "pointer",
      padding: 0,
      opacity: hover || saved ? 1 : 0.85
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: saved ? "currentColor" : "none",
    stroke: "currentColor",
    strokeWidth: "1.5"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      paddingTop: 12,
      display: "flex",
      flexDirection: "column",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", null, brand && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "var(--color-text-muted)",
      marginBottom: 2
    }
  }, brand), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      lineHeight: 1.3
    }
  }, name))), /*#__PURE__*/React.createElement(__ds_scope.PriceTag, {
    price: price,
    compareAt: compareAt
  }), colors && colors.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 2
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.ColorSwatches, {
    colors: colors,
    selectedIndex: selectedColor,
    onSelect: onSelectColor
  }))));
}
Object.assign(__ds_scope, { ProductCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/commerce/ProductCard.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Aritzia Input — sharp-cornered text field. `underline` gives the
 * borderless search style (border-bottom only) used in the nav/search.
 * Default is the boxed field used in forms (email signup, sign-in).
 */
function Input({
  variant = "box",
  type = "text",
  placeholder,
  trailing,
  style,
  inputStyle,
  ...rest
}) {
  const box = variant === "box";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      width: "100%",
      background: box ? "var(--aritzia-white)" : "transparent",
      border: box ? "1px solid var(--color-border-input)" : "none",
      borderBottom: box ? "1px solid var(--color-border-input)" : "1px solid var(--aritzia-black)",
      borderRadius: "var(--radius-none)",
      padding: box ? "0 16px" : "0 0 8px",
      ...style
    }
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: type,
    placeholder: placeholder,
    style: {
      flex: 1,
      height: box ? "48px" : "auto",
      border: "none",
      outline: "none",
      background: "transparent",
      fontFamily: "var(--font-sans)",
      fontSize: "15px",
      color: "var(--color-text)",
      letterSpacing: variant === "underline" ? "0.06em" : "0",
      ...inputStyle
    }
  }, rest)), trailing);
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/SizeSelect.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Aritzia SizeSelect — the full-width "Select a Size" dropdown trigger on
 * the PDP. Sharp box, chevron at the right. This is the closed trigger
 * (presentational); wire your own menu/popover for the open state.
 */
function SizeSelect({
  label = "Select a Size",
  value,
  onClick,
  disabled = false,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("button", _extends({
    onClick: onClick,
    disabled: disabled,
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      padding: "0 18px",
      height: "54px",
      background: "var(--aritzia-white)",
      border: "1px solid var(--color-border-input)",
      borderRadius: "var(--radius-none)",
      fontFamily: "var(--font-sans)",
      fontSize: "15px",
      color: value ? "var(--color-text)" : "var(--color-text)",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", null, value || label), /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6 9l6 6 6-6"
  })));
}
Object.assign(__ds_scope, { SizeSelect });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/SizeSelect.jsx", error: String((e && e.message) || e) }); }

// components/forms/ToggleGroup.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Aritzia ToggleGroup — segmented choice where the selected option fills
 * solid black and the rest stay outlined ("Deliver to Me" / "Pick Up In
 * Store"). Sharp corners, sits flush as a row.
 */
function ToggleGroup({
  options = [],
  value,
  onChange,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "inline-flex",
      gap: "8px",
      ...style
    }
  }, rest), options.map(opt => {
    const val = typeof opt === "string" ? opt : opt.value;
    const label = typeof opt === "string" ? opt : opt.label;
    const selected = val === value;
    return /*#__PURE__*/React.createElement("button", {
      key: val,
      onClick: () => onChange && onChange(val),
      style: {
        padding: "11px 18px",
        fontFamily: "var(--font-sans)",
        fontSize: "14px",
        fontWeight: "var(--fw-medium)",
        lineHeight: 1,
        letterSpacing: "0.02em",
        borderRadius: "var(--radius-none)",
        cursor: "pointer",
        border: "1px solid var(--aritzia-black)",
        background: selected ? "var(--aritzia-black)" : "var(--aritzia-white)",
        color: selected ? "var(--aritzia-white)" : "var(--aritzia-black)",
        transition: "background var(--dur-fast) var(--ease-standard)"
      }
    }, label);
  }));
}
Object.assign(__ds_scope, { ToggleGroup });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/ToggleGroup.jsx", error: String((e && e.message) || e) }); }

// ui_kits/aritzia_web/BagScreen.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Aritzia UI kit — BagScreen */
function BagScreen({
  bag,
  onNavigate,
  onOpenProduct,
  onRemove
}) {
  const {
    Button,
    PriceTag,
    ProductCard
  } = window.AritziaDesignSystem_fb1eba;
  const essentials = window.AZ.products.slice(3, 9);
  const hasItems = bag && bag.length > 0;
  const parsePrice = s => parseFloat(String(s).replace(/[^0-9.]/g, "")) || 0;
  const subtotal = hasItems ? bag.reduce((sum, it) => sum + parsePrice(it.price), 0) : 0;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 40px 80px"
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 26,
      fontWeight: 400,
      margin: "40px 0 18px"
    }
  }, "My Bag"), !hasItems ? /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: 120
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 15
    }
  }, "You haven't put any items in your bag."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 15,
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => onNavigate("plp"),
    className: "az-link",
    style: {
      fontSize: 15,
      background: "none",
      border: "none",
      cursor: "pointer",
      padding: 0,
      fontFamily: "var(--font-sans)"
    }
  }, "Start Shopping"), /*#__PURE__*/React.createElement("span", {
    style: {
      margin: "0 6px"
    }
  }, "or"), /*#__PURE__*/React.createElement("button", {
    onClick: () => onNavigate("signin"),
    className: "az-link",
    style: {
      fontSize: 15,
      background: "none",
      border: "none",
      cursor: "pointer",
      padding: 0,
      fontFamily: "var(--font-sans)"
    }
  }, "Sign In"))) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 360px",
      gap: 48,
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement("div", null, bag.map((it, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      gap: 20,
      padding: "20px 0",
      borderBottom: "1px solid var(--grey-150)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 120,
      aspectRatio: "3/4",
      background: "var(--grey-100)",
      overflow: "hidden",
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: it.image,
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      objectPosition: "center 20%"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "var(--grey-600)"
    }
  }, it.brand), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      marginTop: 2
    }
  }, it.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: "var(--grey-600)",
      marginTop: 10
    }
  }, "Size ", it.size, " \xB7 ", (it.colors || [])[it.colorIdx]?.name || "Bright White")), /*#__PURE__*/React.createElement(PriceTag, {
    price: it.price,
    compareAt: it.compareAt
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => onRemove && onRemove(i),
    className: "az-link",
    style: {
      fontSize: 13,
      color: "var(--grey-600)",
      marginTop: 16,
      background: "none",
      border: "none",
      cursor: "pointer",
      padding: 0,
      fontFamily: "var(--font-sans)"
    }
  }, "Remove"))))), /*#__PURE__*/React.createElement("aside", {
    style: {
      position: "sticky",
      top: 130,
      border: "1px solid var(--grey-200)",
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      fontSize: 15,
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("span", null, "Subtotal"), /*#__PURE__*/React.createElement("span", null, "$", subtotal.toFixed(2))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      fontSize: 14,
      color: "var(--grey-600)",
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement("span", null, "Shipping"), /*#__PURE__*/React.createElement("span", null, "Calculated at checkout")), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    fullWidth: true
  }, "Checkout"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13,
      color: "var(--grey-600)",
      marginTop: 14,
      textAlign: "center"
    }
  }, "From ", /*#__PURE__*/React.createElement("b", null, "$15/month"), " with Klarna"))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: "var(--grey-50)",
      margin: "56px -40px 0",
      padding: "44px 40px"
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 21,
      fontWeight: 500,
      marginBottom: 22
    }
  }, "Add these essential styles"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridAutoFlow: "column",
      gridAutoColumns: "minmax(220px, 1fr)",
      gap: 6,
      overflowX: "auto",
      paddingBottom: 8
    }
  }, essentials.map(p => /*#__PURE__*/React.createElement(ProductCard, _extends({
    key: p.id
  }, p, {
    onClick: () => onOpenProduct(p),
    style: {
      cursor: "pointer"
    }
  }))))));
}
window.BagScreen = BagScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/aritzia_web/BagScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/aritzia_web/Footer.jsx
try { (() => {
/* Aritzia UI kit — Footer (tall black block) */
function Footer() {
  const {
    Input,
    Eyebrow,
    Ladybug
  } = window.AritziaDesignSystem_fb1eba;
  const AZIcon = window.AZIcon;
  const colAritzia = ["About Us", "Careers", "Impact", "Investor Relations", "Media Room", "Store Locator", "Fabric Care", "Accessibility", "Gift Cards", "Find a List", "Our Services"];
  const colHelp = ["Contact Us", "Size Guide", "Shipping", "Returns & Exchanges", "Payment & Security", "Order Tracking", "Promotion Details", "Special Orders", "Statement Regarding Modern Slavery", "Give Website Feedback", "Klarna"];
  const link = {
    fontSize: 18,
    color: "#fff",
    padding: "8px 0",
    display: "block",
    textDecoration: "none",
    cursor: "pointer",
    fontFamily: "var(--font-sans)"
  };
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: "var(--aritzia-black)",
      color: "#fff",
      padding: "72px 40px 40px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1.4fr 1fr 1fr",
      gap: 40
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 460
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    inverse: true
  }, "Join Aritzia's Mailing List"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 16,
      marginTop: 18,
      marginBottom: 20
    }
  }, "Insider info on sales, new arrivals and more good stuff."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 0
    }
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "Email Address",
    style: {
      background: "#fff",
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("button", {
    "aria-label": "Subscribe",
    style: {
      width: 56,
      height: 50,
      background: "#f1f1f1",
      border: "none",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(AZIcon, {
    name: "ArrowRight",
    size: 18,
    color: "#111"
  }))), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13,
      color: "var(--grey-400)",
      marginTop: 18,
      lineHeight: 1.5
    }
  }, "Don't worry, you can unsubscribe from our mailing list at any time. Emails will be sent by United States of Aritzia Inc. | 611 Alexander St. Vancouver BC V6A 1E1 |"), /*#__PURE__*/React.createElement("a", {
    className: "az-link",
    style: {
      color: "#fff",
      fontSize: 13,
      display: "inline-block",
      marginTop: 6
    }
  }, "Privacy Policy"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 22,
      marginTop: 30
    }
  }, ["Music2", "Instagram", "Image", "Youtube"].map((n, i) => /*#__PURE__*/React.createElement(AZIcon, {
    key: i,
    name: ["Music2", "Instagram", "Aperture", "Youtube"][i],
    size: 20,
    color: "#fff"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 28,
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      background: "#000",
      border: "1px solid #555",
      borderRadius: 6,
      padding: "8px 14px"
    }
  }, /*#__PURE__*/React.createElement(AZIcon, {
    name: "Apple",
    size: 20,
    color: "#fff"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13
    }
  }, "Download on the App Store"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, {
    inverse: true
  }, "Aritzia"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14
    }
  }, colAritzia.map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    style: link
  }, l)))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, {
    inverse: true
  }, "Get Help"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14
    }
  }, colHelp.map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    style: link
  }, l))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      marginTop: 56,
      fontSize: 15
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 18
    }
  }, "\uD83C\uDDFA\uD83C\uDDF8"), " USA ($USD) ", /*#__PURE__*/React.createElement(AZIcon, {
    name: "ChevronDown",
    size: 16,
    color: "#fff"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 18,
      paddingTop: 4,
      flexWrap: "wrap",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 26,
      fontSize: 13,
      color: "var(--grey-300)"
    }
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 2026 Aritzia LP"), ["Privacy Policy", "Do Not Sell or Share My Personal Information", "Terms of Use", "Site Map"].map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    className: "az-link",
    style: {
      color: "var(--grey-300)"
    }
  }, l))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12,
      alignItems: "center",
      opacity: 0.9
    }
  }, ["Mastercard", "Visa", "Amex", "PayPal", "Apple Pay", "Klarna"].map(p => /*#__PURE__*/React.createElement("span", {
    key: p,
    style: {
      fontSize: 11,
      color: "#fff",
      border: "1px solid #555",
      padding: "3px 6px",
      borderRadius: 3
    }
  }, p)))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 28
    }
  }, /*#__PURE__*/React.createElement(Ladybug, {
    tone: "white",
    size: 44,
    src: "../../assets/ladybug-white.png"
  })));
}
window.Footer = Footer;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/aritzia_web/Footer.jsx", error: String((e && e.message) || e) }); }

// ui_kits/aritzia_web/HomeScreen.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Aritzia UI kit — HomeScreen */
function HomeScreen({
  onNavigate,
  onOpenProduct
}) {
  const {
    Eyebrow,
    ProductCard,
    Button
  } = window.AritziaDesignSystem_fb1eba;
  const AZIcon = window.AZIcon;
  const products = window.AZ.products;
  const Hero = () => /*#__PURE__*/React.createElement("section", {
    style: {
      position: "relative",
      height: 660,
      overflow: "hidden",
      background: "#000"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/hero-summer.jpg",
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: window.AZ.scrimBottom
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 56,
      bottom: 70,
      color: "#fff"
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    inverse: true,
    style: {
      opacity: 0.92
    }
  }, "The Al Fresco Collection"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 64,
      margin: "6px 0 14px",
      fontWeight: 400,
      letterSpacing: "-0.01em",
      color: "#fff"
    }
  }, "Summer Heat"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 16,
      maxWidth: 440,
      color: "#fff",
      marginBottom: 14
    }
  }, "It's hot out. Better wear these sunny HomeStretch\u2122 sets and your new favourite shorts."), /*#__PURE__*/React.createElement("button", {
    onClick: () => onNavigate("plp"),
    className: "az-link",
    style: {
      color: "#fff",
      fontSize: 16,
      background: "none",
      border: "none",
      padding: 0,
      cursor: "pointer"
    }
  }, "Shop Now")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      right: 40,
      bottom: 40,
      display: "flex",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 40,
      height: 40,
      borderRadius: "50%",
      border: "1px solid #fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(AZIcon, {
    name: "VolumeX",
    size: 16,
    color: "#fff"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 40,
      height: 40,
      borderRadius: "50%",
      border: "1px solid #fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(AZIcon, {
    name: "Pause",
    size: 16,
    color: "#fff"
  }))));
  const SplitTile = ({
    image,
    title,
    copy,
    flip
  }) => /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 720,
      overflow: "hidden",
      background: "var(--grey-100)"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: image,
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      objectPosition: flip ? "center 20%" : "center 30%"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: window.AZ.scrimBottom
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 40,
      bottom: 44,
      right: 40,
      color: "#fff"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 40,
      fontWeight: 400,
      color: "#fff",
      marginBottom: 10
    }
  }, title), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 15,
      color: "#fff",
      marginBottom: 10,
      maxWidth: 420
    }
  }, copy), /*#__PURE__*/React.createElement("button", {
    onClick: () => onNavigate("plp"),
    className: "az-link",
    style: {
      color: "#fff",
      fontSize: 15,
      background: "none",
      border: "none",
      padding: 0,
      cursor: "pointer"
    }
  }, "Shop Now")));
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Hero, null), /*#__PURE__*/React.createElement("section", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 4,
      padding: "64px 0"
    }
  }, [{
    p: products[8],
    label: "New"
  }, {
    p: products[5],
    label: "Wardrobe Essentials"
  }, {
    p: products[1],
    label: "T-Shirts & Tanks"
  }].map(({
    p,
    label
  }) => /*#__PURE__*/React.createElement("button", {
    key: label,
    onClick: () => onNavigate("plp"),
    style: {
      background: "none",
      border: "none",
      cursor: "pointer",
      textAlign: "left",
      padding: "0 24px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--grey-100)",
      aspectRatio: "1/1",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: p.image,
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      objectPosition: "center 22%"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 17,
      marginTop: 16
    }
  }, label)))), /*#__PURE__*/React.createElement("section", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 4
    }
  }, /*#__PURE__*/React.createElement(SplitTile, {
    image: "../../assets/editorial-going-out.jpg",
    title: "Going Out",
    copy: "Pause for a moment of sleekness. Then step into new Contour."
  }), /*#__PURE__*/React.createElement(SplitTile, {
    image: "../../assets/product-lodge-pant.jpg",
    title: "Shorts",
    copy: "More summer staples in your wardrobe. More sun on your legs this season.",
    flip: true
  })), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: "96px 56px 80px"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 56,
      fontWeight: 400,
      letterSpacing: "-0.01em",
      lineHeight: 1.05
    }
  }, "Deeper Markdowns Added.", /*#__PURE__*/React.createElement("br", null), "30\u201350% Off. Warm Up Sale."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 16,
      marginTop: 28
    }
  }, "Select styles."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 22,
      marginTop: 6
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => onNavigate("plp"),
    className: "az-link",
    style: {
      fontSize: 16,
      background: "none",
      border: "none",
      padding: 0,
      cursor: "pointer"
    }
  }, "Shop Sale"), /*#__PURE__*/React.createElement("button", {
    className: "az-link",
    style: {
      fontSize: 16,
      background: "none",
      border: "none",
      padding: 0,
      cursor: "pointer"
    }
  }, "Details"))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: "0 40px 96px"
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 21,
      fontWeight: 500,
      marginBottom: 22,
      letterSpacing: 0
    }
  }, "Picked Just For You"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridAutoFlow: "column",
      gridAutoColumns: "minmax(230px, 1fr)",
      gap: 6,
      overflowX: "auto",
      paddingBottom: 8
    }
  }, products.slice(0, 6).map(p => /*#__PURE__*/React.createElement(ProductCard, _extends({
    key: p.id
  }, p, {
    onClick: () => onOpenProduct(p),
    style: {
      cursor: "pointer"
    }
  }))))));
}
window.HomeScreen = HomeScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/aritzia_web/HomeScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/aritzia_web/PdpScreen.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Aritzia UI kit — PdpScreen */
function PdpScreen({
  product,
  onAddToBag,
  onNavigate
}) {
  const {
    PriceTag,
    ColorSwatches,
    SizeSelect,
    ToggleGroup,
    Button,
    Tag
  } = window.AritziaDesignSystem_fb1eba;
  const f = window.AZ.feature;
  const p = product || f;
  const sizes = p.sizes || f.sizes;
  const [mode, setMode] = React.useState("deliver");
  const [size, setSize] = React.useState(null);
  const [openSize, setOpenSize] = React.useState(false);
  const [colorIdx, setColorIdx] = React.useState(0);
  const [added, setAdded] = React.useState(false);
  const images = [p.image, p.image]; // stacked column (single asset repeated)
  const blurbTitle = p.blurbTitle || f.blurbTitle;
  const blurb = p.blurb || f.blurb;
  const accordions = ["Details", "Size & Fit", "Shipping & Returns", "Write a Review"];
  const addToBag = () => {
    onAddToBag && onAddToBag({
      ...p,
      size: size || "M",
      colorIdx
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 0 80px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "20px 40px",
      fontSize: 13,
      color: "var(--grey-600)"
    }
  }, "All Clothing \u2014 Dresses \u2014 ", p.name), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 4
    }
  }, images.map((src, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      background: "var(--grey-100)",
      aspectRatio: "3/4",
      overflow: "hidden",
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: src,
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      objectPosition: i === 0 ? "center 18%" : "center 60%"
    }
  }), i === 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: 16,
      right: 16,
      width: 36,
      height: 36,
      borderRadius: "50%",
      border: "1px solid var(--aritzia-black)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 12
    }
  }, "\u2758\u2758")))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "8px 56px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "sticky",
      top: 130
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "var(--grey-600)",
      marginBottom: 6
    }
  }, p.brand), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 30,
      fontWeight: 400
    }
  }, p.name), /*#__PURE__*/React.createElement(PriceTag, {
    price: p.price,
    compareAt: p.compareAt,
    size: "lg"
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 15,
      color: "var(--grey-600)",
      marginTop: 8
    }
  }, p.subtitle || f.subtitle), (p.tag || f.tag) && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      background: "var(--grey-75)",
      padding: "5px 10px"
    }
  }, p.tag || f.tag)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: 28,
      fontSize: 14
    }
  }, /*#__PURE__*/React.createElement("span", null, (p.colors || f.colors)[colorIdx]?.name || f.colour), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--grey-500)"
    }
  }, p.sku || f.sku)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement(ColorSwatches, {
    colors: p.colors || f.colors,
    size: 26,
    selectedIndex: colorIdx,
    onSelect: setColorIdx,
    max: 8
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 24,
      fontSize: 14,
      color: "var(--grey-600)"
    }
  }, "Model is 5'10\"/178cm wearing a size S"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      margin: "8px 0 14px"
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "az-link",
    style: {
      fontSize: 14,
      background: "none",
      border: "none",
      cursor: "pointer",
      fontFamily: "var(--font-sans)"
    }
  }, "Find Your Size"), /*#__PURE__*/React.createElement("button", {
    className: "az-link",
    style: {
      fontSize: 14,
      background: "none",
      border: "none",
      cursor: "pointer",
      fontFamily: "var(--font-sans)"
    }
  }, "Size Chart")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement(SizeSelect, {
    value: size,
    onClick: () => setOpenSize(v => !v)
  }), openSize && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      right: 0,
      top: "calc(100% + 4px)",
      background: "#fff",
      border: "1px solid var(--grey-200)",
      boxShadow: "var(--shadow-pop)",
      zIndex: 50
    }
  }, sizes.map(s => /*#__PURE__*/React.createElement("button", {
    key: s,
    onClick: () => {
      setSize(s);
      setOpenSize(false);
    },
    style: {
      display: "block",
      width: "100%",
      textAlign: "left",
      padding: "13px 18px",
      background: "none",
      border: "none",
      borderBottom: "1px solid var(--grey-150)",
      cursor: "pointer",
      fontSize: 15,
      fontFamily: "var(--font-sans)"
    }
  }, s)))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 18
    }
  }, /*#__PURE__*/React.createElement(ToggleGroup, {
    value: mode,
    onChange: setMode,
    options: [{
      label: "Deliver to Me",
      value: "deliver"
    }, {
      label: "Pick Up In Store",
      value: "pickup"
    }]
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    fullWidth: true,
    onClick: addToBag
  }, added ? "Added to Bag ✓" : `Add to Bag — ${p.price.split(" ")[0]}`), /*#__PURE__*/React.createElement("button", {
    "aria-label": "Save",
    style: {
      width: 54,
      border: "1px solid var(--aritzia-black)",
      background: "#fff",
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    style: {
      display: "block",
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"
  })))), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14,
      marginTop: 14
    }
  }, "From ", /*#__PURE__*/React.createElement("b", null, "$15/month"), " or 0% interest with ", /*#__PURE__*/React.createElement("b", null, "Klarna"), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("button", {
    className: "az-link",
    style: {
      fontSize: 14,
      background: "none",
      border: "none",
      cursor: "pointer",
      padding: 0,
      fontFamily: "var(--font-sans)"
    }
  }, "Check purchase power")), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 20,
      fontWeight: 500,
      marginTop: 40
    }
  }, blurbTitle), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 15,
      marginTop: 12,
      lineHeight: 1.55,
      maxWidth: 440
    }
  }, blurb), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 36
    }
  }, accordions.map(a => /*#__PURE__*/React.createElement("button", {
    key: a,
    className: "az-link",
    style: {
      display: "block",
      fontSize: 16,
      padding: "14px 0",
      background: "none",
      border: "none",
      borderTop: "1px solid var(--grey-150)",
      cursor: "pointer",
      fontFamily: "var(--font-sans)",
      width: "100%",
      textAlign: "left"
    }
  }, a)))))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: "72px 40px 0"
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 21,
      fontWeight: 500,
      marginBottom: 22
    }
  }, "If you like ", p.name, ", try these:"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridAutoFlow: "column",
      gridAutoColumns: "minmax(220px, 1fr)",
      gap: 6,
      overflowX: "auto",
      paddingBottom: 8
    }
  }, window.AZ.products.slice(2, 8).map(pp => /*#__PURE__*/React.createElement(window.AritziaDesignSystem_fb1eba.ProductCard, _extends({
    key: pp.id
  }, pp, {
    onClick: () => onNavigate && onNavigate("pdp", pp),
    style: {
      cursor: "pointer"
    }
  }))))));
}
window.PdpScreen = PdpScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/aritzia_web/PdpScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/aritzia_web/PlpScreen.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Aritzia UI kit — PlpScreen (All Clothing) */
function PlpScreen({
  onOpenProduct
}) {
  const {
    ProductCard,
    Tag
  } = window.AritziaDesignSystem_fb1eba;
  const AZIcon = window.AZIcon;
  const products = window.AZ.products;
  const cats = window.AZ.categories;
  const filters = ["Color", "Size", "Product Type", "Fabric", "All Filters"];

  // duplicate list to fill the grid
  const grid = [...products, ...products].slice(0, 12);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 40px 80px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "26px 0 0",
      fontSize: 13,
      color: "var(--grey-600)"
    }
  }, "All Clothing"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "var(--grey-600)"
    }
  }, "Clothing ", /*#__PURE__*/React.createElement("sup", null, "1543")), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 56,
      fontWeight: 400,
      margin: "28px 0 40px",
      letterSpacing: "-0.01em"
    }
  }, "All Clothing"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridAutoFlow: "column",
      gridAutoColumns: "minmax(150px, 1fr)",
      gap: 16,
      overflowX: "auto",
      paddingBottom: 8,
      marginBottom: 36
    }
  }, cats.map((c, i) => /*#__PURE__*/React.createElement("div", {
    key: c.label,
    style: {
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      aspectRatio: "1/1",
      background: "var(--grey-100)",
      overflow: "hidden",
      border: i === 0 ? "1px solid var(--aritzia-black)" : "none"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: c.image,
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      objectPosition: "center 20%"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      marginTop: 10
    }
  }, c.label)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10
    }
  }, filters.map(f => /*#__PURE__*/React.createElement("button", {
    key: f,
    style: {
      fontSize: 14,
      padding: "9px 16px",
      background: "#fff",
      border: "1px solid var(--aritzia-black)",
      cursor: "pointer",
      fontFamily: "var(--font-sans)"
    }
  }, f))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14
    }
  }, "Sort by: ", /*#__PURE__*/React.createElement("button", {
    className: "az-link",
    style: {
      fontWeight: 500,
      background: "none",
      border: "none",
      cursor: "pointer",
      fontSize: 14,
      fontFamily: "var(--font-sans)"
    }
  }, "Recommended \u2304"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: 6
    }
  }, grid.map((p, i) => /*#__PURE__*/React.createElement(ProductCard, _extends({
    key: p.id + i
  }, p, {
    onClick: () => onOpenProduct(p),
    style: {
      cursor: "pointer"
    }
  })))));
}
window.PlpScreen = PlpScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/aritzia_web/PlpScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/aritzia_web/SignInScreen.jsx
try { (() => {
/* Aritzia UI kit — SignInScreen */
function SignInScreen({
  onBack
}) {
  const {
    Button,
    Input,
    Wordmark
  } = window.AritziaDesignSystem_fb1eba;
  const AZIcon = window.AZIcon;
  const benefits = [["KeyRound", "Private Sales"], ["Truck", "Free Shipping"], ["BadgeCheck", "Faster Checkout"], ["Bookmark", "List Curation"]];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      minHeight: "calc(100vh - 64px)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--grey-100)",
      overflow: "hidden",
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/editorial-going-out.jpg",
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 28,
      left: 36
    }
  }, /*#__PURE__*/React.createElement(Wordmark, {
    tone: "white",
    height: 26,
    src: "../../assets/aritzia-wordmark-white.png"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "64px 96px",
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    className: "az-link",
    style: {
      position: "absolute",
      top: 24,
      right: 96,
      fontSize: 14,
      background: "none",
      border: "none",
      cursor: "pointer",
      fontFamily: "var(--font-sans)"
    }
  }, "Need Help?"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 15,
      marginTop: 40,
      marginBottom: 24
    }
  }, "Sign in or Create an Account to enjoy the benefits"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 36,
      marginBottom: 36
    }
  }, benefits.map(([icon, label]) => /*#__PURE__*/React.createElement("div", {
    key: label,
    style: {
      textAlign: "center",
      width: 70
    }
  }, /*#__PURE__*/React.createElement(AZIcon, {
    name: icon,
    size: 26,
    color: "var(--aritzia-black)"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      marginTop: 8,
      lineHeight: 1.3
    }
  }, label)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 14,
      maxWidth: 460
    }
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "Email Address"
  }), /*#__PURE__*/React.createElement(Input, {
    type: "password",
    placeholder: "Password",
    trailing: /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 14,
        paddingLeft: 12,
        cursor: "pointer"
      }
    }, "Show")
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    fullWidth: true
  }, "Sign In"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "az-link",
    style: {
      fontSize: 14,
      background: "none",
      border: "none",
      cursor: "pointer",
      fontFamily: "var(--font-sans)"
    }
  }, "Forgot Password?"), /*#__PURE__*/React.createElement("button", {
    className: "az-link",
    style: {
      fontSize: 14,
      background: "none",
      border: "none",
      cursor: "pointer",
      fontFamily: "var(--font-sans)"
    }
  }, "Create An Account")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10,
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    fullWidth: true
  }, "Sign in with a Code"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    fullWidth: true
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(AZIcon, {
    name: "Facebook",
    size: 18,
    color: "var(--info-blue)"
  }), " Facebook"))))));
}
window.SignInScreen = SignInScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/aritzia_web/SignInScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/aritzia_web/TopNav.jsx
try { (() => {
/* Aritzia UI kit — TopNav (sticky header + mega-menu + search panel) */
function TopNav({
  onNavigate,
  bagCount,
  scrolled,
  onSearch
}) {
  const {
    Wordmark,
    IconButton
  } = window.AritziaDesignSystem_fb1eba;
  const AZIcon = window.AZIcon;
  const [hover, setHover] = React.useState(null);
  const linkStyle = active => ({
    fontSize: 15,
    fontWeight: 500,
    letterSpacing: "0.005em",
    color: "var(--aritzia-black)",
    textDecoration: active ? "underline" : "none",
    textUnderlineOffset: "6px",
    cursor: "pointer",
    background: "none",
    border: "none",
    padding: "6px 0",
    fontFamily: "var(--font-sans)"
  });
  const sweatfleece = {
    "Shop By Category": ["All Sweatfleece", "Sweatpants", "Sweatshirts & Hoodies", "Sweatshorts", "Graphics"],
    "Shop By Colour": ["Milkshake Pink", "Indigo Effect", "Lemonade", "Ripple Blue", "Sweet Pea Purple", "Agave Green", "Nomad Taupe", "Postcard Blue", "Admiral Navy"],
    "Shop By Fit": ["Mega", "Boyfriend", "Perfect", "Snug"],
    "Featured": ["Terry Sweatfleece", "Sweatfleece Guide"]
  };
  return /*#__PURE__*/React.createElement("header", {
    onMouseLeave: () => setHover(null),
    style: {
      position: "sticky",
      top: 0,
      zIndex: 100,
      background: "var(--aritzia-white)",
      borderBottom: "1px solid var(--grey-150)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      padding: scrolled ? "0 40px" : "22px 40px 0",
      transition: "padding .2s"
    }
  }, !scrolled && /*#__PURE__*/React.createElement("button", {
    onClick: () => onNavigate("home"),
    style: {
      background: "none",
      border: "none",
      cursor: "pointer",
      padding: 0
    }
  }, /*#__PURE__*/React.createElement(Wordmark, {
    tone: "black",
    height: 30,
    src: "../../assets/aritzia-wordmark-black.png"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 22
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onSearch,
    "aria-label": "Search",
    style: {
      display: "flex",
      alignItems: "center",
      gap: 14,
      background: "none",
      border: "none",
      cursor: "pointer",
      color: "var(--grey-500)"
    }
  }, /*#__PURE__*/React.createElement(AZIcon, {
    name: "Search",
    size: 18,
    color: "var(--aritzia-black)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      letterSpacing: "0.08em",
      color: "var(--grey-500)"
    }
  }, "SEARCH"), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 360,
      height: 1,
      background: "var(--aritzia-black)"
    }
  })), /*#__PURE__*/React.createElement(IconButton, {
    label: "Bag",
    badge: bagCount || undefined,
    onClick: () => onNavigate("bag")
  }, /*#__PURE__*/React.createElement(AZIcon, {
    name: "ShoppingBag",
    size: 22
  })), /*#__PURE__*/React.createElement(IconButton, {
    label: "Saved"
  }, /*#__PURE__*/React.createElement(AZIcon, {
    name: "Bookmark",
    size: 22
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => onNavigate("signin"),
    style: {
      fontSize: 13,
      letterSpacing: "0.08em",
      background: "none",
      border: "none",
      cursor: "pointer",
      fontFamily: "var(--font-sans)",
      fontWeight: 500
    }
  }, "SIGN IN"))), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: "flex",
      gap: 26,
      padding: "14px 40px 16px"
    }
  }, window.AZ.nav.map(item => /*#__PURE__*/React.createElement("button", {
    key: item,
    style: linkStyle(item === "Clothing"),
    onMouseEnter: () => setHover(item),
    onClick: () => onNavigate(item === "Sweatfleece" ? null : "plp")
  }, item))), hover === "Sweatfleece" && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      right: 0,
      top: "100%",
      background: "#fff",
      borderTop: "1px solid var(--grey-150)",
      boxShadow: "var(--shadow-pop)",
      padding: "32px 40px 44px",
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr) 1.2fr",
      gap: 24,
      zIndex: 200
    }
  }, Object.entries(sweatfleece).map(([head, items]) => /*#__PURE__*/React.createElement("div", {
    key: head
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "var(--grey-500)",
      marginBottom: 16
    }
  }, head), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: "none",
      margin: 0,
      padding: 0,
      display: "flex",
      flexDirection: "column",
      gap: 11
    }
  }, items.map(it => /*#__PURE__*/React.createElement("li", {
    key: it
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => onNavigate("plp"),
    style: {
      fontSize: 17,
      background: "none",
      border: "none",
      cursor: "pointer",
      padding: 0,
      fontFamily: "var(--font-sans)",
      color: "var(--aritzia-black)"
    }
  }, it)))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/product-rib-tank.jpg",
    style: {
      width: "50%",
      aspectRatio: "3/4",
      objectFit: "cover",
      background: "var(--grey-100)"
    }
  }), /*#__PURE__*/React.createElement("img", {
    src: "../../assets/product-interlock-tee.jpg",
    style: {
      width: "50%",
      aspectRatio: "3/4",
      objectFit: "cover",
      background: "var(--grey-100)"
    }
  }))));
}
window.TopNav = TopNav;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/aritzia_web/TopNav.jsx", error: String((e && e.message) || e) }); }

// ui_kits/aritzia_web/data.js
try { (() => {
/* Aritzia UI kit — catalogue data (fake, for the kit only) */
window.AZ = window.AZ || {};
window.AZ.nav = ["New", "Clothing", "Dresses", "Activewear", "Sweatfleece", "Accessories & Shoes", "Discover", "Sale"];
const C = {
  white: {
    name: "Bright White",
    value: "#f1f1ee"
  },
  ecru: {
    name: "Undyed Ecru",
    value: "#e8e3d6"
  },
  black: {
    name: "Black",
    value: "#141414"
  },
  navy: {
    name: "Admiral Navy",
    value: "#1b2a44"
  },
  sky: {
    name: "Ripple Blue",
    value: "#cfe0ef"
  },
  lemon: {
    name: "Lemonade",
    value: "#ede7a3"
  },
  pink: {
    name: "Milkshake Pink",
    value: "#e7b9c3"
  },
  sage: {
    name: "Agave Green",
    value: "#9aa583"
  },
  taupe: {
    name: "Nomad Taupe",
    value: "#b6a890"
  },
  clay: {
    name: "Rich Mocha Brown",
    value: "#7c4a32"
  },
  stripe: {
    name: "Blue Stripe",
    value: "#aebfd2"
  },
  denim: {
    name: "Mid Indigo",
    value: "#5b7196"
  }
};
window.AZ.products = [{
  id: "technique-poplin",
  brand: "Wilfred",
  name: "Technique Poplin Dress",
  price: "$168",
  image: "../../assets/product-technique-poplin.jpg",
  colors: [C.stripe, C.white, C.navy]
}, {
  id: "mason-poplin",
  brand: "Wilfred",
  name: "Mason Poplin Dress",
  price: "$82.80",
  compareAt: "$138",
  tag: "Deeper Markdown",
  image: "../../assets/product-mason-poplin.jpg",
  colors: [C.sky, C.white, C.black, C.pink, C.lemon]
}, {
  id: "technique-linen",
  brand: "Wilfred",
  name: "Technique Linen Dress",
  price: "$168",
  image: "../../assets/product-technique-linen.jpg",
  colors: [C.ecru, C.white, C.black]
}, {
  id: "fluid-poplin",
  brand: "Babaton",
  name: "Fluid Poplin Dress",
  price: "$138",
  image: "../../assets/product-fluid-poplin.jpg",
  colors: [C.black, C.white, C.navy]
}, {
  id: "allegoria",
  brand: "Babaton",
  name: "Allegoria Poplin Dress",
  price: "$148",
  tag: "New",
  image: "../../assets/product-allegoria.jpg",
  colors: [C.navy, C.black, C.ecru]
}, {
  id: "interlock-tee",
  brand: "TNA",
  name: "InterLock Cotton Function T-Shirt",
  price: "$40",
  image: "../../assets/product-interlock-tee.jpg",
  colors: [C.taupe, C.white, C.black, C.sky, C.sage, C.clay, C.pink]
}, {
  id: "lodge-pant",
  brand: "Babaton",
  name: "The Lodge Pant\u2122 - CruiseLinen\u2122",
  price: "$138",
  tag: "3 Heights",
  image: "../../assets/product-lodge-pant.jpg",
  colors: [C.white, C.ecru, C.black, C.clay, C.lemon]
}, {
  id: "pleated-short",
  brand: "Babaton",
  name: "Pleated Mini Short",
  price: "$48.99",
  compareAt: "$98",
  tag: "Deeper Markdown",
  image: "../../assets/product-pleated-short.jpg",
  colors: [C.black, C.taupe, C.white, C.navy, C.ecru]
}, {
  id: "rib-tank",
  brand: "TNA",
  name: "HomeStretch\u2122 Rib Frequency Tank",
  price: "$28",
  image: "../../assets/product-rib-tank.jpg",
  colors: [C.lemon, C.white, C.black, C.pink, C.sky]
}, {
  id: "denim-jean",
  brand: "Denim Forum",
  name: "Denim Forum Sharon Classic Mid-Rise Straight Jean",
  price: "$44.99 - $48.99",
  compareAt: "$90 - $98",
  tag: "Deeper Markdown",
  image: "../../assets/product-denim-jean.jpg",
  colors: [C.denim, C.navy, C.black]
}];

/* The featured PDP product */
window.AZ.feature = {
  id: "eleta-poplin",
  brand: "Wilfred",
  name: "Eleta Poplin Mini Dress",
  price: "$88.80",
  compareAt: "$148",
  sku: "#132045",
  subtitle: "100% cotton poplin shortsleeve mini shirt dress",
  tag: "Trending Near You",
  colour: "Bright White",
  blurbTitle: "To the farmers market you go",
  blurb: "This is a shortsleeve mini shirt dress with a removable self-tie belt. It\u2019s made from 100% cotton poplin with a crisp, airy feel that\u2019s smooth to the touch.",
  image: "../../assets/pdp-eleta-white.jpg",
  colors: [C.stripe, C.white, C.black],
  sizes: ["XXS", "XS", "S", "M", "L", "XL"]
};
window.AZ.categories = [{
  label: "All Clothing",
  image: "../../assets/product-technique-poplin.jpg"
}, {
  label: "Tops & Bodysuits",
  image: "../../assets/product-rib-tank.jpg"
}, {
  label: "Pants",
  image: "../../assets/product-lodge-pant.jpg"
}, {
  label: "Dresses",
  image: "../../assets/product-fluid-poplin.jpg"
}, {
  label: "T-Shirts & Tanks",
  image: "../../assets/product-interlock-tee.jpg"
}, {
  label: "Shorts",
  image: "../../assets/product-pleated-short.jpg"
}];
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/aritzia_web/data.js", error: String((e && e.message) || e) }); }

// ui_kits/aritzia_web/helpers.jsx
try { (() => {
/* Aritzia UI kit — shared helpers */
window.AZ = window.AZ || {};

/* Lucide icon as a React component */
function AZIcon({
  name,
  size = 22,
  stroke = 1.5,
  color = "currentColor",
  style
}) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (ref.current && window.lucide && window.lucide[name]) {
      ref.current.innerHTML = window.lucide.createElement(window.lucide[name], {
        "stroke-width": stroke,
        width: size,
        height: size
      }).outerHTML;
    }
  }, [name, size, stroke]);
  return /*#__PURE__*/React.createElement("span", {
    ref: ref,
    style: {
      display: "inline-flex",
      color,
      ...style
    }
  });
}
window.AZIcon = AZIcon;

/* Small scrim used over imagery for text protection */
window.AZ.scrimBottom = "linear-gradient(0deg, rgba(0,0,0,0.34) 0%, rgba(0,0,0,0) 42%)";
window.AZ.scrimTop = "linear-gradient(180deg, rgba(0,0,0,0.30) 0%, rgba(0,0,0,0) 45%)";
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/aritzia_web/helpers.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Ladybug = __ds_scope.Ladybug;

__ds_ns.Wordmark = __ds_scope.Wordmark;

__ds_ns.ColorSwatches = __ds_scope.ColorSwatches;

__ds_ns.PriceTag = __ds_scope.PriceTag;

__ds_ns.ProductCard = __ds_scope.ProductCard;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Eyebrow = __ds_scope.Eyebrow;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.SizeSelect = __ds_scope.SizeSelect;

__ds_ns.ToggleGroup = __ds_scope.ToggleGroup;

})();
