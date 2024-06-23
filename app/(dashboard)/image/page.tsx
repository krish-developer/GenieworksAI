"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Download, ImageIcon } from "lucide-react";
import { useUser } from "@clerk/nextjs";

import { ImageResponse } from "@/type";
import useProModal from "@/hooks/useProModal";
import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
import PromptForm from "@/components/forms/PromptForm";
import Header from "@/components/shared/Header";
import NoContent from "@/components/shared/NoContent";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Loader } from "@/components/ui/loader";
import { useToast } from "@/components/ui/use-toast";

const ImageGenerationPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const { onOpen } = useProModal();
  const { toast } = useToast();

  const [imagesResponse, setImagesResponse] = useState<ImageResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchImageResponses();
  }, []);

  const fetchImageResponses = async () => {
    try {
      const response = await axios.get("/api/image");

      setImagesResponse(response.data);
      setIsLoading(false);
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleSubmit = async (
    prompt: string,
    amount?: string,
    resolution?: string
  ): Promise<void> => {
    const currentImageResponses = imagesResponse;

    setImagesResponse([...currentImageResponses, { prompt, images: [] }]);

    try {
      const imagesResponseData = await axios.post("/api/image/generate", {
        prompt,
        amount: parseInt(amount ?? "1"),
        resolution,
      });

      setImagesResponse([...currentImageResponses, imagesResponseData.data]);
    } catch (error: any) {
      setImagesResponse(currentImageResponses);
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
        title="Image Generation"
        description="Turn your thoughts into digital artwork."
        icon={ImageIcon}
      />

      <PromptForm
        placeholder="Type your prompt..."
        from="Image"
        onSubmit={handleSubmit}
      />

      <div className="mt-8 space-y-2">
        <div className="space-y-4 mt-4">
          {isLoading && <Loader className="m-auto" size={48} />}
          {imagesResponse.length === 0 && !isLoading && (
            <NoContent label="No images generated." />
          )}
          <div className="flex flex-col-reverse gap-y-8">
            {imagesResponse.map((response) => (
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
                  <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                    {response.images && response.images.length ? (
                      response.images?.map((image, index) => (
                        <Card
                          key={image}
                          className="rounded-lg overflow-hidden"
                        >
                          <div className="relative aspect-square">
                            <Image
                              src={image}
                              alt={`Image ${index + 1}`}
                              fill
                            />
                          </div>
                          <CardFooter className="p-2">
                            <Button
                              onClick={() => window.open(image)}
                              variant={"secondary"}
                              className="w-full"
                            >
                              <Download className="mr-2" /> Download
                            </Button>
                          </CardFooter>
                        </Card>
                      ))
                    ) : (
                      <p>Genie is thinking...</p>
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

export default ImageGenerationPage;
