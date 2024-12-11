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
  return (
    <div className="grid grid-cols-12">
      <div className="col-span-4 bg-gray-800">
        <Steps steps={steps ?? []} />
        <Textarea placeholder="Type your message here." />
      </div>
      <div className="col-span-8">
        <Editor
          height="100vh"
          theme="vs-dark"
          defaultLanguage="javascript"
          defaultValue="// some comment"
        />
      </div>
    </div>
  );
};

export default Builder;
