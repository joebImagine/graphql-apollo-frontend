import {gql, useQuery} from '@apollo/client';
import {useState} from 'react';
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
  const [cursor, setCursor] = useState(null);
  const { data, loading, error, fetchMore } = useQuery(GET_USERS, {
    variables: { first: 10, after: cursor },
    client,
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const loadMore = () => {
    if (data.users.pageInfo.hasNextPage) {
      fetchMore({
        variables: { after: data.users.pageInfo.endCursor },
      }).then(({ data: newData }) => {
        setCursor(newData.users.pageInfo.endCursor);
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
