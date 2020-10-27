import { withUrqlClient } from "next-urql";
import React, { useState } from "react";
import { Layout } from "../components/Layout";
import { PostsDisplay } from "../components/PostsDisplay";
import { usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 15,
    cursor: null as null | string,
  });

  const [{ data, fetching }] = usePostsQuery({
    variables,
  });

  if (fetching && !data) {
    return <div>You got no post for some reason</div>;
  }
  return (
    <>
      <Layout>
        <PostsDisplay />
      </Layout>
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
