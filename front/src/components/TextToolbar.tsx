import FormatBoldIcon from '@mui/icons-material/FormatBoldTwoTone';
import FormatItalicIcon from '@mui/icons-material/FormatItalicTwoTone';
import FormatListNumberedTwoToneIcon from '@mui/icons-material/FormatListNumberedTwoTone';
import AddPhotoAlternateTwoToneIcon from '@mui/icons-material/AddPhotoAlternateTwoTone';
import CodeTwoToneIcon from '@mui/icons-material/CodeTwoTone';
import { FormatQuote, Link, List } from '@mui/icons-material';

export default function TextToolbar({ content, setContent }: {
    content: string;
    setContent: (c: string) => void;
}) {
    const append = (text: string) => setContent(content + text);

    return (
        <div
            className="grid gap-2 mb-4 p-2 rounded-lg grid-cols-4 sm:grid-cols-8 md:grid-cols-16"
            style={{ backgroundColor: 'var(--input-bg)' }}
        >
            <IconBtn title="Negrita" onClick={() => append('**bold**')}><FormatBoldIcon /></IconBtn>
            <IconBtn title="Cursiva" onClick={() => append('*italic*')}><FormatItalicIcon /></IconBtn>
            <IconBtn title="Enlace" onClick={() => append('[Link](https://www.example.com)')}><Link /></IconBtn>
            <IconBtn title="Cita" onClick={() => append('\n> This is a quote')}><FormatQuote /></IconBtn>
            <IconBtn title="Lista" onClick={() => append('\n- List item')}><List /></IconBtn>
            <IconBtn title="Lista numerada" onClick={() => append('\n1. List item')}><FormatListNumberedTwoToneIcon /></IconBtn>
            <IconBtn title="Imagen" onClick={() => append('\n![Descripción](https://ejemplo.com/imagen.jpg) <!-- Link directo -->')}><AddPhotoAlternateTwoToneIcon /></IconBtn>
            <IconBtn title="Código" onClick={() => append('\n```\n// tu código aquí\n```')}><CodeTwoToneIcon /></IconBtn>
        </div>
    );
}

function IconBtn({ children, onClick, title }: { children: React.ReactNode, onClick: () => void, title: string }) {
    return (
        <button
            className="w-full h-full flex items-center justify-center hover:text-yellow-400"
            onClick={onClick}
            title={title}
            style={{ color: 'var(--text-color)' }}
        >
            {children}
        </button>
    );
}
