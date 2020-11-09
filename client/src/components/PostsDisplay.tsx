import { Box, Button, Flex, Heading, Link, Stack, Text } from "@chakra-ui/core";
import NextLink from "next/link";
import React, { useEffect, useState } from "react";
import { usePostsQuery } from "../generated/graphql";
import { EditDeletePostButton } from "./EditDeletePostButton";
import { UpdootSection } from "./UpdootSection";

interface PostsDisplayProps {
  exceptionId?: number;
  keyword?: string | null;
}

export const PostsDisplay: React.FC<PostsDisplayProps> = ({
  exceptionId,
  keyword,
}) => {
  const [variables, setVariables] = useState({
    limit: 15,
    cursor: null as null | string,
    keyword,
  });

  const [{ data, fetching }] = usePostsQuery({
    variables,
  });

  if (fetching && !data) {
    return <div>You got no post for some reason</div>;
  }

  if (keyword) {
    useEffect(() => {
      setVariables({
        limit: variables.limit,
        cursor: null,
        keyword: keyword,
      });
    }, [keyword]);
  }

  return (
    <>
      {!data && fetching ? (
        <div>Loading...</div>
      ) : (
        <Stack spacing={8}>
          {data!.posts.posts.map((p) =>
            p && p.id !== exceptionId ? (
              <Flex key={p.id} shadow="md" p={5} borderWidth="1px">
                <UpdootSection
                  post={{
                    id: p.id,
                    voteStatus: p.voteStatus,
                    points: p.points,
                  }}
                />
                <Box flex={1}>
                  <NextLink href="/post/[id]" as={`/post/${p.id}`}>
                    <Link>
                      <Heading fontSize="xl">{p.title}</Heading>
                    </Link>
                  </NextLink>

                  <Text>posted by {p.creator.username} </Text>

                  <Flex align="center">
                    <Text mt={1}>{p.textSnippet}</Text>

                    <Box ml="auto">
                      <EditDeletePostButton
                        id={p.id}
                        creatorId={p.creator.id}
                      />
                    </Box>
                  </Flex>
                </Box>
              </Flex>
            ) : null
          )}
        </Stack>
      )}
      {data && data.posts.hasMore ? (
        <Flex>
          <Button
            onClick={() => {
              setVariables({
                limit: variables.limit,
                cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
                keyword,
              });
            }}
            isLoading={fetching}
            m="auto"
            my={4}
          >
            Load More
          </Button>
        </Flex>
      ) : null}
    </>
  );
};
