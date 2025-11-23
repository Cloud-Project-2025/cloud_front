// src/pages/ProjectDetailPage.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // 프로젝트 ID를 URL에서 가져오기
import { getProject } from "../services/projectService"; // 프로젝트 서비스에서 API 함수 가져오기

export default function ProjectDetailPage() {
  const { id } = useParams(); // URL에서 프로젝트 ID 받아오기
  const [project, setProject] = useState(null); // 프로젝트 데이터를 저장할 상태

  useEffect(() => {
    // 프로젝트 상세 정보를 가져오는 함수
    const fetchProject = async () => {
      try {
        const data = await getProject(id); // getProject로 데이터 받기
        setProject(data); // 데이터를 state에 저장
      } catch (error) {
        console.error("Error fetching project details:", error);
      }
    };

    fetchProject(); // 페이지 로드 시 호출
  }, [id]); // id가 변경되면 다시 호출

  if (!project) {
    return <div>Loading...</div>; // 프로젝트 정보가 아직 오지 않았다면 로딩 화면
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-semibold mb-6">{project.name}</h1>

      {/* Description */}
      <div className="mb-8">
        <h2 className="text-xl font-medium text-[#5E5ADB]">Description</h2>
        <p className="mt-2 text-base">{project.description}</p>
      </div>

      {/* Project Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 border border-gray-300 rounded-lg">
          <h3 className="text-lg font-medium">Project Data</h3>
          <ul className="mt-4 space-y-2">
            <li>
              <strong>Project ID:</strong> {project.projectId}
            </li>
            <li>
              <strong>Country / Region:</strong> {project.countryRegion}
            </li>
            <li>
              <strong>Funding Amount:</strong> ${project.fundingAmount}
            </li>
            <li>
              <strong>Start Date:</strong> {new Date(project.startDate).toLocaleDateString()}
            </li>
            <li>
              <strong>End Date:</strong> {new Date(project.endDate).toLocaleDateString()}
            </li>
            <li>
              <strong>Funding Type:</strong> {project.fundingType}
            </li>
            {/* 추가적인 데이터 항목들 */}
            <li>
              <strong>Carbon reduction:</strong> {project.carbonReduction || "N/A"}
            </li>
            <li>
              <strong>Beneficiaries:</strong> {project.beneficiaries || "N/A"}
            </li>
            <li>
              <strong>Remarks:</strong> {project.remarks || "N/A"}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
