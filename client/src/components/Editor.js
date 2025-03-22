import ReactQuill from 'react-quill-new';
import { modules, formats } from '../utils/utils';

export default function Editor({ value, onChange }) {
    return (
        <ReactQuill
            value={value}
            onChange={(newValue) => onChange(newValue)}
            theme={'snow'}
            modules={modules}
            formats={formats}
        />
    );
}
