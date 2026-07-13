"use client";

import { cn } from "@/lib/utils/cn";
import { ChevronDown } from "lucide-react";
import {
  Children,
  isValidElement,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
  type SelectHTMLAttributes,
} from "react";
import { createPortal } from "react-dom";

const MENU_MAX_HEIGHT = 280;
const MENU_GAP = 6;

type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

function parseOptions(children: ReactNode): SelectOption[] {
  const options: SelectOption[] = [];
  Children.forEach(children, (child) => {
    if (!isValidElement(child) || child.type !== "option") return;
    const props = child.props as {
      value?: string | number;
      disabled?: boolean;
      children?: ReactNode;
    };
    options.push({
      value: String(props.value ?? ""),
      label: String(props.children ?? ""),
      disabled: Boolean(props.disabled),
    });
  });
  return options;
}

export type SelectProps = Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "size"
> & {
  variant?: "default" | "underline";
};

export function Select({
  children,
  className,
  value,
  defaultValue,
  onChange,
  disabled,
  required,
  id,
  name,
  variant = "default",
  ...rest
}: SelectProps) {
  const options = useMemo(() => parseOptions(children), [children]);
  const fallbackId = useId();
  const triggerId = id ?? fallbackId;
  const isControlled = value !== undefined;
  const [uncontrolled, setUncontrolled] = useState(
    String(defaultValue ?? options[0]?.value ?? "")
  );
  const current = isControlled ? String(value) : uncontrolled;
  const selected = options.find((o) => o.value === current) ?? options[0];

  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState<"bottom" | "top">("bottom");
  const [menuStyle, setMenuStyle] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const hiddenRef = useRef<HTMLSelectElement>(null);

  function updateMenuPosition() {
    if (!rootRef.current) return;
    const rect = rootRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const openUp = spaceBelow < MENU_MAX_HEIGHT && spaceAbove > spaceBelow;
    const width = Math.max(rect.width, 160);
    const left = Math.min(
      Math.max(8, rect.left),
      window.innerWidth - width - 8
    );

    setPlacement(openUp ? "top" : "bottom");
    setMenuStyle({
      left,
      width,
      top: openUp
        ? Math.max(8, rect.top - MENU_MAX_HEIGHT - MENU_GAP)
        : rect.bottom + MENU_GAP,
    });
  }

  useLayoutEffect(() => {
    if (!open) return;
    updateMenuPosition();
  }, [open, options.length]);

  useEffect(() => {
    if (!open) return;

    function handleClick(e: MouseEvent) {
      const target = e.target as Node;
      if (rootRef.current?.contains(target)) return;
      if ((target as HTMLElement).closest?.("[data-ui-select-menu]")) return;
      setOpen(false);
    }

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    function handleReposition() {
      updateMenuPosition();
    }

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    window.addEventListener("resize", handleReposition);
    window.addEventListener("scroll", handleReposition, true);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
      window.removeEventListener("resize", handleReposition);
      window.removeEventListener("scroll", handleReposition, true);
    };
  }, [open]);

  function selectValue(next: string) {
    if (!isControlled) setUncontrolled(next);
    onChange?.({
      target: { value: next, name: name ?? "" },
      currentTarget: { value: next, name: name ?? "" },
    } as ChangeEvent<HTMLSelectElement>);
    setOpen(false);
  }

  const isUnderline = variant === "underline";
  const placeholderLike =
    !selected?.label ||
    selected.label.startsWith("Select ") ||
    selected.value === "";

  const menu =
    open && menuStyle ? (
      <div
        data-ui-select-menu
        role="listbox"
        style={{
          position: "fixed",
          top: menuStyle.top,
          left: menuStyle.left,
          width: menuStyle.width,
          maxHeight: MENU_MAX_HEIGHT,
          zIndex: 120,
        }}
        className={cn(
          "ui-dropdown-menu ui-dropdown-menu--scroll",
          placement === "top" ? "origin-bottom" : "origin-top"
        )}
      >
        {options.map((option) => {
          const isSelected = option.value === current;
          return (
            <button
              key={`${option.value}-${option.label}`}
              type="button"
              role="option"
              aria-selected={isSelected}
              disabled={option.disabled}
              onClick={() => selectValue(option.value)}
              className="ui-dropdown-option"
            >
              {option.label}
            </button>
          );
        })}
      </div>
    ) : null;

  return (
    <div ref={rootRef} className={cn("relative w-full", className)}>
      <select
        ref={hiddenRef}
        tabIndex={-1}
        aria-hidden
        className="pointer-events-none absolute h-0 w-0 opacity-0"
        name={name}
        value={current}
        required={required}
        disabled={disabled}
        {...rest}
        onChange={() => {}}
      >
        {options.map((option) => (
          <option key={`${option.value}-${option.label}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <button
        id={triggerId}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "ui-select-trigger",
          isUnderline && "ui-select-trigger--underline",
          placeholderLike && "ui-select-trigger--placeholder"
        )}
      >
        <span className="min-w-0 flex-1 truncate text-left">
          {selected?.label || "Select…"}
        </span>
        <ChevronDown className="ui-select-chevron" aria-hidden />
      </button>

      {typeof document !== "undefined" && menu
        ? createPortal(menu, document.body)
        : null}
    </div>
  );
}

Select.displayName = "Select";
