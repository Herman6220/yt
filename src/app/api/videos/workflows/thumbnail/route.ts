import { db } from "@/db";
import { videos } from "@/db/schema";
import { serve } from "@upstash/workflow/nextjs"
import { and, eq } from "drizzle-orm";
import { UTApi } from "uploadthing/server";
import { Runware } from "@runware/sdk-js";

interface InputType {
    userId: string;
    videoId: string;
    prompt: string;
};

export const { POST } = serve(
    async (context) => {
        const utapi = new UTApi();
        const input = context.requestPayload as InputType;
        const { videoId, userId, prompt } = input;

        const video = await context.run("get-video", async () => {
            const [existingVideo] = await db
                .select()
                .from(videos)
                .where(and(
                    eq(videos.id, videoId),
                    eq(videos.userId, userId)
                ));

            if (!existingVideo) {
                throw new Error("Not found");
            }

            return existingVideo;
        });


        const runware = new Runware({
            apiKey: process.env.RUNWARE_API_KEY!
        });

        const image = await context.run("generate-thumbnail", async () => {
            const response = await runware.requestImages({
                positivePrompt: prompt,
                model: "runware:101@1",
                width: 1024,
                height: 576,
            })

            if(!response){
                return null;
            }

            console.log("Generated Image", response[0].imageURL);
            const result = response[0].imageURL;
            return result;
        })

        if (!image) {
            throw new Error("Bad request");
        }

        await context.run("cleanup-thumbnail", async () => {
            if (video.thumbnailKey) {
                await utapi.deleteFiles(video.thumbnailKey);
                await db
                    .update(videos)
                    .set({ thumbnailKey: null, thumbnailUrl: null })
                    .where(and(
                        eq(videos.id, videoId),
                        eq(videos.userId, userId),
                    ))
            }
        })

        const uploadedThumbnail = await context.run("upload-thumbnail", async () => {
            const { data } = await utapi.uploadFilesFromUrl(image);

            if (!data) {
                throw new Error("Bad request");
            }

            return data;
        })

        await context.run("update-video", async () => {
            await db
                .update(videos)
                .set({
                    thumbnailKey: uploadedThumbnail.key,
                    thumbnailUrl: uploadedThumbnail.ufsUrl,
                })
                .where(and(
                    eq(videos.id, videoId),
                    eq(videos.userId, userId),
                ))
        })

    }
)