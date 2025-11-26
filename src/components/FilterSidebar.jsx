import { useMemo, useState } from "react";

function Checkbox({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-2 text-sm text-[#333]">
      <input
        className="h-4 w-4 accent-[#4D47C3]"
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>{label}</span>
    </label>
  );
}

function FilterGroup({ title, items, values, onChange }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="w-full">
      <button
        type="button"
        className="w-full flex items-center justify-between h-[25px]"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="text-[14px] font-medium text-[#464F60] tracking-[0.28px]">
          {title}
        </span>
        <span className="text-[#6155F5]">{open ? "▾" : "▸"}</span>
      </button>
      <div className="h-px bg-[#CFD3D4] my-2" />
      {open && (
        <div className="border border-[#CFD3D4] rounded-bl-[7px] rounded-br-[7px] h-[100px] overflow-auto pr-1">
          <div className="py-2 space-y-1">
            {items.map((label) => (
              <div key={label} className="px-2">
                <Checkbox
                  label={label}
                  checked={!!values[label]}
                  onChange={(v) => onChange(label, v)}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function FilterSidebar({ onApply }) {
  // 🔹 GCF DB 구조에 맞춘 필터 스키마
  const schema = useMemo(
    () => [
      {
        key: "국가/지역",
        title: "By 국가 / 지역",
        items: [
          "Peru",
          "Malawi",
          "Senegal",
          "Bangladesh",
          "Kenya",
          "Rwanda",
          "Maldives",
          "Fiji",
          "El Salvador",
          "Armenia",
          "Gambia",
          "Mali",
          "Viet Nam",
          "Tajikistan",
          "Uzbekistan",
          "Tuvalu",
          "Sri Lanka",
          "Chile",
          "Pakistan",
          "Ecuador",
        ],
      },
      {
        key: "진행 상태",
        title: "By 진행 상태",
        items: ["예정", "진행 중", "완료"],
      },
      {
        key: "주제 영역",
        title: "By 주제 영역",
        items: ["Adaptation", "Mitigation", "Cross-cutting"],
      },
      {
        key: "기관명",
        title: "By 기관명",
        items: [
          "Profonanpe",
          "UNDP",
          "CSE",
          "KfW",
          "Acumen",
          "ADB",
          "IDB",
          "UNEP",
          "WorldBank",
          "CI",
          "ADA_Morocco",
          "EIF",
          "EBRD",
          "AfDB",
          "NABARD",
        ],
      },
      {
        key: "총사업비",
        title: "By 총 사업비 (USD)",
        items: [
          "Small ( ~ $10M )",
          "Medium ( $10M ~ $50M )",
          "Large ( $50M ~ )",
        ],
      },
      {
        key: "공동재원",
        title: "By 공동재원 금액",
        items: [
          "None / Unknown",
          "Small ( ~ $10M )",
          "Medium ( $10M ~ $50M )",
          "Large ( $50M ~ )",
        ],
      },
    ],
    []
  );

  const [values, setValues] = useState(() =>
    Object.fromEntries(schema.map((s) => [s.key, {}]))
  );

  const setItem = (sectionKey, label, v) => {
    setValues((prev) => ({
      ...prev,
      [sectionKey]: { ...prev[sectionKey], [label]: v },
    }));
  };

  const clearAll = () => {
    setValues(Object.fromEntries(schema.map((s) => [s.key, {}])));
    onApply?.({}); // 필터 클리어했을 때 전체 보기
  };

  const buildPayload = () => {
    const selected = {};
    for (const s of schema) {
      const chosen = Object.entries(values[s.key] || {})
        .filter(([, v]) => v)
        .map(([k]) => k);
      if (chosen.length) selected[s.key] = chosen;
    }
    return selected;
  };

  return (
    <aside className="w-[270px] border-l border-[#D9D9D9] bg-white sticky top-20 h-[calc(100vh-80px)]">
      <div className="p-4">
        <h4 className="text-[24px] leading-[24px] mb-4">Filter</h4>
        <div className="flex gap-3">
          <button
            onClick={() => onApply?.(buildPayload())}
            className="bg-[#5E5ADB] text-white rounded-[6px] h-10 px-3 shadow-[0px_1px_1px_rgba(0,0,0,0.1),0_0_0_1px_#5E5ADB]"
          >
            Apply
          </button>
          <button
            onClick={clearAll}
            className="bg-[#D1293D] text-white rounded-[6px] h-10 px-3 shadow-[0px_1px_1px_rgba(0,0,0,0.1),0_0_0_1px_#D1293D]"
          >
            Clear
          </button>
        </div>
      </div>
      <div className="px-4 pb-4 space-y-4 h-[calc(100%-120px)] overflow-auto">
        {schema.map((s) => (
          <FilterGroup
            key={s.key}
            title={s.title}
            items={s.items}
            values={values[s.key] || {}}
            onChange={(label, v) => setItem(s.key, label, v)}
          />
        ))}
      </div>
    </aside>
  );
}
