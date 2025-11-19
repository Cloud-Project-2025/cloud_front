// src/pages/ProjectForm.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createProject, updateProject, getProject } from "../services/projectService";

export default function ProjectForm({ mode }) {
  const isEdit = mode === "edit";
  const { id } = useParams();
  const nav = useNavigate();

  const [form, setForm] = useState({
    name: "",
    status: "",
    description: "",
    country: "",
    funding_type: "",
    theme: "",
    organization: "",
    risk_factor: "",
    finance_type: "",
    total_amount: "",
    grant: "",
    cofinancing: "",
    period_type: "Custom",
    start_date: "",
    end_date: "",
  });

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // 수정 모드일 때 기존 프로젝트 데이터 불러오기
  useEffect(() => {
    if (!isEdit || !id) return;

    (async () => {
      try {
        setLoading(true);
        const data = await getProject(id);

        setForm({
          name: data.name || "",
          status: data.status || "",
          description: data.description || "",
          country: data.country || "",
          funding_type: data.funding_type || "",
          theme: data.theme || "",
          organization: data.organization || "",
          risk_factor: data.risk_factor || "",
          finance_type: data.finance_type || "",
          total_amount: data.total_amount?.toString() || "",
          grant: data.grant?.toString() || "",
          cofinancing: data.cofinancing?.toString() || "",
          period_type: data.period_type || "Custom",
          start_date: data.start_date || "",
          end_date: data.end_date || "",
        });
      } catch (e) {
        console.error(e);
        setError("프로젝트 정보를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    })();
  }, [isEdit, id]);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function buildPayload() {
    return {
      name: form.name,
      status: form.status,
      description: form.description,
      country: form.country,
      funding_type: form.funding_type,
      theme: form.theme,
      organization: form.organization,
      risk_factor: form.risk_factor,
      finance_type: form.finance_type,
      total_amount: form.total_amount ? Number(form.total_amount) : null,
      grant: form.grant ? Number(form.grant) : null,
      cofinancing: form.cofinancing ? Number(form.cofinancing) : null,
      period_type: form.period_type,
      start_date: form.start_date || null,
      end_date: form.end_date || null,
    };
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const payload = buildPayload();

      if (isEdit) {
        await updateProject(id, payload);
      } else {
        await createProject(payload);
      }

      nav("/"); // 저장 후 리스트로 이동
    } catch (e) {
      console.error(e);
      setError("저장 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-[calc(100vh-80px)] bg-[#f5f5f7] flex items-center justify-center">
        <p className="text-xs text-gray-500">로딩 중…</p>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-80px)] bg-[#f5f5f7]">
      <div className="max-w-6xl mx-auto pt-6 pb-12">
        {/* 상단 타이틀 + 오른쪽 Add/Edit 버튼 영역 */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-sm font-medium text-gray-500">
            {isEdit ? "프로젝트 수정" : "프로젝트 추가"}
          </h1>

          {/* 상태 셀렉트 + Add/Edit 버튼 묶음 (피그마 오른쪽 영역 느낌) */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-gray-500">상태</span>
              <select
                name="status"
                value={form.status}
                onChange={onChange}
                className="h-8 min-w-[120px] rounded-sm border border-[#E5E7EB] bg-white px-2 text-[11px] text-gray-700 outline-none focus:border-[#625BF7] focus:ring-1 focus:ring-[#625BF7]"
              >
                <option value="">Select...</option>
                <option value="planning">Planning</option>
                <option value="ongoing">On-going</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <button
              type="submit"
              onClick={onSubmit}
              disabled={saving}
              className="h-8 px-4 rounded-sm bg-[#625BF7] text-[11px] font-medium text-white disabled:opacity-60"
            >
              {isEdit ? "+ Edit" : "+ Add"}
            </button>
          </div>
        </div>

        {/* 폼 전체 박스 */}
        <form
          onSubmit={onSubmit}
          className="bg-white rounded-xl border border-[#E5E7EB] px-6 py-6 space-y-5"
        >
          {/* 프로젝트 이름 */}
          <div>
            <label className="block text-[11px] text-gray-500 mb-1">
              프로젝트 이름
            </label>
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              required
              className="w-full h-8 rounded-sm border border-[#E5E7EB] px-2 text-[11px] outline-none focus:border-[#625BF7] focus:ring-1 focus:ring-[#625BF7]"
            />
          </div>

          {/* 프로젝트 설명 */}
          <div>
            <label className="block text-[11px] text-gray-500 mb-1">
              프로젝트 설명
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={onChange}
              placeholder="Placeholder"
              className="w-full min-h-[260px] rounded-sm border border-[#E5E7EB] px-2 py-2 text-[11px] outline-none resize-none focus:border-[#625BF7] focus:ring-1 focus:ring-[#625BF7]"
            />
          </div>

          {/* 셀렉트/인풋 1행: 국가 / 펀딩 형태 / 주제 영역 / 기관명 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <FieldSelect
              label="국가 / 지역"
              name="country"
              value={form.country}
              onChange={onChange}
            />
            <FieldSelect
              label="펀딩 형태"
              name="funding_type"
              value={form.funding_type}
              onChange={onChange}
            />
            <FieldSelect
              label="주제 영역"
              name="theme"
              value={form.theme}
              onChange={onChange}
            />
            <FieldSelect
              label="기관명"
              name="organization"
              value={form.organization}
              onChange={onChange}
            />
          </div>

          {/* 셀렉트/인풋 2행: 주요 위험요소 / 자금 형태 / 총 사업비 / 보조금 / 공통재원 금액 */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <FieldSelect
              label="주요 위험요소"
              name="risk_factor"
              value={form.risk_factor}
              onChange={onChange}
            />
            <FieldSelect
              label="자금 형태"
              name="finance_type"
              value={form.finance_type}
              onChange={onChange}
            />

            <FieldMoney
              label="총 사업비"
              name="total_amount"
              value={form.total_amount}
              onChange={onChange}
            />
            <FieldMoney
              label="보조금"
              name="grant"
              value={form.grant}
              onChange={onChange}
            />
            <FieldMoney
              label="공동재원 금액"
              name="cofinancing"
              value={form.cofinancing}
              onChange={onChange}
            />
          </div>

          {/* 프로젝트 기간 */}
          <div className="grid grid-cols-1 md:grid-cols-[120px,1fr] gap-4 items-end">
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">
                프로젝트 기간
              </label>
              <select
                name="period_type"
                value={form.period_type}
                onChange={onChange}
                className="w-full h-8 rounded-sm border border-[#E5E7EB] px-2 text-[11px] outline-none focus:border-[#625BF7] focus:ring-1 focus:ring-[#625BF7]"
              >
                <option value="Custom">Custom</option>
                <option value="Short-term">Short-term</option>
                <option value="Long-term">Long-term</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <DateField
                label="시작일"
                name="start_date"
                value={form.start_date}
                onChange={onChange}
              />
              <DateField
                label="종료일"
                name="end_date"
                value={form.end_date}
                onChange={onChange}
              />
            </div>
          </div>

          {error && (
            <p className="text-[11px] text-red-500 pt-1">{error}</p>
          )}
        </form>
      </div>
    </main>
  );
}

// 공통 서브 컴포넌트들 (셀렉트/금액/날짜 필드)

function FieldSelect({ label, name, value, onChange }) {
  return (
    <div>
      <label className="block text-[11px] text-gray-500 mb-1">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full h-8 rounded-sm border border-[#E5E7EB] bg-white px-2 text-[11px] text-gray-700 outline-none focus:border-[#625BF7] focus:ring-1 focus:ring-[#625BF7]"
      >
        <option value="">Select...</option>
        {/* 필요하면 실제 옵션들 추가 */}
      </select>
    </div>
  );
}

function FieldMoney({ label, name, value, onChange }) {
  return (
    <div>
      <label className="block text-[11px] text-gray-500 mb-1">{label}</label>
      <div className="flex items-center h-8 rounded-sm border border-[#E5E7EB] bg-white px-2">
        <span className="mr-1 text-[11px] text-gray-400">$</span>
        <input
          name={name}
          value={value}
          onChange={onChange}
          className="w-full text-[11px] outline-none"
          placeholder="0.00"
        />
      </div>
    </div>
  );
}

function DateField({ label, name, value, onChange }) {
  return (
    <div>
      <label className="block text-[11px] text-gray-500 mb-1">{label}</label>
      <div className="flex items-center h-8 rounded-sm border border-[#E5E7EB] bg-white px-2">
        <input
          type="date"
          name={name}
          value={value}
          onChange={onChange}
          className="w-full text-[11px] outline-none"
        />
      </div>
    </div>
  );
}
