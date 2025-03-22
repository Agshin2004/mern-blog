import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import spinner from '../spinner.gif';
import { UserContext } from '../UserContext';

export default function PostPage() {
    const [postInfo, setPostInfo] = useState(null);
    const { userInfo } = useContext(UserContext);
    const { id } = useParams();

    const dateOptions = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    };

    useEffect(() => {
        axios.get(`http://localhost:3001/post/${id}`).then((response) => setPostInfo(response.data.post));
    }, []);

    if (!postInfo)
        return (
            <div className="spinner-wrapper">
                <img src={spinner} alt="Loading Spinner" width={60} />
            </div>
        );

    return (
        <div className="post-page">
            <div className="post-headers">
                <div className="image">
                    <img src={`http://localhost:3001/${postInfo.img}`} alt="" />
                </div>
                <h1 className="post-title">{postInfo.title}</h1>
                <Link to={'/'}>
                    <div className="author">By {postInfo.author.username}</div>
                </Link>
                {userInfo?.data?.id === postInfo.author._id && (
                    <Link to={`/post/edit/${postInfo._id}`} className="edit-post">
                        Edit Post
                    </Link>
                )}
                <time className="post-time">
                    {new Date(postInfo.createdAt).toLocaleDateString('en-GB', dateOptions)}
                </time>
            </div>

            <div className="post-content" dangerouslySetInnerHTML={{ __html: postInfo.content }}></div>
        </div>
    );
}
