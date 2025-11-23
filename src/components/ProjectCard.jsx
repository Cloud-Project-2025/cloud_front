// src/components/ProjectCard.jsx
import React from 'react';

// 상태(status) 값에 따라 색상을 반환하는 함수
const getStatusColor = (status) => {
  switch (status) {
    case '진행 중':
      return 'text-yellow-600 font-semibold';
    case '완료':
      return 'text-green-600 font-semibold';
    case '예정':
      return 'text-gray-500 font-semibold';
    default:
      return 'text-gray-500';
  }
};

export default function ProjectCard({ project, onClick }) {
  const { id, title, description, country_region, institution, status } = project;
  
  return (
    // 직사각형 테두리 카드 스타일 적용
    <div
      className="p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition duration-200 shadow-sm"
      onClick={onClick}
      role="button"
    >
      {/* 카드 내용을 좌측(정보)과 우측(상태) 2열로 나누는 Grid 레이아웃 */}
      <div className="grid grid-cols-[1fr_auto] gap-4">
        
        {/* 좌측: 프로젝트 상세 정보 */}
        <div>
          {/* 제목 (title) */}
          <h3 className="text-lg font-bold text-blue-700 leading-tight mb-1">
            {title}
          </h3>
          
          {/* 설명 (desc) */}
          {description && (
            <p className="text-sm text-gray-700 mb-3 line-clamp-2">
              {description}
            </p>
          )}
          
          {/* 하단 상세 메타데이터 (ID, 지역, 기관) - 작은 회색 텍스트 */}
          <div className="text-xs text-gray-500 flex flex-wrap gap-x-3">
            <span className="truncate">ID: {id}</span>
            <span className="truncate">지역: {country_region}</span>
            <span className="truncate">기관: {institution}</span>
          </div>
        </div>
        
        {/* 우측: 상태 (Status) */}
        <div className="flex flex-col items-end pt-1">
          <span className="text-xs text-gray-500">status:</span>
          <span className={`text-sm ${getStatusColor(status)} whitespace-nowrap`}>
            {status}
          </span>
        </div>
      </div>
    </div>
  );
}