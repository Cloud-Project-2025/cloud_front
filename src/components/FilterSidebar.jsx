import { useMemo, useState } from "react";

function Checkbox({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-2 text-sm text-[#333]">
      <input className="h-4 w-4 accent-[#4D47C3]" type="checkbox"
             checked={checked} onChange={e=>onChange(e.target.checked)} />
      <span>{label}</span>
    </label>
  );
}

function FilterGroup({ title, items, values, onChange }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="w-full">
      <button type="button" className="w-full flex items-center justify-between h-[25px]"
              onClick={()=>setOpen(o=>!o)} aria-expanded={open}>
        <span className="text-[14px] font-medium text-[#464F60] tracking-[0.28px]">{title}</span>
        <span className="text-[#6155F5]">{open ? "▾" : "▸"}</span>
      </button>
      <div className="h-px bg-[#CFD3D4] my-2" />
      {open && (
        <div className="border border-[#CFD3D4] rounded-bl-[7px] rounded-br-[7px] h-[100px] overflow-auto pr-1">
          <div className="py-2 space-y-1">
            {items.map((label) => (
              <div key={label} className="px-2">
                <Checkbox label={label} checked={!!values[label]} onChange={(v)=>onChange(label, v)} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function FilterSidebar({ onApply }) {
  const schema = useMemo(() => ([
    { key: "국가/지역", title: "By 국가 / 지역", items: ["Afghanistan","Armenia","Azerbaijan","Bangladesh","Bhutan","Brunei Darussalam","Cambodia","China","Fiji","Hong Kong"] },
    { key: "자금형태", title: "By 자금 형태", items: ["Grant","Loan","Guarantee","Equity"] },
    { key: "총사업비", title: "By 총 사업비 ( USD )", items: ["Small ( ~ $1M )","Medium ( $1M ~ $10M )","Large ( $10M ~ )"] },
    { key: "공동재원", title: "By 공동재원 금액", items: ["Small ( ~ $1M )","Medium ( $1M ~ $10M )","Large ( $1M ~ )"] },
    { key: "보조금",   title: "By 보조금", items: ["Small ( ~ $1M )","Medium ( $1M ~ $10M )","Large ( $10M ~ )"] },
    { key: "펀딩형태", title: "By 펀딩 형태", items: ["Private","Public","Blended"] },
    { key: "시행연도", title: "By 시행 년도", items: ["2021","2022","2023","2024","2025"] },
    { key: "위험요소", title: "By 주요 위험요소", items: ["Climate","Geopolitical","Operational","Financial"] },
    { key: "수혜자수", title: "By 수혜자 수", items: ["< 10k","10k ~ 100k","> 100k"] },
  ]), []);

  const [values, setValues] = useState(() =>
    Object.fromEntries(schema.map(s => [s.key, {}]))
  );

  const setItem = (sectionKey, label, v) => {
    setValues(prev => ({ ...prev, [sectionKey]: { ...prev[sectionKey], [label]: v } }));
  };

  const clearAll = () => {
    setValues(Object.fromEntries(schema.map(s => [s.key, {}])));
  };

  const buildPayload = () => {
    const selected = {};
    for (const s of schema) {
      const chosen = Object.entries(values[s.key] || {})
        .filter(([, v]) => v).map(([k]) => k);
      if (chosen.length) selected[s.key] = chosen;
    }
    return selected;
  };

  return (
    <aside className="w-[270px] border-l border-[#D9D9D9] bg-white sticky top-20 h-[calc(100vh-80px)]">
      <div className="p-4">
        <h4 className="text-[24px] leading-[24px] mb-4">Filter</h4>
        <div className="flex gap-3">
          <button onClick={()=>onApply?.(buildPayload())}
                  className="bg-[#5E5ADB] text-white rounded-[6px] h-10 px-3 shadow-[0px_1px_1px_rgba(0,0,0,0.1),0_0_0_1px_#5E5ADB]">Apply</button>
          <button onClick={clearAll}
                  className="bg-[#D1293D] text-white rounded-[6px] h-10 px-3 shadow-[0px_1px_1px_rgba(0,0,0,0.1),0_0_0_1px_#D1293D]">Clear</button>
        </div>
      </div>
      <div className="px-4 pb-4 space-y-4 h-[calc(100%-120px)] overflow-auto">
        {schema.map((s) => (
          <FilterGroup key={s.key} title={s.title} items={s.items}
                       values={values[s.key] || {}} onChange={(label, v)=>setItem(s.key, label, v)} />
        ))}
      </div>
    </aside>
  );
}
