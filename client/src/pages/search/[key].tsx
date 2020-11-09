import { Heading } from "@chakra-ui/core";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { Layout } from "../../components/Layout";
import { PostsDisplay } from "../../components/PostsDisplay";
import { createUrqlClient } from "../../utils/createUrqlClient";

const Search = ({}) => {
  const router = useRouter();
  const keyword =
    typeof router.query.key === "string" ? decodeURI(router.query.key) : null;
  // const [variables, setVariables] = useState({
  //   limit: 15,
  //   cursor: null as null | string,
  //   keyword: keyword,
  // });

  // const [{ data, fetching }] = usePostsQuery({
  //   variables,
  // });

  // if (fetching && !data) {
  //   return <div>You got no post for some reason</div>;
  // }
  // useEffect(() => {
  //   setVariables({
  //     limit: variables.limit,
  //     cursor: null,
  //     keyword: keyword,
  //   });
  // }, [keyword]);
  return (
    <Layout>
      <>
        <Heading mb={10} textAlign="center">
          Search by key word "{keyword}"
        </Heading>
        <PostsDisplay keyword={keyword}/>
        {/* {!data && fetching ? (
          <div>Loading...</div>
        ) : (
          <Stack spacing={8}>
            {data!.posts.posts.length !== 0 ? (
              data!.posts.posts.map((p) =>
                p ? (
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
              )
            ) : (
              <div>No posts are avaiable</div>
            )}
          </Stack>
        )}
        {data && data.posts.hasMore ? (
          <Flex>
            <Button
              onClick={() => {
                setVariables({
                  limit: variables.limit,
                  cursor:
                    data.posts.posts[data.posts.posts.length - 1].createdAt,
                  keyword: keyword,
                });
              }}
              isLoading={fetching}
              m="auto"
              my={4}
            >
              Load More
            </Button>
          </Flex>
        ) : null} */}
      </>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Search);
