import Swal from 'sweetalert2';

export const modules = {
    toolbar: [
        [{ header: [1, 2, false] }],
        ['bold', 'static', 'underline', 'strike', 'blockquote'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image'],
        ['clean'],
    ],
};

export const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
];

export function customAlert(title, text, icon, confirmButtonText) {
    return Swal.fire({
        title,
        text,
        icon,
        confirmButtonText,
    });
}
