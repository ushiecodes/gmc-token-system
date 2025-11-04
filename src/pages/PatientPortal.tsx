import React, { useState, useEffect } from "react";
import { DEPARTMENTS, TOKEN_GENERATION_START_HOUR } from "../constants";
import { type Token, TokenCategory } from "../types";
import { firebaseService } from "../services/firebaseService";
import Spinner from "../components/Spinner";

const PatientPortal: React.FC = () => {
  const [casePaperId, setCasePaperId] = useState("");
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [category, setCategory] = useState(TokenCategory.General);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedToken, setGeneratedToken] = useState<Token | null>(null);
  const [isGenerationTime, setIsGenerationTime] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      setCurrentTime(now);
      setIsGenerationTime(now.getHours() >= TOKEN_GENERATION_START_HOUR);
    };
    checkTime();
    const timer = setInterval(checkTime, 1000 * 60);
    const storedToken = sessionStorage.getItem("patientToken");
    if (storedToken) setGeneratedToken(JSON.parse(storedToken));
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const token = await firebaseService.generateToken(
        casePaperId.trim(),
        department,
        category
      );
      setGeneratedToken(token);
      sessionStorage.setItem("patientToken", JSON.stringify(token));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formattedTime = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (generatedToken) {
    return (
      <div className="max-w-lg mx-auto mt-4 sm:mt-10">
        <div className="p-6 sm:p-8 bg-white rounded-xl shadow-lg text-center">
          <h1 className="text-3xl font-bold text-gmc-dark mb-2">
            Your OPD Token
          </h1>
          <p className="text-gray-700 mb-4">
            Please show this token at the OPD counter.
          </p>
          <div className="bg-gmc-light border-2 border-gmc-dark rounded-lg py-6 px-4 mb-4">
            <div className="text-5xl font-extrabold text-gmc-dark mb-2">
              {generatedToken.tokenNumber}
            </div>
            <div className="text-lg text-gray-700">
              Dept:{" "}
              <span className="font-semibold">{generatedToken.department}</span>
            </div>
            <div className="text-md text-gray-600">
              Category: {generatedToken.category}
            </div>
            <div className="text-sm text-gray-500 mt-2">
              Generated at:{" "}
              {new Date(generatedToken.generatedAt).toLocaleTimeString()}
            </div>
          </div>
          <button
            className="mt-4 px-4 py-2 bg-gmc text-white rounded-md"
            onClick={() => {
              setGeneratedToken(null);
              sessionStorage.removeItem("patientToken");
              setCasePaperId("");
            }}
          >
            Generate Another Token
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto mt-4 sm:mt-10">
      <div className="p-6 sm:p-8 bg-white rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gmc-dark mb-2">
          Generate Your OPD Token
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Avoid the queue. Get your token online from{" "}
          {TOKEN_GENERATION_START_HOUR}:00 AM onwards.
        </p>
        <div
          className={`text-center p-3 rounded-md mb-6 ${
            isGenerationTime
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          <p>
            Current Time: <strong>{formattedTime}</strong>.{" "}
            {isGenerationTime
              ? "Token generation is open."
              : `Please wait until ${TOKEN_GENERATION_START_HOUR}:00 AM.`}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="case-paper-id"
              className="block text-sm font-medium text-gray-700"
            >
              Case Paper ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="case-paper-id"
              value={casePaperId}
              onChange={(e) => setCasePaperId(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gmc focus:border-gmc sm:text-sm"
              placeholder="Enter your Case Paper ID"
              required
            />
          </div>
          <div>
            <label
              htmlFor="department"
              className="block text-sm font-medium text-gray-700"
            >
              Select Department
            </label>
            <select
              id="department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-gmc focus:border-gmc sm:text-sm rounded-md"
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
              Patient Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as TokenCategory)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-gmc focus:border-gmc sm:text-sm rounded-md"
            >
              {Object.values(TokenCategory).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <div>
            <button
              type="submit"
              disabled={isLoading || !isGenerationTime}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gmc hover:bg-gmc-dark disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? <Spinner size="sm" /> : "Get Token"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default PatientPortal;
