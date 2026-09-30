import React, { useState, useEffect } from "react";
import { X, Copy, Check, Download, Terminal, FileCode } from "lucide-react";

interface PythonCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PythonCodeModal: React.FC<PythonCodeModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<"app" | "req">("app");
  const [appPyCode, setAppPyCode] = useState<string>("");
  const [reqTxtCode, setReqTxtCode] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      fetch("/api/python-source")
        .then((res) => res.json())
        .then((data) => {
          if (data.appPy) setAppPyCode(data.appPy);
          if (data.requirementsTxt) setReqTxtCode(data.requirementsTxt);
        })
        .catch((err) => console.error("Could not fetch python source", err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentContent = activeTab === "app" ? appPyCode : reqTxtCode;
  const currentFileName = activeTab === "app" ? "app.py" : "requirements.txt";

  const handleCopy = () => {
    navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([currentContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = currentFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      id="python-code-modal-backdrop"
      className="fixed inset-0 z-50 bg-[#1b2520]/80 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
    >
      <div
        id="python-code-modal-content"
        className="bg-[#26362E] border border-[#F2EFE4]/25 text-[#F2EFE4] rounded-none w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden font-body"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#F2EFE4]/20 flex items-center justify-between bg-[#212f28]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 border border-[#F2EFE4]/30 text-[#E3A008]">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-chalk text-2xl text-[#F2EFE4] leading-tight">
                Python Streamlit source code
              </h3>
              <p className="text-xs text-[#F2EFE4]/70">
                Single-file prototype (`app.py`) and `requirements.txt`
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="copy-code-btn"
              onClick={handleCopy}
              className="px-3 py-1.5 bg-[#E3A008] text-[#2A2420] font-semibold text-xs flex items-center gap-1.5 hover:bg-[#d49407] transition cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Copied
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy {currentFileName}
                </>
              )}
            </button>
            <button
              id="download-code-btn"
              onClick={handleDownload}
              className="px-3 py-1.5 border border-[#F2EFE4]/30 text-[#F2EFE4] hover:bg-[#1e2b24] font-medium text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Download
            </button>
            <button
              id="close-modal-btn"
              onClick={onClose}
              className="p-1.5 text-[#F2EFE4]/70 hover:text-[#F2EFE4] transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="px-4 py-2 bg-[#1f2c25] border-b border-[#F2EFE4]/15 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("app")}
              className={`px-3 py-1 font-receipt transition border-b-2 ${
                activeTab === "app"
                  ? "border-[#E3A008] text-[#E3A008] font-semibold"
                  : "border-transparent text-[#F2EFE4]/70 hover:text-[#F2EFE4]"
              }`}
            >
              app.py (Single-file app)
            </button>
            <button
              onClick={() => setActiveTab("req")}
              className={`px-3 py-1 font-receipt transition border-b-2 ${
                activeTab === "req"
                  ? "border-[#E3A008] text-[#E3A008] font-semibold"
                  : "border-transparent text-[#F2EFE4]/70 hover:text-[#F2EFE4]"
              }`}
            >
              requirements.txt
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-[#F2EFE4]/60 font-receipt">
            <Terminal className="w-3.5 h-3.5 text-[#E3A008]" />
            <span>streamlit run app.py</span>
          </div>
        </div>

        {/* Terminal Run Instructions */}
        <div className="p-3 bg-[#1a251f] border-b border-[#F2EFE4]/15 text-xs font-receipt text-[#F2EFE4]/80 flex items-center gap-2 overflow-x-auto">
          <span className="text-[#E3A008] font-bold">Terminal:</span>
          <code className="bg-[#26362E] px-2 py-0.5 border border-[#F2EFE4]/20 text-[#F2EFE4]">
            pip install -r requirements.txt
          </code>
          <span>&&</span>
          <code className="bg-[#26362E] px-2 py-0.5 border border-[#F2EFE4]/20 text-[#F2EFE4]">
            streamlit run app.py
          </code>
        </div>

        {/* Code View Area */}
        <div className="flex-1 overflow-auto p-4 bg-[#1e2a23] font-receipt text-xs text-[#F2EFE4] leading-relaxed">
          <pre className="whitespace-pre overflow-x-auto">
            {currentContent || "Loading source code..."}
          </pre>
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-[#F2EFE4]/20 bg-[#212f28] flex items-center justify-between text-xs text-[#F2EFE4]/70">
          <span>Campus canteen reference file</span>
          <button
            onClick={onClose}
            className="px-3 py-1 border border-[#F2EFE4]/30 hover:bg-[#1a251f] text-[#F2EFE4]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

