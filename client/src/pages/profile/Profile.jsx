import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Post from '../../components/post/Post';
import './Profile.css';

export default function Profile({
  stores,
  decentralizedTwitterContract
}) {
  const [feed, setFeed] = useState([]);
  const params = useParams();
  const userId = parseInt(params.userId);

  useEffect(() => {
    (async function() {
      setFeed(await getPosts());
    })();
  }, []);

  /**
   * @description Function used for getting the posts for page
   * @returns {Array<Object>}
   */
  async function getPosts() {
    const { post, user } = stores;
    const postMetadata = await decentralizedTwitterContract.methods.getPostsForUser(userId).call();
    const postIds = postMetadata.postIds.map(id => parseInt(id));
    const [userData] = await user.query(doc => doc._id == userId); // HACK: Unsure of type
    const postData = await post.query(doc => postIds.includes(parseInt(doc._id)));
    return postData.map((post) => ({ ...post, ...userData })).reverse();
  }

  return (
    <div className="profile">
      {feed.map((post, index) => (
        <Post
          key={index}
          numLikes={0}
          postLiked={false}
          text={post.value}
          userId={post.userId}
          userImageUrl={'https://d-twitter.s3.us-east-2.amazonaws.com/default-profile-pic.jpg'}
          username={post.username}
        />
      ))}
    </div>
  )
}