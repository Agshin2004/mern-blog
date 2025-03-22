import { useEffect, useState } from 'react';
import Post from '../components/Post';
import axios from 'axios';
import spinner from '../spinner.gif';
import { customAlert } from '../utils/utils';

export default function IndexPage() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        (async function () {
            try {
                await axios.get('http://localhost:3001/post').then((response) => {
                    const posts = response.data;
                    setPosts(posts);
                });
            } catch (err) {
                customAlert('Error Fetching Data', err?.response?.data?.message || err?.message, 'error', 'Confirm');
            }
        })();
    }, []);

    if (!posts.length)
        return (
            <div className="spinner-wrapper">
                <img src={spinner} alt="Loading Spinner" width={60} />
            </div>
        );

    const renderedPosts = posts.map((post) => {
        return <Post key={post._id} {...post} />;
    });

    return <div>{renderedPosts}</div>;
}
