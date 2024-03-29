import { Stack, Typography, Divider } from "@mui/material";
import { Comment } from "@prisma/client";
import dayjs from "dayjs";

const Comments = ({ comments }: { comments: Comment[] }) => {
  return (
    <Stack spacing={2} alignItems="flex-start" mt={2}>
      {comments.map((comment) => (
        <Stack
          key={comment.id}
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
              {comment.userName}
            </Typography>
            <Typography variant="subtitle2">
              {dayjs(comment.createdAt).format("DD/MM/YYYY HH:mm")}
            </Typography>
            <Typography variant="subtitle2">{comment.role}</Typography>
          </Stack>
          <Divider />
          <Typography>{comment.comment}</Typography>
          <Typography variant="caption" color="text.secondary">
            {comment.changes || ""}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
};

export default Comments;
