"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { MessageSquare } from "lucide-react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";

import { TextResponse } from "@/type";
import useProModal from "@/hooks/useProModal";
import PromptForm from "@/components/forms/PromptForm";
import Header from "@/components/shared/Header";
import NoContent from "@/components/shared/NoContent";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Loader } from "@/components/ui/loader";
import { useToast } from "@/components/ui/use-toast";

const ConversationPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const { onOpen } = useProModal();
  const { toast } = useToast();

  const [messages, setMessages] = useState<TextResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchUserCoversation();
  }, []);

  const fetchUserCoversation = async () => {
    try {
      const response = await axios.get("/api/conversation");

      setMessages(response.data);
      setIsLoading(false);
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleSubmit = async (prompt: string): Promise<void> => {
    const currentMessages = messages;

    setMessages([...currentMessages, { prompt, response: "" }]);

    try {
      const conversationResponse = await axios.post(
        "/api/conversation/generate",
        { prompt }
      );

      setMessages([...currentMessages, conversationResponse.data]);
    } catch (error: any) {
      setMessages(currentMessages);
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
        title="Conversation"
        description="Our most advanced conversation model ever."
        icon={MessageSquare}
      />

      <PromptForm placeholder="Type your prompt..." onSubmit={handleSubmit} />

      <div className="mt-8 space-y-2">
        <div className="space-y-4 mt-4">
          {isLoading && <Loader className="m-auto" size={48} />}
          {messages.length === 0 && !isLoading && (
            <NoContent label="No conversation started." />
          )}
          <div className="flex flex-col-reverse gap-y-8">
            {messages.map((message) => (
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
                  <p className="">
                    {message.response || "Genie is thinking..."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationPage;
