"use client";

import React, { useEffect, useState } from "react";
import { Video } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";

import { MediaResponse } from "@/type";
import useProModal from "@/hooks/useProModal";
import PromptForm from "@/components/forms/PromptForm";
import Header from "@/components/shared/Header";
import NoContent from "@/components/shared/NoContent";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Loader } from "@/components/ui/loader";
import { useToast } from "@/components/ui/use-toast";

const VideoGenerationPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const { onOpen } = useProModal();
  const { toast } = useToast();

  const [videoResponses, setVideoResponses] = useState<MediaResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchUserVideoResponses();
  }, []);

  const fetchUserVideoResponses = async () => {
    try {
      const response = await axios.get("/api/video");

      setVideoResponses(response.data);
      setIsLoading(false);
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleSubmit = async (prompt: string): Promise<void> => {
    const currentVideoResponses = videoResponses;

    setVideoResponses([...currentVideoResponses, { prompt, media: "" }]);

    try {
      const conversationResponse = await axios.post("/api/video/generate", {
        prompt,
      });

      setVideoResponses([...currentVideoResponses, conversationResponse.data]);
    } catch (error: any) {
      setVideoResponses(currentVideoResponses);
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
        title="Video Generation"
        description="Turn your written prompts into videos."
        icon={Video}
      />

      <PromptForm placeholder="Type your prompt..." onSubmit={handleSubmit} />
      <div className="mt-2 text-sm text-muted-foreground italic">
        Note: The source URL of the generated video will only be valid for 24
        hours.
      </div>

      <div className="mt-8 space-y-2">
        <div className="space-y-4 mt-4">
          {isLoading && <Loader className="m-auto" size={48} />}
          {videoResponses.length === 0 && !isLoading && (
            <NoContent label="No videos generated." />
          )}
          <div className="flex flex-col-reverse gap-y-8">
            {videoResponses.map((response) => (
              <div
                key={response.prompt}
                className="flex flex-col w-full rounded-lg border"
              >
                <div className="flex items-start bg-muted gap-x-8 p-4">
                  <Avatar className="h-10 w-10 rounded-lg">
                    <AvatarImage src={user?.imageUrl} className="rounded-xl" />
                  </Avatar>
                  <p className="font-semibold">{response.prompt}</p>
                </div>
                <div className="flex items-start bg-white gap-x-8 p-4 relative">
                  <Avatar className="h-10 w-10 rounded-lg">
                    <AvatarImage src="/logo.png" className="rounded-xl" />
                  </Avatar>
                  <div className="w-full">
                    {response.media ? (
                      <video
                        controls
                        className="xl:w-[80%] aspect-video rounded-lg border bg-black"
                        src={response.media}
                      ></video>
                    ) : (
                      <p>Genie is visualising...</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoGenerationPage;
