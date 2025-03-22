import axios from 'axios';
import { useState } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';
import { modules, formats, customAlert } from '../utils/utils';
import Editor from '../components/Editor';

export default function CreatePostPage() {
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [photos, setPhotos] = useState([]);

    const navigate = useNavigate();

    const createNewPost = async (e) => {
        e.preventDefault(); // Prevent form submission before logging
        const formData = new FormData();
        formData.append('title', title);
        formData.append('summary', summary);
        formData.append('content', content);
        formData.append('photo', photos[0]);

        try {
            const response = await axios({
                url: 'http://localhost:3001/post',
                method: 'POST',
                data: formData,
                withCredentials: true, // Including credentials (jwt per se, so we can get user's id and attach to post)
            });

            if (response.status === 200) {
                if (response.status === 200) {
                    customAlert('Success', 'Saved.', 'success', 'Confirm');
                    setTimeout(() => {
                        return navigate(`/post/${response.data.post._id}`);
                    }, 2000);
                }
                console.log(response.data)
            }
        } catch (err) {
            customAlert('Error', err?.response?.data?.message || err?.message, 'error', 'Confirm');
        }
    };

    return (
        <form onSubmit={createNewPost}>
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
                    setPhotos(e.target.files);
                }}
            />
            <Editor value={content} onChange={setContent} />

            <button className="create-button">Create Post</button>
        </form>
    );
}
