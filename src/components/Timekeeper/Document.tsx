import { Stack, Typography } from "@mui/material";
import { Upload } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function Documents({ documents }: { documents: Upload[] }) {
  const router = useRouter();
  const { data: session } = useSession();
  return (
    <Stack spacing={2} alignItems="flex-start" mt={2}>
      {documents.map((document) => (
        <Stack
          key={document.id}
          width="100%"
          sx={{ border: "2px solid #E3E8EF", borderRadius: "10px" }}
          alignItems="flex-start"
          spacing={1}
          p={2}
        >
          <Stack spacing={0.5}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, fontSize: "1.1rem" }}
            >
              {document.userName}
            </Typography>
            <Typography variant="subtitle2">{document.role}</Typography>
          </Stack>

          <Typography
            sx={{ cursor: "pointer" }}
            component="a"
            href={`/api/upload?fileName=${document.document}`}
            target="_blank"
            // onClick={() =>
            //   router.push(
            //     `/api/uploads?fileName=${document.document}`
            //   )
            // }
          >
            Click to View to the Document
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}
