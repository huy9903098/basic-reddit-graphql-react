import { Box, Flex, IconButton, Link, Text } from "@chakra-ui/core";
import NextLink from "next/link";
import React, { useState } from "react";
import { useDeleteCommentMutation, useMeQuery } from "../generated/graphql";

interface CommentDisplayProps {
  comment: any;
}

export const CommentDisplay: React.FC<CommentDisplayProps> = ({ comment }) => {
  const [readMore, setReadMore] = useState(true);
  const [readMoreButton, setReadMoreButton] = useState(false);
  const [{ data: meData }] = useMeQuery();
  const [, deleteComment] = useDeleteCommentMutation();
  const today = new Date();
  const diffDateSecond = Math.floor(
    (today.getTime() - comment.createdAt) / 1000
  );
  let timeage = "";
  if (diffDateSecond < 60) {
    timeage = diffDateSecond + " seconds ago";
  } else if (diffDateSecond < 60 * 60) {
    const timeDay = Math.floor(diffDateSecond / 60);
    timeage = timeDay + (timeDay > 1 ? " minutes ago" : " minute ago");
  } else if (diffDateSecond < 60 * 60 * 24) {
    const timeDay = Math.floor(diffDateSecond / (60 * 60));
    timeage = timeDay + (timeDay > 1 ? " hours ago" : " hour ago");
  } else {
    const timeDay = Math.floor(diffDateSecond / (60 * 60 * 24));
    timeage = timeDay + (timeDay > 1 ? " days ago" : " day ago");
  }
  return (
    <Flex>
      <Box flex={1}>
        <Box mb={4}>
          <Text fontSize={26}>
            <NextLink href="/user/[id]" as={`/user/${comment.user.id}`}>
              <Link>
                <b>{comment.user.username}</b>
              </Link>
            </NextLink>
          </Text>
          <Text color="gray.500">({timeage})</Text>
        </Box>

        <Flex align="center">
          <Box>
            <Text
              pr={15}
              ref={(element) => {
                if (!element) return;
                const { clientHeight, scrollHeight } = element;
                if (scrollHeight > clientHeight) {
                  setReadMore(true);
                  setReadMoreButton(true);
                }
              }}
              style={
                readMore
                  ? {
                      whiteSpace: "pre-line",
                      maxWidth: "100%",
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 3,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }
                  : { whiteSpace: "pre-line" }
              }
            >
              {comment.text}
            </Text>
            {readMoreButton && (
              <Link
                color="blue.400"
                onClick={() => {
                  setReadMore(!readMore);
                }}
              >
                {readMore ? "Show more" : "Hide"}
              </Link>
            )}
          </Box>

          <Box ml="auto">
            {meData?.me?.id === comment.userId && (
              <IconButton
                icon="delete"
                aria-label="Delete Comment"
                onClick={() => {
                  deleteComment({ id: comment.id });
                }}
              />
            )}
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
};
