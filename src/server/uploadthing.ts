/** server/uploadthing.ts */
import { NextApiRequest, NextApiResponse } from "next";
import { createFilething, type FileRouter } from "uploadthing/server";
const f = createFilething();
 
const auth = (req: NextApiRequest, res: NextApiResponse) => ({ id: "fakeId" }); // Fake auth function
 
// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  fileUploader: f
    // Set permissions and file types for this FileRoute
    .fileTypes(["blob", "image", "video"])
    .maxSize("1GB")
   
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata);
 
      console.log("file url", file.url);
    })
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;