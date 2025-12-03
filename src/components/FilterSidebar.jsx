// src/components/FilterSidebar.jsx
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
      <span className="truncate" title={label}>
        {label}
      </span>
    </label>
  );
}

function FilterGroup({ title, items, values, onChange }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between h-[25px] mb-1">
        <span className="text-[14px] font-medium text-[#464F60] tracking-[0.28px]">
          {title}
        </span>
      </div>
      <div className="h-px bg-[#CFD3D4] mb-2" />
      <div className="border border-[#CFD3D4] rounded-[7px] max-h-[130px] overflow-auto pr-1">
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
    </div>
  );
}

function RangeField({
  label,
  min,
  max,
  onChangeMin,
  onChangeMax,
  placeholderMin,
  placeholderMax,
  type = "number",
}) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between h-[25px] mb-1">
        <span className="text-[14px] font-medium text-[#464F60] tracking-[0.28px]">
          {label}
        </span>
      </div>
      <div className="h-px bg-[#CFD3D4] mb-2" />
      <div className="border border-[#CFD3D4] rounded-[7px] px-2 py-2 space-y-1">
        <div className="flex items-center gap-2">
          <input
            type={type}
            value={min ?? ""}
            onChange={(e) => onChangeMin(e.target.value)}
            placeholder={placeholderMin}
            className="w-full h-8 rounded-[4px] border border-[#D0D5DD] px-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#5E5ADB]"
          />
          <span className="text-xs text-[#667085]">~</span>
          <input
            type={type}
            value={max ?? ""}
            onChange={(e) => onChangeMax(e.target.value)}
            placeholder={placeholderMax}
            className="w-full h-8 rounded-[4px] border border-[#D0D5DD] px-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#5E5ADB]"
          />
        </div>
      </div>
    </div>
  );
}

export default function FilterSidebar({ onApply, sourceProjects = [] }) {
  /**
   * ✅ sourceProjects는 climateDB4 기반 mockProjects라고 가정
   *    → 여기서 실제 값들만 싹 뽑아서 필터 옵션으로 사용
   */

  const statuses = useMemo(
    () =>
      Array.from(
        new Set(
          sourceProjects
            .map((p) => p.status)
            .filter((v) => v && v !== "nan" && v !== "NaN")
        )
      ).sort(),
    [sourceProjects]
  );

  const countries = useMemo(
    () =>
      Array.from(
        new Set(
          sourceProjects
            .map((p) => p.country_region)
            .filter((v) => v && v !== "nan" && v !== "NaN")
        )
      ).sort(),
    [sourceProjects]
  );

  const themeAreas = useMemo(
    () =>
      Array.from(
        new Set(
          sourceProjects
            .map((p) => p.theme_area)
            .filter((v) => v && v !== "nan" && v !== "NaN")
        )
      ).sort(),
    [sourceProjects]
  );

  const institutions = useMemo(
    () =>
      Array.from(
        new Set(
          sourceProjects
            .map((p) => p.institution)
            .filter((v) => v && v !== "nan" && v !== "NaN")
        )
      ).sort(),
    [sourceProjects]
  );

  const sites = useMemo(
    () =>
      Array.from(
        new Set(
          sourceProjects
            .map((p) => p.site)
            .filter((v) => v && v !== "nan" && v !== "NaN")
        )
      ).sort(),
    [sourceProjects]
  );

  const loanTypes = useMemo(
    () =>
      Array.from(
        new Set(
          sourceProjects
            .map((p) => p.loan_type)
            .filter((v) => v && v !== "nan" && v !== "NaN")
        )
      ).sort(),
    [sourceProjects]
  );

  /**
   * 🔹 체크박스 스키마
   *    - key 값들은 Home.jsx의 applyFilters에서 쓰는 이름과 맞춤
   */
  const checkboxSchema = useMemo(
    () => [
      {
        key: "status",
        title: "By 진행 상태 (status)",
        items: statuses,
      },
      {
        key: "country_region",
        title: "By 국가 / 지역 (country_region)",
        items: countries,
      },
      {
        key: "theme_area",
        title: "By 주제 분야 (theme_area)",
        items: themeAreas,
      },
      {
        key: "site",
        title: "By 출처 사이트 (site)",
        items: sites,
      },
      {
        key: "institution",
        title: "By 수행 기관 (institution)",
        items: institutions,
      },
      {
        key: "loan_type",
        title: "By 자금 유형 (loan_type)",
        items: loanTypes,
      },
      {
        key: "budget_bucket",
        title: "By 총 사업비 구간 (budget)",
        items: [
          "Small ( ~ $10M )",
          "Medium ( $10M ~ $50M )",
          "Large ( $50M ~ )",
        ],
      },
      {
        key: "co_financing_bucket",
        title: "By 공동재원 구간 (co_financing)",
        items: [
          "None / Unknown",
          "Small ( ~ $10M )",
          "Medium ( $10M ~ $50M )",
          "Large ( $50M ~ )",
        ],
      },
      {
        key: "duration_bucket",
        title: "By 운영 기간 구간 (duration_days)",
        items: ["1년 미만", "1 ~ 3년", "3년 이상"],
      },
    ],
    [statuses, countries, themeAreas, sites, institutions, loanTypes]
  );

  // 체크박스 선택 상태
  const [checks, setChecks] = useState(() =>
    Object.fromEntries(checkboxSchema.map((s) => [s.key, {}]))
  );

  // 숫자/연도 범위 필터 상태
  const [ranges, setRanges] = useState({
    startYearFrom: "",
    startYearTo: "",
    budgetMin: "",
    budgetMax: "",
    coFinancingMin: "",
    coFinancingMax: "",
    durationMin: "",
    durationMax: "",
  });

  // 스키마가 바뀌었을 때(처음 마운트 포함) 체크박스 초기화
  // (sourceProjects 바뀌면 옵션 다시 세팅)
  useMemo(() => {
    setChecks(Object.fromEntries(checkboxSchema.map((s) => [s.key, {}])));
  }, [checkboxSchema]);

  const setCheckItem = (sectionKey, label, v) => {
    setChecks((prev) => ({
      ...prev,
      [sectionKey]: { ...prev[sectionKey], [label]: v },
    }));
  };

  const setRange = (key, value) => {
    setRanges((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearAll = () => {
    setChecks(Object.fromEntries(checkboxSchema.map((s) => [s.key, {}])));
    setRanges({
      startYearFrom: "",
      startYearTo: "",
      budgetMin: "",
      budgetMax: "",
      coFinancingMin: "",
      coFinancingMax: "",
      durationMin: "",
      durationMax: "",
    });
    onApply?.({});
  };

  const buildPayload = () => {
    const selectedChecks = {};
    for (const s of checkboxSchema) {
      const chosen = Object.entries(checks[s.key] || {})
        .filter(([, v]) => v)
        .map(([k]) => k);
      if (chosen.length) selectedChecks[s.key] = chosen;
    }

    const cleanRanges = {};
    for (const [k, v] of Object.entries(ranges)) {
      if (v !== "" && v !== null && v !== undefined) {
        cleanRanges[k] = v;
      }
    }

    return {
      ...selectedChecks,
      ...cleanRanges,
    };
  };

  return (
    <aside className="w-[270px] border-l border-[#D9D9D9] bg-white sticky top-20 h-[calc(100vh-80px)]">
      <div className="p-4">
        <h4 className="text-[24px] leading-[24px] mb-4">Filter</h4>
        <p className="text-[11px] text-[#667085] mb-3">
          climateDB4.csv 기반 실제 값으로 필터를 구성했습니다.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => onApply?.(buildPayload())}
            className="bg-[#5E5ADB] text-white rounded-[6px] h-10 px-3 text-sm shadow-[0px_1px_1px_rgba(0,0,0,0.1),0_0_0_1px_#5E5ADB]"
          >
            Apply
          </button>
          <button
            onClick={clearAll}
            className="bg-[#D1293D] text-white rounded-[6px] h-10 px-3 text-sm shadow-[0px_1px_1px_rgba(0,0,0,0.1),0_0_0_1px_#D1293D]"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="px-4 pb-4 space-y-4 h-[calc(100%-140px)] overflow-auto">
        {checkboxSchema.map((s) => (
          <FilterGroup
            key={s.key}
            title={s.title}
            items={s.items}
            values={checks[s.key] || {}}
            onChange={(label, v) => setCheckItem(s.key, label, v)}
          />
        ))}

        <div className="h-px bg-[#CFD3D4]" />
        <p className="text-[12px] text-[#667085]">
          범위 기반 필터 (start_date 연도, budget, co_financing, duration_days)
        </p>

        <RangeField
          label="시작 연도 (start_date 기준)"
          min={ranges.startYearFrom}
          max={ranges.startYearTo}
          onChangeMin={(v) => setRange("startYearFrom", v)}
          onChangeMax={(v) => setRange("startYearTo", v)}
          placeholderMin="From (예: 2015)"
          placeholderMax="To (예: 2025)"
          type="number"
        />

        <RangeField
          label="총 사업비 직접 입력 (budget, USD)"
          min={ranges.budgetMin}
          max={ranges.budgetMax}
          onChangeMin={(v) => setRange("budgetMin", v)}
          onChangeMax={(v) => setRange("budgetMax", v)}
          placeholderMin="Min (예: 1000000)"
          placeholderMax="Max (예: 50000000)"
          type="number"
        />

        <RangeField
          label="공동 재원 직접 입력 (co_financing, USD)"
          min={ranges.coFinancingMin}
          max={ranges.coFinancingMax}
          onChangeMin={(v) => setRange("coFinancingMin", v)}
          onChangeMax={(v) => setRange("coFinancingMax", v)}
          placeholderMin="Min (예: 0)"
          placeholderMax="Max (예: 30000000)"
          type="number"
        />

        <RangeField
          label="운영 기간 직접 입력 (duration_days)"
          min={ranges.durationMin}
          max={ranges.durationMax}
          onChangeMin={(v) => setRange("durationMin", v)}
          onChangeMax={(v) => setRange("durationMax", v)}
          placeholderMin="Min (일)"
          placeholderMax="Max (일)"
          type="number"
        />
      </div>
    </aside>
  );
}
