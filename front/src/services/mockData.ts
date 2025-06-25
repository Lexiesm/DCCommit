// Archivo para almacenar datos simulados durante el desarrollo

export interface MockPost {
    id: number;
    title: string;
    content: string;
    date: string;
    status: 'pending' | 'approved' | 'rejected';
    likes: number;
    userId: string;
    user?: {
        name: string;
        nickname?: string;
        profile_picture?: string;
        clerkId: string;
    };
}

export interface MockComment {
    id: number;
    content: string;
    createdAt: string;
    userId: string;
    postId: number;
    user?: {
        name: string;
        nickname?: string;
        profile_picture?: string;
        clerkId: string;
    };
}

export interface MockUser {
    id: number;
    name: string;
    nickname?: string;
    email: string;
    profile_picture?: string;
    clerkId: string;
    role: 'USER' | 'MODERATOR' | 'ADMIN';
    createdAt: string;
}

export interface MockReport {
    id: number;
    reason: string;
    description?: string;
    postId?: number;
    commentId?: number;
    reporterId: string;
    createdAt: string;
    status: 'pending' | 'resolved' | 'dismissed';
}

// Datos mock iniciales
export const mockPosts: MockPost[] = [
    {
        id: 1,
        title: 'Introducción a Next.js',
        content: '# Introducción a Next.js\n\nNext.js es un framework de React que permite la creación de aplicaciones web modernas. Proporciona varias características útiles como renderizado del lado del servidor (SSR), generación de sitios estáticos (SSG), y más.\n\n## Características principales\n\n- **Renderizado del lado del servidor (SSR)**: Mejora SEO y tiempo de carga inicial.\n- **Generación de sitios estáticos (SSG)**: Excelente para contenido que no cambia frecuentemente.\n- **API Routes**: Permite crear APIs fácilmente.\n\n```javascript\n// Ejemplo de una API route\nexport default function handler(req, res) {\n  res.status(200).json({ name: \'John Doe\' });\n}\n```',
        date: '2025-06-10T12:00:00Z',
        status: 'approved',
        likes: 15,
        userId: 'user_123',
        user: {
            name: 'Ana Torres',
            nickname: 'anatrs',
            profile_picture: 'https://randomuser.me/api/portraits/women/12.jpg',
            clerkId: 'user_123'
        }
    },
    {
        id: 2,
        title: 'Optimización de rendimiento en React',
        content: '# Optimización de rendimiento en React\n\nLa optimización del rendimiento en React es crucial para mantener una experiencia de usuario fluida. Aquí compartimos algunos consejos útiles.\n\n## Consejos de optimización\n\n1. **Memoización**: Utiliza React.memo, useMemo y useCallback para evitar re-renders innecesarios.\n2. **Virtualization**: Implementa una renderización virtualizada para listas largas.\n3. **Code Splitting**: Divide tu código para cargar solo lo necesario.\n\n```jsx\n// Ejemplo con useMemo\nconst memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);\n```',
        date: '2025-06-15T15:30:00Z',
        status: 'approved',
        likes: 8,
        userId: 'user_456',
        user: {
            name: 'Carlos Méndez',
            nickname: 'carlosdev',
            profile_picture: 'https://randomuser.me/api/portraits/men/22.jpg',
            clerkId: 'user_456'
        }
    },
    {
        id: 3,
        title: 'Introducción a TypeScript con React',
        content: '# Introducción a TypeScript con React\n\nTypeScript mejora enormemente la experiencia de desarrollo con React al proporcionar tipado estático. Vamos a ver cómo iniciarse.\n\n## Configuración inicial\n\n1. Instala TypeScript: `npm install typescript @types/react @types/react-dom`\n2. Crea un archivo tsconfig.json\n3. Convierte tus archivos .jsx a .tsx\n\n## Ejemplo de componente con TypeScript\n\n```tsx\ninterface ButtonProps {\n  text: string;\n  onClick?: () => void;\n  color?: \'primary\' | \'secondary\';\n}\n\nconst Button: React.FC<ButtonProps> = ({ text, onClick, color = \'primary\' }) => {\n  return (\n    <button \n      className={`btn btn-${color}`} \n      onClick={onClick}\n    >\n      {text}\n    </button>\n  );\n};\n```',
        date: '2025-06-18T09:45:00Z',
        status: 'pending',
        likes: 0,
        userId: 'user_456',
        user: {
            name: 'Carlos Méndez',
            nickname: 'carlosdev',
            profile_picture: 'https://randomuser.me/api/portraits/men/22.jpg',
            clerkId: 'user_456'
        }
    },
    {
        id: 4,
        title: 'Manejo de estado global con Context API',
        content: '# Manejo de estado global con Context API\n\nLa Context API de React es una solución nativa para manejar estado global sin necesidad de bibliotecas externas.\n\n## Pasos para implementar Context API\n\n1. Crear el contexto con `React.createContext()`\n2. Proporcionar el contexto con un `Provider`\n3. Consumir el contexto con `useContext`\n\n```jsx\n// Creación\nconst ThemeContext = React.createContext(\'light\');\n\n// Provisión\nfunction App() {\n  return (\n    <ThemeContext.Provider value=\'dark\'>\n      <ThemedButton />\n    </ThemeContext.Provider>\n  );\n}\n\n// Consumo\nfunction ThemedButton() {\n  const theme = useContext(ThemeContext);\n  return <button className={theme}>Botón Temático</button>;\n}\n```',
        date: '2025-06-19T14:20:00Z',
        status: 'rejected',
        likes: 0,
        userId: 'user_789',
        user: {
            name: 'María López',
            nickname: 'mariacode',
            profile_picture: 'https://randomuser.me/api/portraits/women/45.jpg',
            clerkId: 'user_789'
        }
    }
];

export const mockComments: MockComment[] = [
    {
        id: 1,
        content: 'Gran artículo, muy útil para entender los conceptos básicos de Next.js',
        createdAt: '2025-06-11T14:30:00Z',
        userId: 'user_456',
        postId: 1,
        user: {
            name: 'Carlos Méndez',
            nickname: 'carlosdev',
            profile_picture: 'https://randomuser.me/api/portraits/men/22.jpg',
            clerkId: 'user_456'
        }
    },
    {
        id: 2,
        content: '¿Podrías profundizar más en las diferencias entre SSR y SSG?',
        createdAt: '2025-06-12T10:15:00Z',
        userId: 'user_789',
        postId: 1,
        user: {
            name: 'María López',
            nickname: 'mariacode',
            profile_picture: 'https://randomuser.me/api/portraits/women/45.jpg',
            clerkId: 'user_789'
        }
    },
    {
        id: 3,
        content: 'Me gustaría ver ejemplos de cómo implementar la memoización en componentes complejos.',
        createdAt: '2025-06-16T09:22:00Z',
        userId: 'user_123',
        postId: 2,
        user: {
            name: 'Ana Torres',
            nickname: 'anatrs',
            profile_picture: 'https://randomuser.me/api/portraits/women/12.jpg',
            clerkId: 'user_123'
        }
    }
];

export const mockUsers: MockUser[] = [
    {
        id: 1,
        name: 'Ana Torres',
        nickname: 'anatrs',
        email: 'ana.torres@example.com',
        profile_picture: 'https://randomuser.me/api/portraits/women/12.jpg',
        clerkId: 'user_123',
        role: 'USER',
        createdAt: '2024-12-01T00:00:00Z'
    },
    {
        id: 2,
        name: 'Carlos Méndez',
        nickname: 'carlosdev',
        email: 'carlos.mendez@example.com',
        profile_picture: 'https://randomuser.me/api/portraits/men/22.jpg',
        clerkId: 'user_456',
        role: 'USER',
        createdAt: '2025-01-15T00:00:00Z'
    },
    {
        id: 3,
        name: 'María López',
        nickname: 'mariacode',
        email: 'maria.lopez@example.com',
        profile_picture: 'https://randomuser.me/api/portraits/women/45.jpg',
        clerkId: 'user_789',
        role: 'MODERATOR',
        createdAt: '2025-02-20T00:00:00Z'
    },
    {
        id: 4,
        name: 'Juan Pérez',
        nickname: 'juandev',
        email: 'juan.perez@example.com',
        profile_picture: 'https://randomuser.me/api/portraits/men/32.jpg',
        clerkId: 'user_101',
        role: 'ADMIN',
        createdAt: '2024-11-05T00:00:00Z'
    }
];

export const mockReports: MockReport[] = [
    {
        id: 1,
        reason: 'inappropriate',
        description: 'Este contenido contiene lenguaje inapropiado',
        postId: 4,
        reporterId: 'user_123',
        createdAt: '2025-06-20T16:45:00Z',
        status: 'pending'
    },
    {
        id: 2,
        reason: 'spam',
        description: 'Este comentario parece spam comercial',
        commentId: 2,
        reporterId: 'user_456',
        createdAt: '2025-06-21T08:30:00Z',
        status: 'pending'
    }
];
