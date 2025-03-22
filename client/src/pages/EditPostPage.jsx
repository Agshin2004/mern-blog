import { useEffect, useState } from 'react';
import Editor from '../components/Editor';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { customAlert } from '../utils/utils';

export default function EditPostPage() {
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [uploadedPhoto, setUploadedPhoto] = useState([]);
    const [currPostPhoto, setCurrPostPhoto] = useState('');
    const { id: postId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        axios(`http://localhost:3001/post/${postId}`).then((response) => {
            const { post } = response.data;
            setTitle(post.title);
            setSummary(post.summary);
            setContent(post.content);
            setCurrPostPhoto(post.img);
        });
    }, []);

    const updatePost = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', title);
        formData.append('summary', summary);
        formData.append('content', content);
        formData.append('id', postId); // Sending post's id to backend for further validation
        if (uploadedPhoto?.[0]) {
            formData.append('photo', uploadedPhoto[0]);
        }
        console.log('formData', formData);

        try {
            const response = await axios({
                url: `http://localhost:3001/post/${postId}`,
                method: 'PATCH',
                data: formData,
                withCredentials: true,
            });
            if (response.status === 200) {
                customAlert('Success', 'Saved.', 'success', 'Confirm');
                setTimeout(() => {
                    return navigate(`/post/${response.data._id}`);
                }, 2000);
            }
        } catch (err) {
            customAlert('Error', err?.response?.data?.message || err?.message, 'error', 'Confirm');
        }
    };

    const deletePost = async () => {
        try {
            const response = await axios({
                url: `http://localhost:3001/post/${postId}`,
                method: 'DELETE',
            });

            console.log(response)

            if (response.status === 204) {
                customAlert('Success', 'Deleted.', 'success', 'Confirm');
                setTimeout(() => {
                    return navigate(`/`);
                }, 2000);
            }
        } catch (err) {
            customAlert('Error', err?.response?.data?.message || err?.message, 'error', 'Confirm');
        }
    };

    return (
        <div>
            <span className="delete-post" onClick={deletePost}>
                Delete Post
            </span>

            <form className="edit-post-form" onSubmit={updatePost}>
                <input
                    type="text"
                    title="Title of the post"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <input type="text" placeholder="Summary" value={summary} onChange={(e) => setSummary(e.target.value)} />
                <input
                    type="file"
                    onChange={(e) => {
                        setUploadedPhoto(e.target.files);
                    }}
                />
                <img width={150} src={`http://localhost:3001/${currPostPhoto}`} alt="" />
                <Editor value={content} onChange={setContent} />

                <button className="create-button">Create Post</button>
            </form>
        </div>
    );
}
