import {gql, useQuery} from '@apollo/client';
import client from '../lib/apollo-client';

const GET_USERS = gql`
  query Users($first: Int, $after: String) {
    users(first: $first, after: $after) {
      edges {
        cursor
        node {
          id
          name
          age
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;

export default function Home() {
  const { data, loading, error, fetchMore } = useQuery(GET_USERS, {
    variables: { first: 10 },
    client,
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

    /* use this in conjunction with the global apollo-client merge object */
//   const loadMore = () => {
//     if (data.users.pageInfo.hasNextPage) {
//       fetchMore({
//         variables: { after: data.users.pageInfo.endCursor },
//       });
//     }
//   };

    /* updateQuery allows for handling updates on a local level */
  const loadMore = () => {
    if (data.users.pageInfo.hasNextPage) {
      fetchMore({
        variables: { after: data.users.pageInfo.endCursor },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) return previousResult;

          return {
            users: {
              edges: [
                ...previousResult.users.edges,
                ...fetchMoreResult.users.edges,
              ],
              pageInfo: fetchMoreResult.users.pageInfo,
            },
          };
        },
      });
    }
  };
    
  return (
    <div>
      <h1>Paginated Users</h1>
          <ul>
        {/*  @ts-ignore */}
        {data.users.edges.map(({node}) => (
          <li key={node.id}>
            {node.name} (Age: {node.age})
          </li>
        ))}
      </ul>
      {data.users.pageInfo.hasNextPage && (
        <button onClick={loadMore}>Load More</button>
      )}
    </div>
  );
}
