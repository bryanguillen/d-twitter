import Post from '../post/Post';

export default function Feed({
  posts
}) {
  return (
    <div>
      {
        posts.map((post, index) => (
          <Post
            key={index}
            text={post.value}
            userId={post.userId}
            userImageUrl={'https://d-twitter.s3.us-east-2.amazonaws.com/default-profile-pic.jpg'}
            username={post.username}
          />
        ))
      }
    </div>
  );
}