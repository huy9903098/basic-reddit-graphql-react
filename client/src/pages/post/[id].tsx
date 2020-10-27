import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Stack,
  Textarea
} from "@chakra-ui/core";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { EditDeletePostButton } from "../../components/EditDeletePostButton";
import { Layout } from "../../components/Layout";
import { PostsDisplay } from "../../components/PostsDisplay";
import { UpdootSection } from "../../components/UpdootSection";
import {
  useGetCommentsByPostIdQuery,
  usePostQuery
} from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";

const Post = ({}) => {
  const router = useRouter();
  const intId =
    typeof router.query.id === "string" ? parseInt(router.query.id) : -1;
  const [{ data, error, fetching }] = usePostQuery({
    pause: intId === -1,
    variables: {
      id: intId,
    },
  });

  const [
    { data: commentsData, error: commentError, fetching: commentFetching },
  ] = useGetCommentsByPostIdQuery({
    variables: {
      postId: intId,
      limit: 15,
      cursor: null as null | string,
    },
  });

  if (fetching) {
    return (
      <Layout>
        <div>...Loading</div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Box>{error.message}</Box>
      </Layout>
    );
  }
  if (!data?.post) {
    return (
      <Layout>
        <Box>Could not find post</Box>
      </Layout>
    );
  }

  return (
    <>
      <Layout>
        <Stack mb={4} spacing={8}>
          <Flex shadow="md" p={5} borderWidth="1px">
            <UpdootSection
              post={{
                id: data.post.id,
                voteStatus: data.post.voteStatus,
                points: data.post.points,
              }}
            />

            <Box width="100%">
              <Flex alignItems="center" justifyContent="space-between">
                <Box>
                  <Heading fontSize="xl">{data.post.title}</Heading>
                </Box>
                <EditDeletePostButton
                  id={data.post.id}
                  creatorId={data.post.creator.id}
                />
              </Flex>

              <Box mt={4} mb={4}>
                Posted by {data.post.creator.username}
              </Box>

              <Box>{data.post.text}</Box>
              <Box mt={5}>
                <Button>Comments</Button>
                <Divider />
                <Formik
                  initialValues={{ title: "", text: "" }}
                  onSubmit={async () => {
                    console.log("create comment");
                  }}
                >
                  {({ isSubmitting }) => (
                    <Form>
                      <Box mt={4}>
                        <Textarea name="text" placeholder="text..." />
                      </Box>

                      <Button
                        type="submit"
                        variantColor="teal"
                        mt={4}
                        isLoading={isSubmitting}
                      >
                        Add Comment
                      </Button>
                    </Form>
                  )}
                </Formik>
              </Box>
              <Box mt={5}>
                {!commentsData && commentFetching ? (
                  <div>Loading ...</div>
                ) : (
                  // <Button onClick={()=>{
                  //   console.log('commentsData',commentsData?.getCommentByPostId.comments)
                  // }}>
                  //   Check data
                  // </Button>
                  <>
                    {commentsData!.getCommentByPostId.comments.map((c) => {
                      console.log('comment c',c)
                    })}
                  </>
                )}
              </Box>
            </Box>
          </Flex>
        </Stack>
        <PostsDisplay exceptionId={data.post.id} />
      </Layout>
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
