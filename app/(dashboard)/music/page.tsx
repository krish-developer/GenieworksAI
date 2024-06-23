"use client";

import React, { useEffect, useState } from "react";
import { Music } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import axios from "axios";

import { MediaResponse } from "@/type";
import useProModal from "@/hooks/useProModal";
import PromptForm from "@/components/forms/PromptForm";
import Header from "@/components/shared/Header";
import NoContent from "@/components/shared/NoContent";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Loader } from "@/components/ui/loader";
import { useToast } from "@/components/ui/use-toast";

const MusicGenerationPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const { onOpen } = useProModal();
  const { toast } = useToast();

  const [musicResponses, setMusicResponses] = useState<MediaResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchUserMusicResponses();
  }, []);

  const fetchUserMusicResponses = async () => {
    try {
      const response = await axios.get("/api/music");

      setMusicResponses(response.data);
      setIsLoading(false);
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleSubmit = async (prompt: string): Promise<void> => {
    const currentMusicResponses = musicResponses;

    setMusicResponses([...currentMusicResponses, { prompt, media: "" }]);

    try {
      const conversationResponse = await axios.post("/api/music/generate", {
        prompt,
      });

      setMusicResponses([...currentMusicResponses, conversationResponse.data]);
    } catch (error: any) {
      setMusicResponses(currentMusicResponses);
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
        title="Music Generation"
        description="Turn your thoughts into melodies."
        icon={Music}
      />

      <PromptForm placeholder="Type your prompt..." onSubmit={handleSubmit} />
      <div className="mt-2 text-sm text-muted-foreground italic">
        Note: The source URL of the generated music will only be valid for 24
        hours.
      </div>

      <div className="mt-8 space-y-2">
        <div className="space-y-4 mt-4">
          {isLoading && <Loader className="m-auto" size={48} />}
          {musicResponses.length === 0 && !isLoading && (
            <NoContent label="No music generated." />
          )}
          <div className="flex flex-col-reverse gap-y-8">
            {musicResponses.map((response) => (
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
                <div className="flex items-start bg-white gap-x-8 p-4">
                  <Avatar className="h-10 w-10 rounded-lg">
                    <AvatarImage src="/logo.png" className="rounded-xl" />
                  </Avatar>
                  {response.media ? (
                    <audio
                      controls
                      className="w-full"
                      src={response.media}
                    ></audio>
                  ) : (
                    <p>Genie is composing...</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicGenerationPage;
