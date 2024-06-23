"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Code } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";

import { TextResponse } from "@/type";
import useProModal from "@/hooks/useProModal";
import PromptForm from "@/components/forms/PromptForm";
import Header from "@/components/shared/Header";
import NoContent from "@/components/shared/NoContent";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Loader } from "@/components/ui/loader";
import { useToast } from "@/components/ui/use-toast";

const CodeGenerationPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const { onOpen } = useProModal();
  const { toast } = useToast();

  const [codeMessages, setCodeMessages] = useState<TextResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchUserCodeMessages();
  }, []);

  const fetchUserCodeMessages = async () => {
    try {
      const response = await axios.get("/api/code");

      setCodeMessages(response.data);
      setIsLoading(false);
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleSubmit = async (prompt: string): Promise<void> => {
    const currentCodeMessages = codeMessages;

    setCodeMessages([...currentCodeMessages, { prompt, response: "" }]);

    try {
      const codeResponse = await axios.post("/api/code/generate", { prompt });

      setCodeMessages([...currentCodeMessages, codeResponse.data]);
    } catch (error: any) {
      setCodeMessages(currentCodeMessages);
      console.log(error);
      toast({
        description: error?.response.data,
        className: "bg-gray-900 text-white border-gray-950",
      });
      error?.response?.status === 403 && onOpen();
    } finally {
      router.refresh();
    }
  };

  return (
    <div className="px-4 lg:px-8 ">
      <Header
        title="Code Generation"
        description="Generate code using descriptive prompts."
        icon={Code}
      />

      <PromptForm placeholder="Type your prompt..." onSubmit={handleSubmit} />

      <div className="mt-8 space-y-2">
        <div className="space-y-4 mt-4">
          {isLoading && <Loader className="m-auto" size={48} />}
          {codeMessages.length === 0 && !isLoading && (
            <NoContent label="No code snippets generated." />
          )}
          <div className="flex flex-col-reverse gap-y-8">
            {codeMessages.map((message) => (
              <div
                key={message.prompt}
                className="flex flex-col w-full rounded-lg border"
              >
                <div className="flex items-start bg-muted gap-x-8 p-4">
                  <Avatar className="h-10 w-10 rounded-lg">
                    <AvatarImage src={user?.imageUrl} className="rounded-xl" />
                  </Avatar>
                  <p className="font-semibold">{message.prompt}</p>
                </div>
                <div className="flex items-start bg-white gap-x-8 p-4">
                  <Avatar className="h-10 w-10 rounded-lg">
                    <AvatarImage src="/logo.png" className="rounded-xl" />
                  </Avatar>
                  <ReactMarkdown
                    components={{
                      pre: ({ node, ...props }) => (
                        <div className="overflow-auto w-full my-2 bg-black/10 p-2 rounded-lg">
                          <pre {...props} />
                        </div>
                      ),
                      code: ({ node, ...props }) => (
                        <code
                          className="bg-black/10 rounded-lg p-1"
                          {...props}
                        />
                      ),
                    }}
                    className="overflow-hidden leading-7"
                  >
                    {message.response || "Genie is thinking..."}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeGenerationPage;
