import { Route, Routes } from 'react-router-dom';

import './App.css';
import Layout from './components/Layout';
import IndexPage from './pages/IndexPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CreatePostPage from './pages/CreatePostPage';
import PostPage from './pages/PostPage';
import EditPostPage from './pages/EditPostPage';

function App() {
    return (
        <Routes>
            <Route path={'/'} element={<Layout />}>
                <Route index element={<IndexPage />} />
                <Route path={'/login'} element={<LoginPage />} />
                <Route path={'/register'} element={<RegisterPage />} />
                <Route path={'/create-post'} element={<CreatePostPage />} />
                <Route path={'/post/:id'} element={<PostPage />} />
                <Route path={'/post/edit/:id'} element={<EditPostPage />} />
            </Route>
        </Routes>
    );
}

export default App;
