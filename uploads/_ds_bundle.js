/* @ds-bundle: {"format":4,"namespace":"ClairoCareDesignSystem_7d6804","components":[{"name":"EmptyState","sourcePath":"components/brand/EmptyState.jsx"},{"name":"HeroPanel","sourcePath":"components/brand/HeroPanel.jsx"},{"name":"Logo","sourcePath":"components/brand/Logo.jsx"},{"name":"ProgressRow","sourcePath":"components/brand/ProgressRow.jsx"},{"name":"StatCard","sourcePath":"components/brand/StatCard.jsx"},{"name":"TaskCard","sourcePath":"components/brand/TaskCard.jsx"},{"name":"Avatar","sourcePath":"components/core/Avatar.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"CardHeader","sourcePath":"components/core/Card.jsx"},{"name":"CardTitle","sourcePath":"components/core/Card.jsx"},{"name":"CardDescription","sourcePath":"components/core/Card.jsx"},{"name":"CardContent","sourcePath":"components/core/Card.jsx"},{"name":"CardFooter","sourcePath":"components/core/Card.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"Separator","sourcePath":"components/core/Separator.jsx"},{"name":"Skeleton","sourcePath":"components/core/Skeleton.jsx"},{"name":"Table","sourcePath":"components/core/Table.jsx"},{"name":"TableHeader","sourcePath":"components/core/Table.jsx"},{"name":"TableBody","sourcePath":"components/core/Table.jsx"},{"name":"TableRow","sourcePath":"components/core/Table.jsx"},{"name":"TableHead","sourcePath":"components/core/Table.jsx"},{"name":"TableCell","sourcePath":"components/core/Table.jsx"},{"name":"Alert","sourcePath":"components/feedback/Alert.jsx"},{"name":"Callout","sourcePath":"components/feedback/Callout.jsx"},{"name":"Dialog","sourcePath":"components/feedback/Dialog.jsx"},{"name":"LoadingScreen","sourcePath":"components/feedback/LoadingScreen.jsx"},{"name":"Progress","sourcePath":"components/feedback/Progress.jsx"},{"name":"StatusBadge","sourcePath":"components/feedback/StatusBadge.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Label","sourcePath":"components/forms/Label.jsx"},{"name":"RadioGroup","sourcePath":"components/forms/RadioGroup.jsx"},{"name":"RadioGroupItem","sourcePath":"components/forms/RadioGroup.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"Textarea","sourcePath":"components/forms/Textarea.jsx"},{"name":"UploadDropzone","sourcePath":"components/forms/UploadDropzone.jsx"},{"name":"PortalHeader","sourcePath":"components/navigation/PortalHeader.jsx"},{"name":"StepChips","sourcePath":"components/navigation/StepChips.jsx"},{"name":"StepProgressBar","sourcePath":"components/navigation/StepProgressBar.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"}],"sourceHashes":{"components/brand/EmptyState.jsx":"cfeeda978d85","components/brand/HeroPanel.jsx":"bcd2ccef32d7","components/brand/Logo.jsx":"28c264b9fd25","components/brand/ProgressRow.jsx":"75f6e17bbb29","components/brand/StatCard.jsx":"859c4f20f714","components/brand/TaskCard.jsx":"25637821bca6","components/core/Avatar.jsx":"766f2909de2e","components/core/Badge.jsx":"a8ab25b88552","components/core/Button.jsx":"e89c251f74bf","components/core/Card.jsx":"69c944cc1a3e","components/core/Icon.jsx":"0e82b4d529d7","components/core/Separator.jsx":"76440d617afa","components/core/Skeleton.jsx":"5636461a3274","components/core/Table.jsx":"ffe07912b260","components/feedback/Alert.jsx":"4d646524b882","components/feedback/Callout.jsx":"2d69adf9d59f","components/feedback/Dialog.jsx":"8a810c205114","components/feedback/LoadingScreen.jsx":"30d28c2f6876","components/feedback/Progress.jsx":"08f888421433","components/feedback/StatusBadge.jsx":"65c6c93618dc","components/forms/Checkbox.jsx":"34ca7a0351ec","components/forms/Input.jsx":"c3731bb032ae","components/forms/Label.jsx":"72a30a2a2ce4","components/forms/RadioGroup.jsx":"cc95eb05db16","components/forms/Select.jsx":"8faeace28b78","components/forms/Switch.jsx":"01cad9aabe79","components/forms/Textarea.jsx":"b8d470affdd1","components/forms/UploadDropzone.jsx":"8d70ae755359","components/navigation/PortalHeader.jsx":"e3436acee933","components/navigation/StepChips.jsx":"645b373fae2a","components/navigation/StepProgressBar.jsx":"f7c8461f15e0","components/navigation/Tabs.jsx":"d50a63f427be","ui_kits/admin-dashboard/CaregiversTab.jsx":"72ebc4dd59e9","ui_kits/admin-dashboard/ParticipantsTab.jsx":"dc89343049ca","ui_kits/admin-dashboard/TasksTab.jsx":"f9d070855bd7","ui_kits/admin-dashboard/app.jsx":"3c82d6344777","ui_kits/admin-dashboard/data.js":"c78e7afedaef","ui_kits/caregiver-portal/AllDoneScreen.jsx":"55911acec9c7","ui_kits/caregiver-portal/DayPortalScreen.jsx":"ece3f7e97c98","ui_kits/caregiver-portal/OnboardingScreen.jsx":"73c14afab941","ui_kits/caregiver-portal/WelcomeScreen.jsx":"91b0b1c801c6","ui_kits/caregiver-portal/app.jsx":"1cc2292bc3dd","ui_kits/caregiver-portal/data.js":"93ceb430af6d","ui_kits/family-portal/FamilyPortalHome.jsx":"11edae7613be","ui_kits/family-portal/app.jsx":"a8333f8aac37","ui_kits/family-portal/data.js":"47eabb2b1faa"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.ClairoCareDesignSystem_7d6804 = window.ClairoCareDesignSystem_7d6804 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/brand/HeroPanel.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function HeroPanel({
  eyebrow,
  title,
  subtitle,
  gradient = false,
  children,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      position: "relative",
      overflow: "hidden",
      borderRadius: "var(--radius-2xl)",
      padding: "var(--panel-padding)",
      color: "#fff",
      fontFamily: "var(--font-sans)",
      background: gradient ? "linear-gradient(to bottom right, var(--clairo-navy), color-mix(in srgb, var(--clairo-blue) 80%, transparent))" : "var(--clairo-navy)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      right: "-32px",
      top: "-32px",
      width: "160px",
      height: "160px",
      borderRadius: "var(--radius-full)",
      background: gradient ? "rgba(255,255,255,0.05)" : "color-mix(in srgb, var(--clairo-blue) 10%, transparent)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      right: "-16px",
      bottom: "-48px",
      width: "128px",
      height: "128px",
      borderRadius: "var(--radius-full)",
      background: gradient ? "rgba(255,255,255,0.05)" : "color-mix(in srgb, var(--clairo-blue) 5%, transparent)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative"
    }
  }, eyebrow && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "0 0 4px",
      fontSize: "var(--text-sm)",
      fontWeight: "var(--font-weight-medium)",
      color: "var(--text-accent-on-navy)"
    }
  }, eyebrow), title && /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontSize: "var(--text-2xl)",
      lineHeight: "var(--leading-2xl)",
      fontWeight: "var(--font-weight-bold)"
    }
  }, title), subtitle && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "4px 0 0",
      fontSize: "var(--text-sm)",
      color: "var(--text-on-navy-soft)"
    }
  }, subtitle), children && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "16px"
    }
  }, children)));
}
Object.assign(__ds_scope, { HeroPanel });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/HeroPanel.jsx", error: String((e && e.message) || e) }); }

// components/brand/Logo.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Asset base: set window.CLAIRO_ASSETS_BASE (e.g. "../../assets") once per page,
   or pass an explicit src. Defaults to "assets" relative to the document. */
const heights = {
  sm: 28,
  md: 40,
  lg: 60
};
function Logo({
  size = "md",
  dark = false,
  mark = false,
  src,
  style,
  ...rest
}) {
  const base = typeof window !== "undefined" && window.CLAIRO_ASSETS_BASE || "assets";
  const file = mark ? "logo-mark-light-blue.png" : dark ? "logo-lockup-white.png" : "logo-lockup-navy.png";
  const h = typeof size === "number" ? size : heights[size];
  return /*#__PURE__*/React.createElement("img", _extends({
    src: src || base + "/" + file,
    alt: "ClairoCare",
    style: {
      height: h,
      width: "auto",
      objectFit: "contain",
      display: "block",
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { Logo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Logo.jsx", error: String((e && e.message) || e) }); }

// components/core/Avatar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const tones = {
  blue: {
    background: "color-mix(in srgb, var(--clairo-blue) 10%, transparent)",
    color: "var(--clairo-blue)"
  },
  participant: {
    background: "var(--entity-participant-bg)",
    color: "var(--entity-participant-fg)"
  },
  team: {
    background: "var(--entity-team-bg)",
    color: "var(--entity-team-fg)"
  },
  onNavy: {
    background: "color-mix(in srgb, var(--clairo-blue) 30%, transparent)",
    color: "#fff"
  },
  muted: {
    background: "var(--muted)",
    color: "var(--muted-foreground)"
  }
};
function Avatar({
  name = "",
  src,
  size = 36,
  tone = "blue",
  style,
  ...rest
}) {
  const initial = String(name).charAt(0).toUpperCase() || "?";
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      width: size,
      height: size,
      borderRadius: "var(--radius-full)",
      overflow: "hidden",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      fontFamily: "var(--font-sans)",
      fontWeight: "var(--font-weight-bold)",
      fontSize: size <= 28 ? "var(--text-xs)" : "var(--text-sm)",
      ...tones[tone],
      ...style
    }
  }, rest), src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: name,
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover"
    }
  }) : initial);
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const variants = {
  default: {
    background: "var(--primary)",
    color: "var(--primary-foreground)",
    boxShadow: "var(--shadow)"
  },
  secondary: {
    background: "var(--secondary)",
    color: "var(--secondary-foreground)"
  },
  destructive: {
    background: "var(--destructive)",
    color: "var(--destructive-foreground)",
    boxShadow: "var(--shadow)"
  },
  outline: {
    background: "transparent",
    color: "var(--foreground)",
    borderColor: "var(--border)"
  },
  tint: {
    background: "color-mix(in srgb, var(--clairo-blue) 10%, transparent)",
    color: "var(--clairo-blue)"
  },
  onNavy: {
    background: "color-mix(in srgb, var(--clairo-blue) 20%, transparent)",
    color: "hsl(var(--clairo-light-blue-hsl))"
  }
};
function Badge({
  variant = "default",
  children,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "4px",
      borderRadius: "var(--radius-md)",
      border: "1px solid transparent",
      padding: "2px 10px",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-xs)",
      lineHeight: "16px",
      fontWeight: "var(--font-weight-semibold)",
      transition: "var(--transition-colors)",
      ...variants[variant],
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const base = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  whiteSpace: "nowrap",
  borderRadius: "var(--radius-md)",
  fontFamily: "var(--font-sans)",
  fontSize: "var(--text-sm)",
  fontWeight: "var(--font-weight-medium)",
  lineHeight: 1,
  border: "1px solid transparent",
  cursor: "pointer",
  transition: "var(--transition-colors)",
  outline: "none"
};
const sizes = {
  default: {
    height: "36px",
    padding: "0 16px"
  },
  sm: {
    height: "32px",
    padding: "0 12px",
    fontSize: "var(--text-xs)"
  },
  lg: {
    height: "40px",
    padding: "0 32px"
  },
  xl: {
    height: "48px",
    padding: "0 20px",
    fontSize: "var(--text-base)",
    fontWeight: "var(--font-weight-semibold)",
    borderRadius: "var(--radius-xl)"
  },
  icon: {
    height: "36px",
    width: "36px",
    padding: 0
  }
};
const variants = {
  default: {
    background: "var(--primary)",
    color: "var(--primary-foreground)",
    boxShadow: "var(--shadow)"
  },
  primary: {
    background: "var(--clairo-blue)",
    color: "#fff",
    boxShadow: "var(--shadow)"
  },
  destructive: {
    background: "var(--destructive)",
    color: "var(--destructive-foreground)",
    boxShadow: "var(--shadow-sm)"
  },
  outline: {
    background: "transparent",
    color: "var(--foreground)",
    borderColor: "var(--input)",
    boxShadow: "var(--shadow-sm)"
  },
  secondary: {
    background: "var(--secondary)",
    color: "var(--secondary-foreground)",
    boxShadow: "var(--shadow-sm)"
  },
  ghost: {
    background: "transparent",
    color: "var(--foreground)"
  },
  link: {
    background: "transparent",
    color: "var(--clairo-blue)",
    textUnderlineOffset: "4px"
  },
  onNavy: {
    background: "transparent",
    color: "#fff",
    borderColor: "rgba(255,255,255,0.2)"
  },
  success: {
    background: "#16a34a",
    color: "#fff"
  }
};
const hovers = {
  default: {
    background: "color-mix(in srgb, var(--primary) 90%, transparent)"
  },
  primary: {
    background: "color-mix(in srgb, var(--clairo-blue) 90%, transparent)"
  },
  destructive: {
    background: "color-mix(in srgb, var(--destructive) 90%, transparent)"
  },
  outline: {
    background: "var(--accent)",
    color: "var(--accent-foreground)"
  },
  secondary: {
    background: "color-mix(in srgb, var(--secondary) 80%, transparent)"
  },
  ghost: {
    background: "var(--accent)",
    color: "var(--accent-foreground)"
  },
  link: {
    textDecoration: "underline"
  },
  onNavy: {
    background: "rgba(255,255,255,0.1)"
  },
  success: {
    background: "#15803d"
  }
};
function Button({
  variant = "default",
  size = "default",
  disabled,
  children,
  style,
  onClick,
  type = "button",
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      ...base,
      ...sizes[size],
      ...variants[variant],
      ...(hover && !disabled ? hovers[variant] : null),
      opacity: disabled ? 0.5 : 1,
      pointerEvents: disabled ? "none" : undefined,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Card({
  children,
  style,
  padded = false,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      borderRadius: "var(--radius-xl)",
      border: "1px solid var(--border)",
      background: "var(--card)",
      color: "var(--card-foreground)",
      boxShadow: "var(--shadow)",
      padding: padded ? "var(--card-padding)" : undefined,
      ...style
    }
  }, rest), children);
}
function CardHeader({
  children,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "6px",
      padding: "var(--panel-padding)",
      ...style
    }
  }, rest), children);
}
function CardTitle({
  children,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      fontWeight: "var(--font-weight-semibold)",
      lineHeight: 1,
      letterSpacing: "var(--tracking-tight)",
      ...style
    }
  }, rest), children);
}
function CardDescription({
  children,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      fontSize: "var(--text-sm)",
      color: "var(--muted-foreground)",
      ...style
    }
  }, rest), children);
}
function CardContent({
  children,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      padding: "var(--panel-padding)",
      paddingTop: 0,
      ...style
    }
  }, rest), children);
}
function CardFooter({
  children,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "flex",
      alignItems: "center",
      padding: "var(--panel-padding)",
      paddingTop: 0,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Lucide is the product's only icon set (components.json → iconLibrary: "lucide").
   Load the CDN UMD build once per page:
   <script src="https://unpkg.com/lucide@0.475.0/dist/umd/lucide.min.js"></script> */
const pascal = s => String(s).replace(/(^|[-_ ])(\w)/g, (_, __, c) => c.toUpperCase());
function Icon({
  name,
  size = 16,
  strokeWidth = 2,
  color = "currentColor",
  style,
  ...rest
}) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const host = ref.current;
    if (!host) return;
    const lib = typeof window !== "undefined" ? window.lucide : null;
    const node = lib && lib.icons && (lib.icons[name] || lib.icons[pascal(name)]);
    host.replaceChildren();
    if (!node || !lib.createElement) return;
    const el = lib.createElement(node);
    el.setAttribute("width", size);
    el.setAttribute("height", size);
    el.setAttribute("stroke-width", strokeWidth);
    el.setAttribute("stroke", color);
    host.appendChild(el);
  }, [name, size, strokeWidth, color]);
  return /*#__PURE__*/React.createElement("span", _extends({
    ref: ref,
    "aria-hidden": "true",
    style: {
      display: "inline-flex",
      flexShrink: 0,
      width: size,
      height: size,
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/brand/EmptyState.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function EmptyState({
  icon = "user",
  title,
  description,
  children,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      textAlign: "center",
      padding: "64px 16px",
      color: "var(--muted-foreground)",
      fontFamily: "var(--font-sans)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      opacity: 0.3,
      marginBottom: "12px"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 40
  })), title && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontWeight: "var(--font-weight-medium)",
      fontSize: "var(--text-sm)",
      color: "var(--muted-foreground)"
    }
  }, title), description && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "2px 0 0",
      fontSize: "var(--text-sm)"
    }
  }, description), children && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "16px"
    }
  }, children));
}
Object.assign(__ds_scope, { EmptyState });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/EmptyState.jsx", error: String((e && e.message) || e) }); }

// components/brand/StatCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function StatCard({
  icon,
  label,
  value,
  tone = "blue",
  style,
  ...rest
}) {
  const colors = {
    blue: "var(--clairo-blue)",
    participant: "var(--entity-participant-fg)",
    goal: "var(--entity-goal-fg)",
    danger: "var(--status-rejected-solid)"
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      background: "var(--card)",
      borderRadius: "var(--radius-xl)",
      border: "1px solid var(--border)",
      padding: "16px",
      boxShadow: "var(--shadow-sm)",
      fontFamily: "var(--font-sans)",
      ...style
    }
  }, rest), icon && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      color: colors[tone],
      marginBottom: "8px"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 20
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: "var(--text-2xl)",
      lineHeight: "var(--leading-2xl)",
      fontWeight: "var(--font-weight-bold)",
      color: "var(--foreground)"
    }
  }, value), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "2px 0 0",
      fontSize: "var(--text-xs)",
      color: "var(--muted-foreground)"
    }
  }, label));
}
Object.assign(__ds_scope, { StatCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/StatCard.jsx", error: String((e && e.message) || e) }); }

// components/core/Separator.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Separator({
  orientation = "horizontal",
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "separator",
    style: {
      flexShrink: 0,
      background: "var(--border)",
      height: orientation === "horizontal" ? "1px" : "100%",
      width: orientation === "horizontal" ? "100%" : "1px",
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { Separator });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Separator.jsx", error: String((e && e.message) || e) }); }

// components/core/Skeleton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Skeleton({
  width = "100%",
  height = 16,
  radius = "var(--radius-md)",
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      width,
      height,
      borderRadius: radius,
      background: "color-mix(in srgb, var(--primary) 10%, transparent)",
      animation: "clairo-pulse 2s var(--ease-in-out) infinite",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("style", null, "@keyframes clairo-pulse{0%,100%{opacity:1}50%{opacity:.5}}"));
}
Object.assign(__ds_scope, { Skeleton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Skeleton.jsx", error: String((e && e.message) || e) }); }

// components/core/Table.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Table({
  children,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: "100%",
      overflow: "auto"
    }
  }, /*#__PURE__*/React.createElement("table", _extends({
    style: {
      width: "100%",
      borderCollapse: "collapse",
      captionSide: "bottom",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-sm)",
      ...style
    }
  }, rest), children));
}
function TableHeader({
  children,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("thead", rest, children);
}
function TableBody({
  children,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("tbody", rest, children);
}
function TableRow({
  children,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("tr", _extends({
    style: {
      borderBottom: "1px solid var(--border)",
      transition: "var(--transition-colors)",
      ...style
    }
  }, rest), children);
}
function TableHead({
  children,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("th", _extends({
    style: {
      height: "40px",
      padding: "0 8px",
      textAlign: "left",
      verticalAlign: "middle",
      fontWeight: "var(--font-weight-medium)",
      color: "var(--muted-foreground)",
      ...style
    }
  }, rest), children);
}
function TableCell({
  children,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("td", _extends({
    style: {
      padding: "8px",
      verticalAlign: "middle",
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Table, TableHeader, TableBody, TableRow, TableHead, TableCell });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Table.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Alert.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const tones = {
  info: {
    surface: "var(--status-progress-surface)",
    border: "var(--status-progress-border)",
    title: "var(--status-progress-strong)",
    body: "var(--status-progress-fg)",
    icon: "info"
  },
  success: {
    surface: "var(--status-approved-surface)",
    border: "var(--status-approved-border)",
    title: "var(--status-approved-strong)",
    body: "var(--status-approved-fg)",
    icon: "check-circle-2"
  },
  warning: {
    surface: "var(--status-warning-surface)",
    border: "var(--status-warning-border)",
    title: "var(--status-warning-strong)",
    body: "var(--status-warning-fg)",
    icon: "alert-triangle"
  },
  pending: {
    surface: "var(--status-submitted-surface)",
    border: "var(--status-submitted-border)",
    title: "var(--status-submitted-strong)",
    body: "var(--status-submitted-fg)",
    icon: "clock"
  },
  danger: {
    surface: "var(--status-rejected-surface)",
    border: "var(--status-rejected-border)",
    title: "var(--status-rejected-strong)",
    body: "var(--status-rejected-fg)",
    icon: "alert-circle"
  },
  blocked: {
    surface: "var(--status-locked-bg)",
    border: "var(--status-locked-border)",
    title: "var(--status-locked-strong)",
    body: "var(--status-locked-fg)",
    icon: "lock"
  }
};
function Alert({
  tone = "info",
  title,
  children,
  icon,
  style,
  ...rest
}) {
  const t = tones[tone];
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "alert",
    style: {
      display: "flex",
      gap: "12px",
      alignItems: "flex-start",
      background: t.surface,
      border: "1px solid " + t.border,
      borderRadius: "var(--radius-2xl)",
      padding: "16px",
      fontFamily: "var(--font-sans)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      color: t.title,
      marginTop: "2px"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon || t.icon,
    size: 20
  })), /*#__PURE__*/React.createElement("div", null, title && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: "var(--text-sm)",
      fontWeight: "var(--font-weight-bold)",
      color: t.title
    }
  }, title), children && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: title ? "2px" : 0,
      fontSize: "var(--text-sm)",
      color: t.body,
      lineHeight: "20px"
    }
  }, children)));
}
Object.assign(__ds_scope, { Alert });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Alert.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Callout.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Callout({
  children,
  align = "center",
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      background: "color-mix(in srgb, var(--clairo-navy) 5%, transparent)",
      border: "1px solid color-mix(in srgb, var(--clairo-blue) 20%, transparent)",
      borderRadius: "var(--radius-xl)",
      padding: "16px",
      textAlign: align,
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-sm)",
      color: "color-mix(in srgb, var(--foreground) 70%, transparent)",
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Callout });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Callout.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Dialog.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Dialog({
  open = true,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = 512,
  style,
  ...rest
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      inset: 0,
      zIndex: 50,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "16px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: "absolute",
      inset: 0,
      background: "var(--overlay-scrim)"
    }
  }), /*#__PURE__*/React.createElement("div", _extends({
    role: "dialog",
    "aria-modal": "true",
    style: {
      position: "relative",
      width: "100%",
      maxWidth,
      maxHeight: "90vh",
      display: "flex",
      flexDirection: "column",
      gap: "16px",
      background: "var(--background)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius-lg)",
      padding: "24px",
      boxShadow: "var(--shadow-overlay)",
      fontFamily: "var(--font-sans)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClose,
    "aria-label": "Close",
    style: {
      position: "absolute",
      right: "16px",
      top: "16px",
      background: "transparent",
      border: "none",
      padding: "4px",
      borderRadius: "var(--radius-md)",
      cursor: "pointer",
      opacity: 0.7,
      color: "var(--foreground)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "x",
    size: 16
  })), (title || description) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "6px"
    }
  }, title && /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontSize: "var(--text-lg)",
      lineHeight: 1,
      fontWeight: "var(--font-weight-semibold)",
      letterSpacing: "var(--tracking-tight)",
      color: "var(--foreground)"
    }
  }, title), description && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: "var(--text-sm)",
      color: "var(--muted-foreground)"
    }
  }, description)), /*#__PURE__*/React.createElement("div", {
    style: {
      overflowY: "auto",
      minHeight: 0,
      display: "flex",
      flexDirection: "column",
      gap: "16px"
    }
  }, children), footer && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "flex-end",
      gap: "8px"
    }
  }, footer)));
}
Object.assign(__ds_scope, { Dialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Dialog.jsx", error: String((e && e.message) || e) }); }

// components/feedback/LoadingScreen.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function LoadingScreen({
  message = "Loading ClairoCare...",
  fullscreen = true,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      minHeight: fullscreen ? "100vh" : "160px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--background)",
      fontFamily: "var(--font-sans)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      display: "grid",
      gap: "12px",
      justifyItems: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: "32px",
      height: "32px",
      borderRadius: "var(--radius-full)",
      border: "4px solid color-mix(in srgb, var(--clairo-blue) 20%, transparent)",
      borderTopColor: "var(--clairo-blue)",
      animation: "clairo-spin 1s linear infinite"
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: "var(--text-sm)",
      color: "var(--muted-foreground)"
    }
  }, message), /*#__PURE__*/React.createElement("style", null, "@keyframes clairo-spin{to{transform:rotate(360deg)}}")));
}
Object.assign(__ds_scope, { LoadingScreen });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/LoadingScreen.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Progress.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Progress({
  value = 0,
  height = 8,
  onNavy = false,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "progressbar",
    "aria-valuenow": value,
    "aria-valuemin": 0,
    "aria-valuemax": 100,
    style: {
      position: "relative",
      height,
      width: "100%",
      overflow: "hidden",
      borderRadius: "var(--radius-full)",
      background: onNavy ? "rgba(255,255,255,0.1)" : "color-mix(in srgb, var(--primary) 20%, transparent)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      height: "100%",
      width: Math.max(0, Math.min(100, value)) + "%",
      background: "var(--clairo-blue)",
      borderRadius: "var(--radius-full)",
      transition: "width var(--duration-progress) var(--ease-out)"
    }
  }));
}
Object.assign(__ds_scope, { Progress });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Progress.jsx", error: String((e && e.message) || e) }); }

// components/brand/ProgressRow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ProgressRow({
  label = "Onboarding progress",
  value = 0,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "grid",
      gap: "4px",
      fontFamily: "var(--font-sans)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      fontSize: "var(--text-xs)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--muted-foreground)"
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: "var(--font-weight-semibold)",
      color: "var(--foreground)"
    }
  }, value, "%")), /*#__PURE__*/React.createElement(__ds_scope.Progress, {
    value: value,
    height: 6
  }));
}
Object.assign(__ds_scope, { ProgressRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/ProgressRow.jsx", error: String((e && e.message) || e) }); }

// components/feedback/StatusBadge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STATUS = {
  not_started: {
    label: "Not Started",
    bg: "var(--muted)",
    fg: "var(--muted-foreground)"
  },
  in_progress: {
    label: "In Progress",
    bg: "var(--status-progress-bg)",
    fg: "var(--status-progress-fg)"
  },
  submitted: {
    label: "Submitted",
    bg: "var(--status-submitted-bg)",
    fg: "var(--status-submitted-fg)"
  },
  pending_review: {
    label: "Pending Review",
    bg: "var(--status-review-bg)",
    fg: "var(--status-review-fg)"
  },
  approved: {
    label: "Approved",
    bg: "var(--status-approved-bg)",
    fg: "var(--status-approved-fg)"
  },
  rejected: {
    label: "Action Needed",
    bg: "var(--status-rejected-bg)",
    fg: "var(--status-rejected-fg)"
  },
  invited: {
    label: "Invited",
    bg: "var(--status-progress-bg)",
    fg: "var(--status-progress-fg)"
  },
  on_hold: {
    label: "On Hold",
    bg: "var(--status-rejected-bg)",
    fg: "var(--status-rejected-fg)"
  }
};
function StatusBadge({
  status = "not_started",
  label,
  style,
  ...rest
}) {
  const s = STATUS[status] || STATUS.not_started;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "4px",
      padding: "2px 10px",
      borderRadius: "var(--radius-md)",
      background: s.bg,
      color: s.fg,
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-xs)",
      lineHeight: "16px",
      fontWeight: "var(--font-weight-semibold)",
      ...style
    }
  }, rest), label || s.label);
}
Object.assign(__ds_scope, { StatusBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/StatusBadge.jsx", error: String((e && e.message) || e) }); }

// components/brand/TaskCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function TaskCard({
  emoji = "📄",
  title,
  description,
  status = "not_started",
  expanded = false,
  onToggle,
  children,
  style,
  ...rest
}) {
  const approved = status === "approved";
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      background: approved ? "color-mix(in srgb, var(--status-approved-surface) 30%, var(--card))" : "var(--card)",
      borderRadius: "var(--radius-xl)",
      border: "1px solid " + (approved ? "var(--status-approved-border)" : "var(--border)"),
      transition: "var(--transition-colors)",
      fontFamily: "var(--font-sans)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    onClick: () => !approved && onToggle && onToggle(),
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "8px",
      padding: "16px",
      cursor: approved ? "default" : "pointer"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-lg)",
      flexShrink: 0
    }
  }, emoji), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: "var(--text-sm)",
      fontWeight: "var(--font-weight-semibold)",
      color: "var(--foreground)"
    }
  }, title), description && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "2px 0 0",
      fontSize: "var(--text-xs)",
      color: "var(--muted-foreground)",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }
  }, description))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.StatusBadge, {
    status: status
  }), !approved && /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--muted-foreground)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: expanded ? "chevron-up" : "chevron-down",
    size: 16
  })))), expanded && !approved && children && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "12px 16px 16px",
      borderTop: "1px solid color-mix(in srgb, var(--border) 50%, transparent)"
    }
  }, children));
}
Object.assign(__ds_scope, { TaskCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/TaskCard.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Checkbox({
  checked = false,
  onChange,
  disabled,
  label,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1,
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-sm)",
      color: "var(--foreground)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", _extends({
    role: "checkbox",
    "aria-checked": checked,
    tabIndex: 0,
    onClick: () => !disabled && onChange && onChange(!checked),
    onKeyDown: e => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        !disabled && onChange && onChange(!checked);
      }
    },
    style: {
      width: "16px",
      height: "16px",
      flexShrink: 0,
      borderRadius: "var(--radius-sm)",
      border: "1px solid var(--primary)",
      boxShadow: "var(--shadow)",
      background: checked ? "var(--primary)" : "transparent",
      color: "var(--primary-foreground)",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "var(--transition-colors)"
    }
  }, rest), checked && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "check",
    size: 14
  })), label);
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Input({
  style,
  invalid,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  return /*#__PURE__*/React.createElement("input", _extends({
    onFocus: e => {
      setFocus(true);
      rest.onFocus && rest.onFocus(e);
    },
    onBlur: e => {
      setFocus(false);
      rest.onBlur && rest.onBlur(e);
    },
    style: {
      display: "flex",
      height: "36px",
      width: "100%",
      borderRadius: "var(--radius-md)",
      border: "1px solid " + (invalid ? "var(--destructive)" : "var(--input)"),
      background: "transparent",
      padding: "4px 12px",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-sm)",
      color: "var(--foreground)",
      boxShadow: "var(--shadow-sm)",
      outline: focus ? "1px solid var(--ring)" : "none",
      transition: "var(--transition-colors)",
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Label.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Label({
  children,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("label", _extends({
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-sm)",
      fontWeight: "var(--font-weight-medium)",
      lineHeight: 1,
      color: "var(--foreground)",
      display: "block",
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Label });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Label.jsx", error: String((e && e.message) || e) }); }

// components/forms/RadioGroup.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function RadioGroup({
  children,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "radiogroup",
    style: {
      display: "grid",
      gap: "8px",
      ...style
    }
  }, rest), children);
}
function RadioGroupItem({
  checked = false,
  onChange,
  disabled,
  label,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1,
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-sm)",
      color: "var(--foreground)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", _extends({
    role: "radio",
    "aria-checked": checked,
    tabIndex: 0,
    onClick: () => !disabled && onChange && onChange(true),
    style: {
      width: "16px",
      height: "16px",
      flexShrink: 0,
      borderRadius: "var(--radius-full)",
      border: "1px solid var(--primary)",
      boxShadow: "var(--shadow)",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, rest), checked && /*#__PURE__*/React.createElement("span", {
    style: {
      width: "9px",
      height: "9px",
      borderRadius: "var(--radius-full)",
      background: "var(--primary)"
    }
  })), label);
}
Object.assign(__ds_scope, { RadioGroup, RadioGroupItem });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/RadioGroup.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Select({
  options = [],
  value,
  onChange,
  placeholder = "Select...",
  disabled,
  style,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: "100%"
    }
  }, /*#__PURE__*/React.createElement("select", _extends({
    value: value ?? "",
    disabled: disabled,
    onChange: e => onChange && onChange(e.target.value),
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      appearance: "none",
      width: "100%",
      height: "36px",
      borderRadius: "var(--radius-md)",
      border: "1px solid var(--input)",
      background: "transparent",
      padding: "0 32px 0 12px",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-sm)",
      color: value ? "var(--foreground)" : "var(--muted-foreground)",
      boxShadow: "var(--shadow-sm)",
      outline: focus ? "1px solid var(--ring)" : "none",
      opacity: disabled ? 0.5 : 1,
      cursor: disabled ? "not-allowed" : "pointer",
      ...style
    }
  }, rest), !value && /*#__PURE__*/React.createElement("option", {
    value: "",
    disabled: true
  }, placeholder), options.map(o => {
    const opt = typeof o === "string" ? {
      value: o,
      label: o
    } : o;
    return /*#__PURE__*/React.createElement("option", {
      key: opt.value,
      value: opt.value
    }, opt.label);
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      right: "10px",
      top: "50%",
      transform: "translateY(-50%)",
      pointerEvents: "none",
      opacity: 0.5,
      display: "inline-flex"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-down",
    size: 16
  })));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Switch({
  checked = false,
  onChange,
  disabled,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    role: "switch",
    "aria-checked": checked,
    disabled: disabled,
    onClick: () => onChange && onChange(!checked),
    style: {
      position: "relative",
      display: "inline-flex",
      alignItems: "center",
      height: "20px",
      width: "36px",
      flexShrink: 0,
      borderRadius: "var(--radius-full)",
      border: "2px solid transparent",
      background: checked ? "var(--primary)" : "var(--input)",
      boxShadow: "var(--shadow-sm)",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1,
      padding: 0,
      transition: "var(--transition-colors)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      height: "16px",
      width: "16px",
      borderRadius: "var(--radius-full)",
      background: "var(--background)",
      boxShadow: "var(--shadow-lg)",
      transform: checked ? "translateX(16px)" : "translateX(0)",
      transition: "transform var(--duration-fast) var(--ease-in-out)"
    }
  }));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/forms/Textarea.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Textarea({
  style,
  rows = 3,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  return /*#__PURE__*/React.createElement("textarea", _extends({
    rows: rows,
    onFocus: e => {
      setFocus(true);
      rest.onFocus && rest.onFocus(e);
    },
    onBlur: e => {
      setFocus(false);
      rest.onBlur && rest.onBlur(e);
    },
    style: {
      display: "flex",
      minHeight: "60px",
      width: "100%",
      borderRadius: "var(--radius-md)",
      border: "1px solid var(--input)",
      background: "transparent",
      padding: "8px 12px",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-sm)",
      color: "var(--foreground)",
      boxShadow: "var(--shadow-sm)",
      outline: focus ? "1px solid var(--ring)" : "none",
      resize: "vertical",
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { Textarea });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Textarea.jsx", error: String((e && e.message) || e) }); }

// components/forms/UploadDropzone.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function UploadDropzone({
  label = "Click to upload file",
  uploading = false,
  onSelect,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("label", _extends({
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      padding: "12px 16px",
      border: "2px dashed " + (hover ? "color-mix(in srgb, var(--primary) 40%, transparent)" : "var(--border)"),
      borderRadius: "var(--radius-xl)",
      cursor: "pointer",
      transition: "var(--transition-colors)",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-sm)",
      color: "var(--muted-foreground)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "upload",
    size: 16
  }), /*#__PURE__*/React.createElement("span", null, uploading ? "Uploading..." : label), /*#__PURE__*/React.createElement("input", {
    type: "file",
    style: {
      display: "none"
    },
    disabled: uploading,
    onChange: e => onSelect && onSelect(e.target.files && e.target.files[0])
  }));
}
Object.assign(__ds_scope, { UploadDropzone });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/UploadDropzone.jsx", error: String((e && e.message) || e) }); }

// components/navigation/PortalHeader.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function PortalHeader({
  maxWidth = 896,
  left,
  children,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("header", _extends({
    style: {
      background: "var(--clairo-navy)",
      position: "sticky",
      top: 0,
      zIndex: 50,
      boxShadow: "var(--shadow-header)",
      fontFamily: "var(--font-sans)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth,
      margin: "0 auto",
      padding: "12px 16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "12px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "12px"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Logo, {
    size: "sm",
    dark: true
  }), left), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "12px"
    }
  }, children)));
}
Object.assign(__ds_scope, { PortalHeader });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/PortalHeader.jsx", error: String((e && e.message) || e) }); }

// components/navigation/StepChips.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function StepChips({
  steps = [],
  current = 0,
  onSelect,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "flex",
      gap: "8px",
      overflowX: "auto",
      paddingBottom: "8px",
      fontFamily: "var(--font-sans)",
      ...style
    }
  }, rest), steps.map((step, idx) => {
    const active = idx === current;
    const state = step.state || "todo"; // todo | pending | approved | locked
    const chip = active ? {
      background: "var(--clairo-navy)",
      color: "#fff",
      boxShadow: "var(--shadow-md)",
      border: "1px solid transparent"
    } : state === "locked" ? {
      background: "var(--muted)",
      color: "color-mix(in srgb, var(--muted-foreground) 50%, transparent)",
      border: "1px solid transparent"
    } : state === "approved" ? {
      background: "var(--status-approved-bg)",
      color: "var(--status-approved-fg)",
      border: "1px solid transparent"
    } : state === "pending" ? {
      background: "var(--status-submitted-bg)",
      color: "var(--status-submitted-fg)",
      border: "1px solid transparent"
    } : {
      background: "var(--card)",
      color: "var(--muted-foreground)",
      border: "1px solid var(--border)"
    };
    return /*#__PURE__*/React.createElement("button", {
      key: idx,
      type: "button",
      disabled: state === "locked",
      onClick: () => state !== "locked" && onSelect && onSelect(idx),
      style: {
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "10px 16px",
        borderRadius: "var(--radius-xl)",
        fontSize: "var(--text-sm)",
        fontWeight: "var(--font-weight-medium)",
        fontFamily: "inherit",
        cursor: state === "locked" ? "not-allowed" : "pointer",
        transition: "var(--transition-colors)",
        ...chip
      }
    }, /*#__PURE__*/React.createElement("span", null, step.emoji), /*#__PURE__*/React.createElement("span", {
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        whiteSpace: "nowrap"
      }
    }, step.title), step.hint && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: "var(--text-2xs)",
        fontWeight: "var(--font-weight-regular)",
        opacity: 0.75,
        whiteSpace: "nowrap"
      }
    }, step.hint)), state === "approved" && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: "check-circle-2",
      size: 14
    }));
  }));
}
Object.assign(__ds_scope, { StepChips });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/StepChips.jsx", error: String((e && e.message) || e) }); }

// components/navigation/StepProgressBar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function StepProgressBar({
  steps = [],
  current = 0,
  style,
  ...rest
}) {
  const pct = steps.length > 1 ? Math.max(0, current) / (steps.length - 1) * 100 : 0;
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      width: "100%",
      fontFamily: "var(--font-sans)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: "20px",
      left: "32px",
      right: "32px",
      height: "2px",
      background: "var(--border)",
      zIndex: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: "20px",
      left: "32px",
      height: "2px",
      background: "var(--primary)",
      width: "calc(" + pct + "% - 32px)",
      zIndex: 0,
      transition: "width var(--duration-progress) var(--ease-out)"
    }
  }), steps.map((step, idx) => {
    const done = step.state === "approved";
    const past = idx < current;
    const active = idx === current;
    const dot = done ? {
      background: "var(--status-approved-solid)",
      color: "#fff",
      border: "none"
    } : past || active ? {
      background: "var(--primary)",
      color: "#fff",
      border: "none",
      boxShadow: active ? "0 0 0 4px color-mix(in srgb, var(--primary) 20%, transparent)" : "var(--shadow-sm)"
    } : {
      background: "var(--card)",
      color: "var(--muted-foreground)",
      border: "2px solid var(--border)"
    };
    return /*#__PURE__*/React.createElement("div", {
      key: idx,
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        flex: 1,
        zIndex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: "40px",
        height: "40px",
        borderRadius: "var(--radius-full)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "var(--text-sm)",
        fontWeight: "var(--font-weight-bold)",
        transition: "var(--transition-colors)",
        ...dot
      }
    }, done ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: "check",
      size: 20
    }) : /*#__PURE__*/React.createElement("span", null, step.emoji)), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: "8px 0 0",
        maxWidth: "80px",
        textAlign: "center",
        fontSize: "var(--text-xs)",
        lineHeight: "15px",
        fontWeight: "var(--font-weight-medium)",
        color: active ? "var(--primary)" : past || done ? "var(--foreground)" : "var(--muted-foreground)"
      }
    }, step.title));
  })));
}
Object.assign(__ds_scope, { StepProgressBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/StepProgressBar.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Tabs({
  tabs = [],
  value,
  onChange,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "inline-flex",
      gap: "4px",
      background: "var(--muted)",
      borderRadius: "var(--radius-xl)",
      padding: "4px",
      width: "fit-content",
      fontFamily: "var(--font-sans)",
      ...style
    }
  }, rest), tabs.map(t => {
    const tab = typeof t === "string" ? {
      key: t,
      label: t
    } : t;
    const active = tab.key === value;
    return /*#__PURE__*/React.createElement("button", {
      key: tab.key,
      type: "button",
      onClick: () => onChange && onChange(tab.key),
      style: {
        padding: "8px 16px",
        borderRadius: "var(--radius-md)",
        border: "none",
        background: active ? "var(--card)" : "transparent",
        boxShadow: active ? "var(--shadow-sm)" : "none",
        color: active ? "var(--foreground)" : "var(--muted-foreground)",
        fontFamily: "inherit",
        fontSize: "var(--text-sm)",
        fontWeight: "var(--font-weight-medium)",
        cursor: "pointer",
        whiteSpace: "nowrap",
        transition: "var(--transition-colors)"
      }
    }, tab.label);
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin-dashboard/CaregiversTab.jsx
try { (() => {
const {
  Card,
  Badge,
  Avatar,
  Icon,
  StatusBadge,
  ProgressRow,
  Button
} = window.ClairoCareDesignSystem_7d6804;
function CaregiversTab({
  caregivers,
  onOpen
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: 12
    }
  }, caregivers.map(c => /*#__PURE__*/React.createElement(Card, {
    key: c.id,
    padded: true,
    style: {
      display: "grid",
      gap: 12,
      cursor: "pointer"
    },
    onClick: () => onOpen(c)
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      gap: 12,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12,
      alignItems: "center",
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: c.name,
    size: 36
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: "var(--text-sm)",
      fontWeight: 600
    }
  }, c.name), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: "var(--text-xs)",
      color: "var(--muted-foreground)"
    }
  }, "Supporting ", c.participant))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    variant: "tint"
  }, c.state), c.pending > 0 && /*#__PURE__*/React.createElement(Badge, {
    style: {
      background: "var(--status-review-bg)",
      color: "var(--status-review-fg)"
    }
  }, c.pending, " to review"), /*#__PURE__*/React.createElement(StatusBadge, {
    status: c.status
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--muted-foreground)",
      display: "inline-flex"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-right",
    size: 16
  })))), /*#__PURE__*/React.createElement(ProgressRow, {
    value: c.progress
  }))));
}
window.CaregiversTab = CaregiversTab;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin-dashboard/CaregiversTab.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin-dashboard/ParticipantsTab.jsx
try { (() => {
const {
  Card,
  Badge,
  Avatar,
  Icon,
  Input,
  Button,
  EmptyState
} = window.ClairoCareDesignSystem_7d6804;
function ParticipantsTab({
  participants,
  search,
  onSearch,
  onOpen
}) {
  const list = participants.filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.email.toLowerCase().includes(search.toLowerCase()));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: 12,
      top: "50%",
      transform: "translateY(-50%)",
      color: "var(--muted-foreground)",
      display: "inline-flex"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 16
  })), /*#__PURE__*/React.createElement(Input, {
    placeholder: "Search participants by name or email...",
    value: search,
    onChange: e => onSearch(e.target.value),
    style: {
      paddingLeft: 36
    }
  })), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    size: "icon"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "refresh-cw",
    size: 16
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: "var(--text-sm)",
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: "var(--tracking-wide)",
      color: "var(--muted-foreground)"
    }
  }, "Participants (", list.length, ")"), list.length === 0 ? /*#__PURE__*/React.createElement(EmptyState, {
    icon: "user",
    title: "No participants yet",
    description: "Participants are added when families submit the intake form."
  }) : list.map(p => /*#__PURE__*/React.createElement(Card, {
    key: p.id,
    padded: true,
    style: {
      cursor: "pointer"
    },
    onClick: () => onOpen(p)
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12,
      alignItems: "center",
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: p.name,
    size: 40,
    tone: "participant"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: "var(--text-sm)",
      fontWeight: 600
    }
  }, p.name), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: "var(--text-xs)",
      color: "var(--muted-foreground)"
    }
  }, p.email))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      alignItems: "center",
      flexShrink: 0
    }
  }, p.tags.map(t => /*#__PURE__*/React.createElement(Badge, {
    key: t,
    variant: "tint"
  }, t)), p.pending > 0 && /*#__PURE__*/React.createElement(Badge, {
    style: {
      background: "var(--status-review-bg)",
      color: "var(--status-review-fg)"
    }
  }, p.pending, " to review"), p.goalsNeeded && /*#__PURE__*/React.createElement(Badge, {
    style: {
      background: "var(--entity-goal-bg)",
      color: "var(--entity-goal-fg)"
    }
  }, "Goals needed"), /*#__PURE__*/React.createElement(Badge, {
    variant: "secondary"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "users",
    size: 12
  }), " ", p.caregivers, " caregivers"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--muted-foreground)",
      display: "inline-flex"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-right",
    size: 16
  }))))))));
}
window.ParticipantsTab = ParticipantsTab;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin-dashboard/ParticipantsTab.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin-dashboard/TasksTab.jsx
try { (() => {
const {
  Card,
  Button,
  Icon,
  StatusBadge,
  EmptyState,
  Textarea
} = window.ClairoCareDesignSystem_7d6804;
function TasksTab({
  tasks,
  onDecide
}) {
  const [feedbackFor, setFeedbackFor] = React.useState(null);
  if (tasks.length === 0) return /*#__PURE__*/React.createElement(EmptyState, {
    icon: "check-circle-2",
    title: "Nothing to review",
    description: "Submitted tasks land here for coordinator approval."
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: 12
    }
  }, tasks.map(t => /*#__PURE__*/React.createElement(Card, {
    key: t.id,
    padded: true,
    style: {
      display: "grid",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12,
      alignItems: "center",
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-lg)"
    }
  }, t.category), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: "var(--text-sm)",
      fontWeight: 600
    }
  }, t.title), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: "var(--text-xs)",
      color: "var(--muted-foreground)"
    }
  }, t.caregiver, " \xB7 submitted ", t.submitted))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement(StatusBadge, {
    status: "submitted"
  }), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "outline",
    onClick: () => setFeedbackFor(feedbackFor === t.id ? null : t.id)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 14
  }), " Request changes"), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "success",
    onClick: () => onDecide(t.id)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 14
  }), " Approve"))), feedbackFor === t.id && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Textarea, {
    placeholder: "What does the caregiver need to fix?"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "flex-end",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "ghost",
    onClick: () => setFeedbackFor(null)
  }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "destructive",
    onClick: () => onDecide(t.id)
  }, "Send feedback"))))));
}
window.TasksTab = TasksTab;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin-dashboard/TasksTab.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin-dashboard/app.jsx
try { (() => {
const {
  PortalHeader,
  Badge,
  Button,
  Icon,
  Avatar,
  Tabs,
  StatCard,
  Dialog,
  StatusBadge,
  ProgressRow,
  Card,
  EmptyState
} = window.ClairoCareDesignSystem_7d6804;
const DATA = window.CLAIRO_ADMIN;
function App() {
  const [tab, setTab] = React.useState("participants");
  const [search, setSearch] = React.useState("");
  const [tasks, setTasks] = React.useState(DATA.tasks);
  const [detail, setDetail] = React.useState(null);
  const tabs = [{
    key: "participants",
    label: "Participants"
  }, {
    key: "pipeline",
    label: "Pipeline"
  }, {
    key: "matchmaker",
    label: "Matchmaker"
  }, {
    key: "caregivers",
    label: "Caregivers"
  }, {
    key: "tasks",
    label: "Tasks"
  }, {
    key: "goals",
    label: "Goals"
  }, {
    key: "shifts",
    label: "Shift Logs"
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: "100vh",
      background: "var(--background)"
    }
  }, /*#__PURE__*/React.createElement(PortalHeader, {
    maxWidth: 1152,
    left: /*#__PURE__*/React.createElement(Badge, {
      variant: "onNavy"
    }, "Admin")
  }, /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "primary"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 16
  }), " Add Participant"), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "onNavy"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "eye",
    size: 14
  }), " Preview Flow"), /*#__PURE__*/React.createElement(Avatar, {
    name: DATA.user.full_name,
    size: 28,
    tone: "onNavy"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "rgba(255,255,255,.8)",
      fontSize: "var(--text-sm)"
    }
  }, DATA.user.full_name), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "rgba(255,255,255,.6)",
      display: "inline-flex"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "log-out",
    size: 16
  }))), /*#__PURE__*/React.createElement("main", {
    style: {
      maxWidth: 1152,
      margin: "0 auto",
      padding: "32px 16px",
      display: "grid",
      gap: 32
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 16
    }
  }, DATA.stats.map(s => /*#__PURE__*/React.createElement(StatCard, {
    key: s.label,
    icon: s.icon,
    label: s.label,
    value: s.label === "Tasks to Review" ? tasks.length : s.value,
    tone: s.tone
  }))), /*#__PURE__*/React.createElement(Tabs, {
    tabs: tabs,
    value: tab,
    onChange: setTab
  }), tab === "participants" && /*#__PURE__*/React.createElement(ParticipantsTab, {
    participants: DATA.participants,
    search: search,
    onSearch: setSearch,
    onOpen: setDetail
  }), tab === "caregivers" && /*#__PURE__*/React.createElement(CaregiversTab, {
    caregivers: DATA.caregivers,
    onOpen: setDetail
  }), tab === "tasks" && /*#__PURE__*/React.createElement(TasksTab, {
    tasks: tasks,
    onDecide: id => setTasks(tasks.filter(t => t.id !== id))
  }), !["participants", "caregivers", "tasks"].includes(tab) && /*#__PURE__*/React.createElement(EmptyState, {
    icon: "layout-dashboard",
    title: tabs.find(t => t.key === tab).label + " is not part of this UI kit",
    description: "This tab exists in the product; its source was not read for this recreation."
  })), /*#__PURE__*/React.createElement(Dialog, {
    open: !!detail,
    onClose: () => setDetail(null),
    maxWidth: 672,
    title: detail && detail.name,
    description: detail && (detail.email || "Supporting " + detail.participant)
  }, detail && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      alignItems: "center"
    }
  }, detail.status ? /*#__PURE__*/React.createElement(StatusBadge, {
    status: detail.status
  }) : /*#__PURE__*/React.createElement(Badge, {
    variant: "secondary"
  }, detail.caregivers, " caregivers"), detail.state && /*#__PURE__*/React.createElement(Badge, {
    variant: "tint"
  }, detail.state)), detail.progress !== undefined && /*#__PURE__*/React.createElement(ProgressRow, {
    value: detail.progress
  }), /*#__PURE__*/React.createElement(Card, {
    padded: true
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: "var(--text-xs)",
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "var(--tracking-wide)",
      color: "var(--muted-foreground)"
    }
  }, "Coordinator notes"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "6px 0 0",
      fontSize: "var(--text-sm)",
      color: "var(--muted-foreground)"
    }
  }, "The product's detail modal carries onboarding tabs, notes, goals, medications and shift logs \u2014 not recreated here.")))));
}
ReactDOM.createRoot(document.getElementById("root")).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin-dashboard/app.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin-dashboard/data.js
try { (() => {
window.CLAIRO_ADMIN = {
  user: {
    full_name: "Logan Stone"
  },
  stats: [{
    icon: "user",
    label: "Participants",
    value: 12,
    tone: "participant"
  }, {
    icon: "users",
    label: "Total Caregivers",
    value: 18,
    tone: "blue"
  }, {
    icon: "alert-circle",
    label: "Tasks to Review",
    value: 4,
    tone: "participant"
  }],
  participants: [{
    id: "p1",
    name: "Micah Doyle",
    email: "robin.carter@email.com",
    tags: ["CPS", "First Aid"],
    caregivers: 3,
    pending: 2,
    goalsNeeded: false
  }, {
    id: "p2",
    name: "Priya Nair",
    email: "s.nair@email.com",
    tags: ["CMT"],
    caregivers: 2,
    pending: 0,
    goalsNeeded: true
  }, {
    id: "p3",
    name: "Elliot Vance",
    email: "vance.family@email.com",
    tags: [],
    caregivers: 1,
    pending: 1,
    goalsNeeded: false
  }],
  caregivers: [{
    id: "c1",
    name: "Jane Smith",
    participant: "Micah Doyle",
    state: "MD",
    status: "in_progress",
    progress: 62,
    pending: 1
  }, {
    id: "c2",
    name: "Ana Reyes",
    participant: "Micah Doyle",
    state: "MD",
    status: "approved",
    progress: 100,
    pending: 0
  }, {
    id: "c3",
    name: "Dev Patel",
    participant: "Micah Doyle",
    state: "MD",
    status: "invited",
    progress: 0,
    pending: 0
  }, {
    id: "c4",
    name: "Marcus Lee",
    participant: "Priya Nair",
    state: "PA",
    status: "pending_review",
    progress: 92,
    pending: 3
  }],
  tasks: [{
    id: "t1",
    caregiver: "Jane Smith",
    title: "Auto Insurance Card or Declaration Page",
    category: "📄",
    submitted: "Aug 9"
  }, {
    id: "t2",
    caregiver: "Marcus Lee",
    title: "CPR & First Aid Certification",
    category: "📄",
    submitted: "Aug 8"
  }, {
    id: "t3",
    caregiver: "Marcus Lee",
    title: "Complete Relias Trainings",
    category: "🎓",
    submitted: "Aug 8"
  }, {
    id: "t4",
    caregiver: "Ana Reyes",
    title: "DOC Tax Exemption Attestation",
    category: "✍️",
    submitted: "Aug 7"
  }]
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin-dashboard/data.js", error: String((e && e.message) || e) }); }

// ui_kits/caregiver-portal/AllDoneScreen.jsx
try { (() => {
const {
  HeroPanel,
  Card,
  Icon,
  Alert
} = window.ClairoCareDesignSystem_7d6804;
function AllDoneScreen({
  caregiver
}) {
  const checklist = ["FMCS app (or LTSS Maryland app) — clock in and log your daily notes here", "Everee app downloaded — check your pay stubs and direct deposit info", "LTSS Maryland portal account is active", "Coordinator's contact info saved in your phone", "You know how to clock in, clock out, and write your daily note", "Review your participant's care notes before your first shift"];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: 24
    }
  }, /*#__PURE__*/React.createElement(HeroPanel, {
    gradient: true,
    style: {
      textAlign: "center",
      padding: 32
    },
    title: "You're officially in!",
    eyebrow: /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: "var(--text-5xl)",
        lineHeight: 1
      }
    }, "\uD83C\uDF89"),
    subtitle: "Your coordinator will be in touch soon to begin scheduling your first shift."
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: "var(--text-base)",
      color: "var(--text-accent-on-navy)"
    }
  }, "Welcome to the Clairo Care family, ", caregiver.full_name.split(" ")[0], "!")), /*#__PURE__*/React.createElement(Card, {
    style: {
      borderRadius: "var(--radius-2xl)",
      padding: 24,
      display: "grid",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontSize: "var(--text-lg)",
      fontWeight: 700,
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--clairo-blue)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "smartphone",
    size: 20
  })), "You're Ready \u2014 Here's Your Reminder Checklist"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: 12
    }
  }, checklist.map(c => /*#__PURE__*/React.createElement("div", {
    key: c,
    style: {
      display: "flex",
      gap: 12,
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--status-approved-solid)",
      marginTop: 2
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check-circle-2",
    size: 16
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: "var(--text-sm)"
    }
  }, c))))), /*#__PURE__*/React.createElement(Alert, {
    tone: "info",
    icon: "help-circle",
    title: "Have questions?"
  }, "Reach out to your coordinator at ", /*#__PURE__*/React.createElement("a", {
    href: "mailto:hello@clairo.care"
  }, "hello@clairo.care"), " \u2014 we're here to help!"));
}
window.AllDoneScreen = AllDoneScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/caregiver-portal/AllDoneScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/caregiver-portal/DayPortalScreen.jsx
try { (() => {
const {
  HeroPanel,
  Card,
  Button,
  Badge,
  Icon,
  Alert,
  Dialog,
  Input,
  Textarea,
  Label,
  StatusBadge
} = window.ClairoCareDesignSystem_7d6804;
function DayPortalScreen({
  caregiver,
  participant,
  goals,
  meds,
  shifts,
  onAddShift
}) {
  const [week, setWeek] = React.useState(0);
  const [openShift, setOpenShift] = React.useState(false);
  const thisWeek = shifts.reduce((s, x) => s + x.hours, 0);
  const WeekButton = ({
    i,
    label,
    range,
    hours
  }) => /*#__PURE__*/React.createElement("button", {
    onClick: () => setWeek(i),
    style: {
      flex: 1,
      textAlign: "left",
      padding: 12,
      borderRadius: "var(--radius-xl)",
      cursor: "pointer",
      border: "1px solid " + (week === i ? "var(--clairo-blue)" : "var(--border)"),
      background: week === i ? "color-mix(in srgb, var(--clairo-blue) 5%, transparent)" : "var(--card)",
      fontFamily: "var(--font-sans)"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: "var(--text-xs)",
      fontWeight: 600
    }
  }, label), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: "var(--text-11)",
      color: "var(--muted-foreground)"
    }
  }, range), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "4px 0 0",
      fontSize: "var(--text-sm)",
      fontWeight: 700,
      color: "var(--clairo-navy)"
    }
  }, hours.toFixed(2), " hrs"));
  return /*#__PURE__*/React.createElement("main", {
    style: {
      maxWidth: 896,
      margin: "0 auto",
      padding: "32px 16px",
      display: "grid",
      gap: 24
    }
  }, /*#__PURE__*/React.createElement(HeroPanel, {
    gradient: true,
    eyebrow: "Welcome back \uD83D\uDC4B",
    title: caregiver.full_name,
    subtitle: "Supporting " + participant.participant_name + " · Community caregiver"
  }), /*#__PURE__*/React.createElement(Alert, {
    tone: "warning",
    title: "Upcoming expirations"
  }, "First Aid / CPR: 18 days left"), /*#__PURE__*/React.createElement(Card, {
    style: {
      padding: 20,
      borderColor: "color-mix(in srgb, var(--clairo-blue) 30%, transparent)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      alignItems: "center",
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 36,
      borderRadius: "var(--radius-sm)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "color-mix(in srgb, var(--clairo-blue) 10%, transparent)",
      color: "var(--clairo-blue)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "calendar-days",
    size: 20
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontSize: "var(--text-base)",
      fontWeight: 700
    }
  }, "Report Your Hours"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: "var(--text-xs)",
      color: "var(--muted-foreground)"
    }
  }, "Log each shift's hours, goals, and notes."))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement(WeekButton, {
    i: 0,
    label: "This Week",
    range: "Aug 10 \u2013 Today",
    hours: thisWeek
  }), /*#__PURE__*/React.createElement(WeekButton, {
    i: -1,
    label: "Last Week",
    range: "Aug 3 \u2013 Aug 9",
    hours: 0
  })), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "xl",
    style: {
      width: "100%"
    },
    onClick: () => setOpenShift(true)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "sparkles",
    size: 16
  }), " Add Shift for ", week === 0 ? "This Week" : "Last Week"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "8px 0 0",
      textAlign: "center",
      fontSize: "var(--text-11)",
      color: "var(--muted-foreground)"
    }
  }, "Remember to also clock in/out with the Evvie EVV app for every shift.")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: "0 0 12px",
      fontSize: "var(--text-lg)",
      fontWeight: 700,
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--clairo-blue)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "pill",
    size: 20
  })), " Medication Administration"), /*#__PURE__*/React.createElement(Card, {
    padded: true
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "0 0 12px",
      fontSize: "var(--text-sm)",
      fontWeight: 600
    }
  }, "Other Medications"), /*#__PURE__*/React.createElement("div", null, meds.map((m, i) => /*#__PURE__*/React.createElement("button", {
    key: m.id,
    style: {
      width: "100%",
      display: "flex",
      gap: 12,
      alignItems: "center",
      textAlign: "left",
      padding: "12px 8px",
      background: "transparent",
      border: "none",
      borderTop: i ? "1px solid var(--border)" : "none",
      cursor: "pointer",
      fontFamily: "var(--font-sans)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 32,
      height: 32,
      borderRadius: "var(--radius-full)",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      background: "color-mix(in srgb, var(--clairo-blue) 10%, transparent)",
      color: "var(--clairo-blue)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "pill",
    size: 16
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontSize: "var(--text-sm)",
      fontWeight: 600
    }
  }, m.name), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontSize: "var(--text-xs)",
      color: "var(--muted-foreground)"
    }
  }, m.time)), /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-right",
    size: 16
  })))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontSize: "var(--text-lg)",
      fontWeight: 700
    }
  }, "Goals"), /*#__PURE__*/React.createElement("button", {
    style: {
      background: "none",
      border: "none",
      cursor: "pointer",
      color: "var(--clairo-blue)",
      fontFamily: "var(--font-sans)",
      fontSize: "var(--text-sm)",
      fontWeight: 500,
      display: "inline-flex",
      gap: 4,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "history",
    size: 16
  }), " View History")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: 8
    }
  }, goals.map(g => /*#__PURE__*/React.createElement(Card, {
    key: g.id,
    padded: true,
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
      cursor: "pointer"
    },
    onClick: () => setOpenShift(true)
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: "var(--text-sm)",
      fontWeight: 600
    }
  }, g.title), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "2px 0 0",
      fontSize: "var(--text-xs)",
      color: "var(--muted-foreground)"
    }
  }, g.description)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    variant: "outline"
  }, g.input_type), /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-right",
    size: 16
  })))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: "0 0 12px",
      fontSize: "var(--text-lg)",
      fontWeight: 700
    }
  }, "Recent Activity"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: 8
    }
  }, shifts.map(s => /*#__PURE__*/React.createElement(Card, {
    key: s.id,
    style: {
      padding: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: "var(--text-sm)",
      fontWeight: 600
    }
  }, s.date), /*#__PURE__*/React.createElement(Badge, {
    variant: "tint"
  }, s.hours, " hrs")), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "4px 0 0",
      fontSize: "var(--text-xs)",
      color: "var(--muted-foreground)"
    }
  }, s.notes))))), /*#__PURE__*/React.createElement(Card, {
    padded: true,
    style: {
      display: "flex",
      gap: 12,
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--clairo-blue)",
      marginTop: 2
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "info",
    size: 20
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: "var(--text-sm)",
      fontWeight: 600
    }
  }, "Questions about your pay?"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "2px 0 0",
      fontSize: "var(--text-xs)",
      color: "var(--muted-foreground)"
    }
  }, "For pay stubs, direct deposit, and payroll questions, visit ", /*#__PURE__*/React.createElement("a", {
    href: "https://www.everee.com"
  }, "everee.com"), "."))), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    size: "xl",
    style: {
      width: "100%",
      borderColor: "var(--status-rejected-border)",
      color: "var(--status-rejected-fg)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "alert-triangle",
    size: 16
  }), " Report an Incident"), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    size: "xl",
    style: {
      width: "100%"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--clairo-blue)",
      display: "inline-flex"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "shield-check",
    size: 16
  })), " View Certifications & Expirations"), /*#__PURE__*/React.createElement(Dialog, {
    open: openShift,
    onClose: () => setOpenShift(false),
    title: "Add a shift",
    description: "This Week \xB7 Aug 10 \u2013 Today",
    maxWidth: 512,
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "outline",
      onClick: () => setOpenShift(false)
    }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      onClick: () => {
        onAddShift();
        setOpenShift(false);
      }
    }, "Save Shift"))
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Label, null, "Shift date *"), /*#__PURE__*/React.createElement(Input, {
    type: "date",
    defaultValue: "2026-08-10"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Label, null, "Hours worked *"), /*#__PURE__*/React.createElement(Input, {
    type: "number",
    step: "0.25",
    defaultValue: "6"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Label, null, "Community Outings"), /*#__PURE__*/React.createElement(Textarea, {
    placeholder: "Note the location, who the client interacted with, and how they responded."
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Label, null, "Daily note *"), /*#__PURE__*/React.createElement(Textarea, {
    placeholder: "What happened during the shift?"
  })))));
}
window.DayPortalScreen = DayPortalScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/caregiver-portal/DayPortalScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/caregiver-portal/OnboardingScreen.jsx
try { (() => {
const {
  HeroPanel,
  Progress,
  StepChips,
  TaskCard,
  UploadDropzone,
  Button,
  Icon,
  Alert
} = window.ClairoCareDesignSystem_7d6804;
function OnboardingScreen({
  caregiver,
  steps,
  current,
  onSelectStep,
  onAdvance,
  onSubmitTask,
  openTask,
  onToggleTask
}) {
  const step = steps[current];
  const allTasks = steps.flatMap(s => s.tasks);
  const done = allTasks.filter(t => t.status === "approved" || t.status === "submitted").length;
  const overall = Math.round(done / allTasks.length * 100);
  const stepDone = step.tasks.length > 0 && step.tasks.every(t => ["approved", "submitted"].includes(t.status));
  const pending = stepDone && step.tasks.some(t => t.status === "submitted");
  const chips = steps.map((s, i) => {
    const req = s.tasks;
    const state = req.length === 0 ? i <= current ? "todo" : "locked" : req.every(t => t.status === "approved") ? "approved" : req.some(t => t.status === "submitted") ? "pending" : "todo";
    return {
      emoji: s.emoji,
      title: s.title,
      state,
      hint: state === "pending" ? "Pending admin approval" : undefined
    };
  });
  return /*#__PURE__*/React.createElement("main", {
    style: {
      maxWidth: 896,
      margin: "0 auto",
      padding: "32px 16px",
      display: "grid",
      gap: 32
    }
  }, /*#__PURE__*/React.createElement(HeroPanel, {
    eyebrow: "Welcome back \uD83D\uDC4B",
    title: caregiver.full_name,
    subtitle: "You're doing great \u2014 keep it up!"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      fontSize: "var(--text-xs)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "rgba(255,255,255,.7)"
    }
  }, "Overall progress"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--text-accent-on-navy)",
      fontWeight: 600
    }
  }, overall, "% complete")), /*#__PURE__*/React.createElement(Progress, {
    value: overall,
    onNavy: true
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(StepChips, {
    steps: chips,
    current: current,
    onSelect: onSelectStep
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 24,
      display: "grid",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontSize: "var(--text-xl)",
      fontWeight: 700
    }
  }, step.emoji, " ", step.title), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "4px 0 0",
      fontSize: "var(--text-sm)",
      color: "var(--muted-foreground)"
    }
  }, step.description), step.tasks.length > 0 && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "4px 0 0",
      fontSize: "var(--text-xs)",
      color: "var(--muted-foreground)"
    }
  }, step.tasks.filter(t => t.status === "approved").length, " of ", step.tasks.length, " required tasks approved")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: 12
    }
  }, step.tasks.map(task => /*#__PURE__*/React.createElement(TaskCard, {
    key: task.title,
    emoji: task.emoji,
    title: task.title,
    description: task.description,
    status: task.status,
    expanded: openTask === task.title,
    onToggle: () => onToggleTask(task.title)
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "color-mix(in srgb, var(--secondary) 40%, transparent)",
      borderRadius: "var(--radius-xl)",
      padding: 12
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: "var(--text-sm)",
      color: "var(--muted-foreground)",
      lineHeight: "20px"
    }
  }, task.description)), task.status === "submitted" ? /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: "var(--text-sm)",
      color: "var(--status-submitted-fg)"
    }
  }, "\u2713 File submitted \u2014 waiting for review.") : /*#__PURE__*/React.createElement(UploadDropzone, {
    onSelect: () => onSubmitTask(task.title)
  }))))), stepDone && /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: "var(--radius-xl)",
      padding: 16,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 16,
      background: pending ? "var(--status-submitted-surface)" : "var(--status-approved-surface)",
      border: "1px solid " + (pending ? "var(--status-submitted-border)" : "var(--status-approved-border)")
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: "var(--text-sm)",
      fontWeight: 600,
      color: pending ? "var(--status-submitted-strong)" : "var(--status-approved-strong)"
    }
  }, pending ? "Submitted — pending admin review" : "Step complete! 🎉"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "2px 0 0",
      fontSize: "var(--text-xs)",
      color: pending ? "var(--status-submitted-fg)" : "var(--status-approved-fg)"
    }
  }, pending ? "You can continue to the next step and come back here any time." : "Ready to move on to the next step?")), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: pending ? "default" : "success",
    onClick: onAdvance,
    style: pending ? {
      background: "var(--status-submitted-solid)",
      color: "#fff"
    } : undefined
  }, current === steps.length - 2 ? "Finish & Review" : "Next Step", " ", /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-right",
    size: 16
  }))), step.tasks.length === 0 && /*#__PURE__*/React.createElement(AllDoneScreen, {
    caregiver: caregiver
  }))));
}
window.OnboardingScreen = OnboardingScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/caregiver-portal/OnboardingScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/caregiver-portal/WelcomeScreen.jsx
try { (() => {
const {
  Button,
  Icon,
  Callout,
  Logo,
  Card
} = window.ClairoCareDesignSystem_7d6804;
function WelcomeScreen({
  caregiver,
  onGetStarted
}) {
  const items = [{
    icon: "pen-line",
    title: "Complete your application",
    desc: "A short form with your personal info and background disclosure."
  }, {
    icon: "shield",
    title: "Background check & certifications",
    desc: "We'll walk you through each required step."
  }, {
    icon: "graduation-cap",
    title: "Training & account setup",
    desc: "Complete your Relias trainings and get set up on our platforms."
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: "100vh",
      background: "var(--background)",
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      background: "var(--clairo-navy)",
      padding: "16px 24px"
    }
  }, /*#__PURE__*/React.createElement(Logo, {
    size: "sm",
    dark: true
  })), /*#__PURE__*/React.createElement("main", {
    style: {
      flex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "48px 16px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 512,
      width: "100%",
      display: "grid",
      gap: 32
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      display: "grid",
      gap: 12,
      justifyItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 64,
      height: 64,
      borderRadius: "var(--radius-full)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "color-mix(in srgb, var(--clairo-blue) 10%, transparent)",
      color: "var(--clairo-blue)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "heart",
    size: 32
  })), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontSize: "var(--text-3xl)",
      lineHeight: "var(--leading-3xl)",
      fontWeight: 700
    }
  }, "Welcome, ", caregiver.full_name.split(" ")[0], "! \uD83D\uDC4B"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: "var(--text-lg)",
      color: "var(--muted-foreground)"
    }
  }, "We're so glad you're here. Let's get your onboarding started.")), /*#__PURE__*/React.createElement(Card, {
    style: {
      borderRadius: "var(--radius-2xl)",
      padding: 24,
      display: "grid",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontSize: "var(--text-sm)",
      fontWeight: 600
    }
  }, "Here's what to expect:"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: 12
    }
  }, items.map(it => /*#__PURE__*/React.createElement("div", {
    key: it.title,
    style: {
      display: "flex",
      gap: 12,
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 32,
      height: 32,
      flexShrink: 0,
      borderRadius: "var(--radius-sm)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "color-mix(in srgb, var(--clairo-blue) 10%, transparent)",
      color: "var(--clairo-blue)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: it.icon,
    size: 16
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: "var(--text-sm)",
      fontWeight: 500
    }
  }, it.title), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: "var(--text-xs)",
      color: "var(--muted-foreground)"
    }
  }, it.desc)))))), /*#__PURE__*/React.createElement(Callout, null, "\uD83D\uDC99 Your coordinator Logan Stone is here to help every step of the way.", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-xs)",
      color: "var(--muted-foreground)"
    }
  }, "Questions? Reach out at ", /*#__PURE__*/React.createElement("a", {
    href: "mailto:hello@clairo.care"
  }, "hello@clairo.care"))), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "xl",
    style: {
      width: "100%"
    },
    onClick: onGetStarted
  }, "Let's Get Started ", /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-right",
    size: 20
  })))));
}
window.WelcomeScreen = WelcomeScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/caregiver-portal/WelcomeScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/caregiver-portal/app.jsx
try { (() => {
const {
  PortalHeader,
  Badge,
  Icon,
  Button
} = window.ClairoCareDesignSystem_7d6804;
const DATA = window.CLAIRO_CAREGIVER;
function App() {
  const [screen, setScreen] = React.useState("welcome");
  const [steps, setSteps] = React.useState(DATA.steps);
  const [current, setCurrent] = React.useState(2);
  const [openTask, setOpenTask] = React.useState(null);
  const [shifts, setShifts] = React.useState(DATA.shifts);
  const submitTask = title => setSteps(prev => prev.map(s => ({
    ...s,
    tasks: s.tasks.map(t => t.title === title ? {
      ...t,
      status: "submitted"
    } : t)
  })));
  const advance = () => {
    if (current < steps.length - 1) setCurrent(current + 1);
    if (current === steps.length - 2) setScreen("done");
  };
  if (screen === "welcome") {
    return /*#__PURE__*/React.createElement(WelcomeScreen, {
      caregiver: DATA.caregiver,
      onGetStarted: () => setScreen("onboarding")
    });
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: "100vh",
      background: "var(--background)"
    }
  }, /*#__PURE__*/React.createElement(PortalHeader, {
    maxWidth: 896
  }, /*#__PURE__*/React.createElement(Badge, {
    variant: "onNavy"
  }, DATA.caregiver.state, " \xB7 ", DATA.caregiver.program), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "rgba(255,255,255,.8)",
      fontSize: "var(--text-sm)",
      fontWeight: 500
    }
  }, DATA.caregiver.full_name), /*#__PURE__*/React.createElement(Button, {
    variant: "onNavy",
    size: "sm",
    onClick: () => setScreen(screen === "day" ? "onboarding" : "day")
  }, /*#__PURE__*/React.createElement(Icon, {
    name: screen === "day" ? "list-checks" : "calendar-days",
    size: 14
  }), " ", screen === "day" ? "Onboarding" : "Day Portal"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "rgba(255,255,255,.6)",
      display: "inline-flex"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "log-out",
    size: 16
  }))), screen === "day" ? /*#__PURE__*/React.createElement(DayPortalScreen, {
    caregiver: DATA.caregiver,
    participant: DATA.participant,
    goals: DATA.goals,
    meds: DATA.meds,
    shifts: shifts,
    onAddShift: () => setShifts([{
      id: "new",
      date: "Aug 10, 2026",
      hours: 6,
      notes: "Community outing to the library; strong engagement."
    }, ...shifts])
  }) : screen === "done" ? /*#__PURE__*/React.createElement("main", {
    style: {
      maxWidth: 896,
      margin: "0 auto",
      padding: "32px 16px",
      display: "grid",
      gap: 24
    }
  }, /*#__PURE__*/React.createElement(AllDoneScreen, {
    caregiver: DATA.caregiver
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "xl",
    onClick: () => setScreen("day")
  }, "Go to my Day Portal ", /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-right",
    size: 20
  }))) : /*#__PURE__*/React.createElement(OnboardingScreen, {
    caregiver: DATA.caregiver,
    steps: steps,
    current: current,
    onSelectStep: setCurrent,
    onAdvance: advance,
    onSubmitTask: submitTask,
    openTask: openTask,
    onToggleTask: t => setOpenTask(openTask === t ? null : t)
  }));
}
ReactDOM.createRoot(document.getElementById("root")).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/caregiver-portal/app.jsx", error: String((e && e.message) || e) }); }

// ui_kits/caregiver-portal/data.js
try { (() => {
window.CLAIRO_CAREGIVER = {
  caregiver: {
    full_name: "Jane Smith",
    state: "MD",
    program: "DDA",
    is_live_in_caregiver: false
  },
  participant: {
    participant_name: "Micah Doyle"
  },
  steps: [{
    emoji: "👋",
    title: "Welcome",
    description: "Let's get you started with your Clairo Care application.",
    tasks: [{
      emoji: "✍️",
      title: "Caregiver Application",
      description: "Complete your full caregiver application. Your name, email, and phone are pre-filled from your account.",
      status: "approved"
    }]
  }, {
    emoji: "🪪",
    title: "Background Check",
    description: "Complete your background check.",
    tasks: [{
      emoji: "📄",
      title: "Background Check (Certn)",
      description: "Complete your background check through Certn, our secure screening partner. Have your government-issued ID ready — it takes about 5–10 minutes.",
      status: "approved"
    }]
  }, {
    emoji: "🩺",
    title: "First Aid Certification",
    description: "Provide your First Aid / CPR certification details.",
    tasks: [{
      emoji: "📄",
      title: "First Aid & CPR Certification",
      description: "Provide your First Aid certification details. If you don't have a current cert, your coordinator will share info about upcoming classes.",
      status: "not_started"
    }]
  }, {
    emoji: "🚗",
    title: "Auto Insurance",
    description: "Upload proof of your current auto insurance. You'll need this if you plan to transport the participant.",
    tasks: [{
      emoji: "📄",
      title: "Auto Insurance Card or Declaration Page",
      description: "Please upload a copy of your current auto insurance card or policy declaration page.",
      status: "not_started"
    }]
  }, {
    emoji: "🎓",
    title: "Relias Training",
    description: "This is a few hours of required trainings in Relias. Get started here, but in the meantime, go ahead and set up your accounts in the next step — you don't need to wait for Relias to finish.",
    tasks: [{
      emoji: "🎓",
      title: "Complete Relias Trainings",
      description: "Your coordinator will send you a Relias invite by email. Create your account, complete all assigned trainings, then upload your completion certificate.",
      status: "not_started"
    }]
  }, {
    emoji: "📱",
    title: "Account Setup",
    description: "Your coordinator is setting up your accounts on Everee and LTSS. Download the apps and verify your login once they're ready.",
    tasks: [{
      emoji: "🎓",
      title: "Verify Your Accounts",
      description: "Once your accounts are set up, download and log into Everee and the LTSS Maryland app. Confirm everything is working, then mark this complete.",
      status: "not_started"
    }]
  }, {
    emoji: "🎉",
    title: "All Done!",
    description: "Your onboarding is complete — welcome to the Clairo Care family!",
    tasks: []
  }],
  goals: [{
    id: "g1",
    title: "Community Outings",
    description: "Where did the client visit in the community?",
    input_type: "text and rating"
  }, {
    id: "g2",
    title: "Hygiene",
    description: "Washing Hands",
    input_type: "checkbox"
  }],
  meds: [{
    id: "m1",
    name: "Levothyroxine",
    time: "Today - 9:00 AM"
  }, {
    id: "m2",
    name: "PRN: Ibuprofen",
    time: "No set administration time."
  }],
  shifts: [{
    id: "s1",
    date: "Aug 8, 2026",
    hours: 6.5,
    notes: "Visited the library and the park. Micah greeted two neighbours without prompting."
  }, {
    id: "s2",
    date: "Aug 7, 2026",
    hours: 4,
    notes: "Grocery trip; practised handwashing routine with verbal prompts only."
  }]
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/caregiver-portal/data.js", error: String((e && e.message) || e) }); }

// ui_kits/family-portal/FamilyPortalHome.jsx
try { (() => {
const {
  HeroPanel,
  Card,
  Badge,
  Button,
  Icon,
  Avatar,
  ProgressRow,
  Callout,
  StatusBadge,
  Alert,
  UploadDropzone
} = window.ClairoCareDesignSystem_7d6804;
function FamilyPortalHome({
  participant,
  caregivers,
  onInvite
}) {
  return /*#__PURE__*/React.createElement("main", {
    style: {
      maxWidth: 896,
      margin: "0 auto",
      padding: "32px 16px",
      display: "grid",
      gap: 24
    }
  }, /*#__PURE__*/React.createElement(HeroPanel, {
    eyebrow: "Family Portal",
    title: participant.participant_name,
    subtitle: "Intake submitted \u2014 caregivers have been invited."
  }, /*#__PURE__*/React.createElement(Badge, {
    style: {
      background: "color-mix(in srgb, var(--status-approved-solid) 20%, transparent)",
      color: "#86efac"
    }
  }, "Submitted")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "color-mix(in srgb, var(--clairo-blue) 10%, transparent)",
      border: "2px solid color-mix(in srgb, var(--clairo-blue) 40%, transparent)",
      borderRadius: "var(--radius-2xl)",
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12,
      alignItems: "flex-start",
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 36,
      borderRadius: "var(--radius-full)",
      background: "var(--clairo-blue)",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check-circle-2",
    size: 20
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: "var(--text-base)",
      fontWeight: 700
    }
  }, "You're enrolled as a caregiver too!"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "2px 0 0",
      fontSize: "var(--text-sm)",
      color: "var(--muted-foreground)"
    }
  }, "You still need to complete your own onboarding checklist before you can start providing services."))), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    style: {
      width: "100%"
    }
  }, "Start My Caregiver Onboarding ", /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-right",
    size: 16
  }))), /*#__PURE__*/React.createElement("div", {
    onClick: onInvite,
    style: {
      position: "relative",
      overflow: "hidden",
      cursor: "pointer",
      borderRadius: "var(--radius-2xl)",
      border: "2px solid color-mix(in srgb, var(--clairo-blue) 60%, transparent)",
      background: "linear-gradient(to bottom right, color-mix(in srgb, var(--clairo-blue) 10%, transparent), color-mix(in srgb, var(--clairo-blue) 20%, transparent))",
      padding: 24,
      boxShadow: "var(--shadow-sm)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 16,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 48,
      height: 48,
      borderRadius: "var(--radius-full)",
      background: "var(--clairo-blue)",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      boxShadow: "var(--shadow-md)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 24
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: "var(--text-base)",
      fontWeight: 700
    }
  }, "Make sure your whole team has been invited! \uD83D\uDC65"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "2px 0 0",
      fontSize: "var(--text-sm)",
      color: "var(--muted-foreground)"
    }
  }, "The sooner everyone completes their onboarding, the sooner services can start. Tap here to invite another caregiver.")), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--clairo-blue)",
      opacity: .6
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-right",
    size: 20
  })))), /*#__PURE__*/React.createElement(Card, {
    style: {
      borderRadius: "var(--radius-2xl)",
      padding: 24,
      display: "grid",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: "var(--text-sm)",
      fontWeight: 700
    }
  }, "Upload your budget & PCP"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "2px 0 0",
      fontSize: "var(--text-xs)",
      color: "var(--muted-foreground)"
    }
  }, "Your coordinator needs the approved budget and the Person-Centred Plan to finish setup.")), /*#__PURE__*/React.createElement(UploadDropzone, {
    onSelect: () => {},
    label: "Click to upload budget or PCP"
  })), /*#__PURE__*/React.createElement(Alert, {
    tone: "info",
    icon: "calendar-days",
    title: "Next step: your CCS/FMCS meeting"
  }, "Confirm the date your Coordinator of Community Services meeting is scheduled so we can align onboarding."), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontSize: "var(--text-base)",
      fontWeight: 700
    }
  }, "Enrolled Caregivers"), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "primary",
    onClick: onInvite
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 16
  }), " Add Caregiver")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: 12
    }
  }, caregivers.map(cg => /*#__PURE__*/React.createElement(Card, {
    key: cg.id,
    padded: true,
    style: {
      display: "grid",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      gap: 12,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12,
      alignItems: "center",
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: cg.full_name,
    size: 36
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: "var(--text-sm)",
      fontWeight: 600,
      display: "flex",
      alignItems: "center",
      gap: 6
    }
  }, cg.full_name, cg.is_family && /*#__PURE__*/React.createElement(Badge, {
    style: {
      background: "var(--entity-family-bg)",
      color: "var(--entity-family-fg)"
    }
  }, "Family")), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: "var(--text-xs)",
      color: "var(--muted-foreground)"
    }
  }, cg.relationship))), /*#__PURE__*/React.createElement(StatusBadge, {
    status: cg.status,
    label: cg.status === "invited" ? "Invite sent" : cg.status === "in_progress" ? "Onboarding" : "Complete ✓"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      alignItems: "center",
      fontSize: "var(--text-xs)",
      color: "var(--muted-foreground)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "mail",
    size: 12
  }), " ", /*#__PURE__*/React.createElement("span", null, cg.email)), cg.progress !== null ? /*#__PURE__*/React.createElement(ProgressRow, {
    value: cg.progress
  }) : /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: "var(--text-xs)",
      fontStyle: "italic",
      color: "var(--muted-foreground)",
      display: "flex",
      gap: 4,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "clock",
    size: 12
  }), " Waiting for caregiver to accept invite"))))), /*#__PURE__*/React.createElement(Callout, null, "\uD83D\uDC99 Questions? Contact your coordinator at ", /*#__PURE__*/React.createElement("a", {
    href: "mailto:hello@clairo.care"
  }, "hello@clairo.care")));
}
window.FamilyPortalHome = FamilyPortalHome;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/family-portal/FamilyPortalHome.jsx", error: String((e && e.message) || e) }); }

// ui_kits/family-portal/app.jsx
try { (() => {
const {
  PortalHeader,
  Icon,
  Dialog,
  Button,
  Input,
  Label,
  Select
} = window.ClairoCareDesignSystem_7d6804;
const DATA = window.CLAIRO_FAMILY;
function App() {
  const [caregivers, setCaregivers] = React.useState(DATA.caregivers);
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({
    full_name: "",
    email: "",
    relationship: "Caregiver"
  });
  const add = () => {
    if (!form.full_name || !form.email) return;
    setCaregivers([...caregivers, {
      id: String(Date.now()),
      full_name: form.full_name,
      email: form.email,
      relationship: form.relationship,
      status: "invited",
      progress: null
    }]);
    setForm({
      full_name: "",
      email: "",
      relationship: "Caregiver"
    });
    setOpen(false);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: "100vh",
      background: "var(--background)"
    }
  }, /*#__PURE__*/React.createElement(PortalHeader, {
    maxWidth: 896
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "rgba(255,255,255,.8)",
      fontSize: "var(--text-sm)",
      fontWeight: 500
    }
  }, DATA.user.full_name), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "rgba(255,255,255,.6)",
      display: "inline-flex"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "log-out",
    size: 16
  }))), /*#__PURE__*/React.createElement(FamilyPortalHome, {
    participant: DATA.participant,
    caregivers: caregivers,
    onInvite: () => setOpen(true)
  }), /*#__PURE__*/React.createElement(Dialog, {
    open: open,
    onClose: () => setOpen(false),
    title: "Add a Caregiver",
    maxWidth: 448,
    description: "They'll receive an invite email to set up their login and start onboarding.",
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "outline",
      onClick: () => setOpen(false)
    }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      onClick: add
    }, "Add & Invite"))
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Label, null, "Full Name *"), /*#__PURE__*/React.createElement(Input, {
    placeholder: "Jane Smith",
    value: form.full_name,
    onChange: e => setForm({
      ...form,
      full_name: e.target.value
    })
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Label, null, "Email Address *"), /*#__PURE__*/React.createElement(Input, {
    type: "email",
    placeholder: "jane@email.com",
    value: form.email,
    onChange: e => setForm({
      ...form,
      email: e.target.value
    })
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Label, null, "Relationship *"), /*#__PURE__*/React.createElement(Select, {
    value: form.relationship,
    onChange: v => setForm({
      ...form,
      relationship: v
    }),
    options: ["Caregiver", "Relative", "Legally Responsible Person", "Legal Guardian"]
  })))));
}
ReactDOM.createRoot(document.getElementById("root")).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/family-portal/app.jsx", error: String((e && e.message) || e) }); }

// ui_kits/family-portal/data.js
try { (() => {
window.CLAIRO_FAMILY = {
  user: {
    full_name: "Robin Carter",
    email: "robin.carter@email.com"
  },
  participant: {
    participant_name: "Micah Doyle"
  },
  caregivers: [{
    id: "c1",
    full_name: "Jane Smith",
    relationship: "Relative",
    email: "jane.smith@email.com",
    status: "in_progress",
    progress: 62,
    is_family: true
  }, {
    id: "c2",
    full_name: "Ana Reyes",
    relationship: "Caregiver",
    email: "ana.reyes@email.com",
    status: "approved",
    progress: 100
  }, {
    id: "c3",
    full_name: "Dev Patel",
    relationship: "Caregiver",
    email: "dev.patel@email.com",
    status: "invited",
    progress: null
  }]
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/family-portal/data.js", error: String((e && e.message) || e) }); }

__ds_ns.EmptyState = __ds_scope.EmptyState;

__ds_ns.HeroPanel = __ds_scope.HeroPanel;

__ds_ns.Logo = __ds_scope.Logo;

__ds_ns.ProgressRow = __ds_scope.ProgressRow;

__ds_ns.StatCard = __ds_scope.StatCard;

__ds_ns.TaskCard = __ds_scope.TaskCard;

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.CardHeader = __ds_scope.CardHeader;

__ds_ns.CardTitle = __ds_scope.CardTitle;

__ds_ns.CardDescription = __ds_scope.CardDescription;

__ds_ns.CardContent = __ds_scope.CardContent;

__ds_ns.CardFooter = __ds_scope.CardFooter;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.Separator = __ds_scope.Separator;

__ds_ns.Skeleton = __ds_scope.Skeleton;

__ds_ns.Table = __ds_scope.Table;

__ds_ns.TableHeader = __ds_scope.TableHeader;

__ds_ns.TableBody = __ds_scope.TableBody;

__ds_ns.TableRow = __ds_scope.TableRow;

__ds_ns.TableHead = __ds_scope.TableHead;

__ds_ns.TableCell = __ds_scope.TableCell;

__ds_ns.Alert = __ds_scope.Alert;

__ds_ns.Callout = __ds_scope.Callout;

__ds_ns.Dialog = __ds_scope.Dialog;

__ds_ns.LoadingScreen = __ds_scope.LoadingScreen;

__ds_ns.Progress = __ds_scope.Progress;

__ds_ns.StatusBadge = __ds_scope.StatusBadge;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Label = __ds_scope.Label;

__ds_ns.RadioGroup = __ds_scope.RadioGroup;

__ds_ns.RadioGroupItem = __ds_scope.RadioGroupItem;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Textarea = __ds_scope.Textarea;

__ds_ns.UploadDropzone = __ds_scope.UploadDropzone;

__ds_ns.PortalHeader = __ds_scope.PortalHeader;

__ds_ns.StepChips = __ds_scope.StepChips;

__ds_ns.StepProgressBar = __ds_scope.StepProgressBar;

__ds_ns.Tabs = __ds_scope.Tabs;

})();
