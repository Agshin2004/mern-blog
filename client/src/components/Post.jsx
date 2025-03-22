import { Link } from 'react-router-dom';
import { LiaExternalLinkAltSolid } from 'react-icons/lia';

export default function Post({ _id: id, title, summary, img, createdAt }) {
    const dateOptions = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    };

    return (
        <div className="post">
            <div className="image">
                <Link to={`post/${id}`}>
                    <img src={`http://localhost:3001/${img}`} alt="Post" />
                </Link>
            </div>

            <div className="content">
                <Link to={`/post/${id}`}>
                    <h2>
                        {title} <LiaExternalLinkAltSolid size={20} />
                    </h2>
                </Link>
                <p className="info">
                    <a href="#" className="author">
                        Agshin Nadirov
                    </a>
                    <time>
                        {new Date(createdAt).toLocaleDateString(
                            'en-GB',
                            dateOptions
                        )}
                    </time>
                </p>
                <hr />
                <p className="summary">{summary}</p>
            </div>
        </div>
    );
}
