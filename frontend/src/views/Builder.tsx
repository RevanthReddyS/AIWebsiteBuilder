import { FileExplorer } from "@/components/FileExplorer";
import Steps, { IStep } from "@/components/Steps";
import { Textarea } from "@/components/ui/textarea";
import { BACKEND_API_URL } from "@/config";
import { parseXml } from "@/lib/parseSteps";
import Editor from "@monaco-editor/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const Builder = () => {
  const location = useLocation();
  const { userMessage } = (location.state as { userMessage: string }) ?? {
    userMessage: "",
  };
  const [steps, setSteps] = useState<IStep[]>([]);
  const [fileContent, setFileContent] = useState<string>("");
  async function getInitialFiles() {
    const templateResponse = await axios.post(`${BACKEND_API_URL}/template`, {
      prompt: userMessage.trim(),
    });
    const { prompts, uiPrompts } = templateResponse.data;
    setSteps(parseXml(uiPrompts[0]));
    // const chatResponse = await axios.post(`${BACKEND_API_URL}/chat`, {
    //   messages: [...prompts, userMessage].map((prompt) => ({
    //     role: "user",
    //     content: prompt,
    //   })),
    // });
  }
  useEffect(() => {
    getInitialFiles();
  }, []);

  useEffect(() => {
    if (!steps.find((step) => step.status === "pending")) {
      return;
    }
  }, [steps]);

  return (
    <div className="grid grid-cols-12">
      <div className="col-span-3 bg-gray-800">
        <Steps steps={steps ?? []} />
        <Textarea
          className="fixed bottom-4 mx-2 w-[21rem] bg-white text-black"
          placeholder="Type your message here."
        />
      </div>
      <div className="col-span-3 bg-gray-800 px-2">
        <FileExplorer
          onFileSelect={(content) => setFileContent(content)}
          files={[
            {
              name: "Documents",
              type: "folder",
              path: "/Documents",
              children: [
                {
                  name: "Work",
                  type: "folder",
                  path: "/Documents/Work",
                  children: [
                    {
                      name: "project-proposal.docx",
                      type: "file",
                      path: "/Documents/Work/project-proposal.docx",
                      content:
                        "# Project Proposal\n\nExecutive summary of the new project initiative...",
                    },
                    {
                      name: "quarterly-report.xlsx",
                      type: "file",
                      path: "/Documents/Work/quarterly-report.xlsx",
                      content:
                        "Quarterly financial data and analysis spreadsheet",
                    },
                  ],
                },
                {
                  name: "Personal",
                  type: "folder",
                  path: "/Documents/Personal",
                  children: [
                    {
                      name: "vacation-plans.txt",
                      type: "file",
                      path: "/Documents/Personal/vacation-plans.txt",
                      content:
                        "Summer vacation planning notes:\n- Destination: Greece\n- Dates: July 15-30",
                    },
                  ],
                },
              ],
            },
            {
              name: "Pictures",
              type: "folder",
              path: "/Pictures",
              children: [
                {
                  name: "Vacation2023",
                  type: "folder",
                  path: "/Pictures/Vacation2023",
                  children: [
                    {
                      name: "beach-sunset.jpg",
                      type: "file",
                      path: "/Pictures/Vacation2023/beach-sunset.jpg",
                      content: "Base64 encoded image content would go here",
                    },
                    {
                      name: "mountain-view.png",
                      type: "folder",
                      path: "/Pictures/Vacation2023/mountain-view.png",
                      content: "Base64 encoded image content would go here",
                    },
                  ],
                },
              ],
            },
            {
              name: "Downloads",
              type: "folder",
              path: "/Downloads",
              children: [
                {
                  name: "software-installer.exe",
                  type: "file",
                  path: "/Downloads/software-installer.exe",
                  content: "// Binary executable content",
                },
                {
                  name: "important-document.pdf",
                  type: "file",
                  path: "/Downloads/important-document.pdf",
                  content: "PDF document content",
                },
              ],
            },
          ]}
        />
      </div>
      <div className="col-span-6">
        <Editor
          height="100vh"
          theme="vs-dark"
          defaultLanguage="javascript"
          value={fileContent}
          options={{ codeLens: true }}
        />
      </div>
    </div>
  );
};

export default Builder;
