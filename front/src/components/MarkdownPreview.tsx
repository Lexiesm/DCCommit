import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

export default function MarkdownPreview({ content, title }: { content: string, title?: string }) {
    return (
        <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--input-bg)', color: 'var(--input-text)' }}>
            {title && (
                <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--input-text)' }}>{title}</h2>
            )}
            <ReactMarkdown
                children={content}
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                    blockquote: ({ children }) => (
                        <blockquote className="border-l-4 pl-4 italic text-gray-400">{children}</blockquote>
                    ),
                    pre: ({ children }) => (
                        <pre
                            style={{
                                backgroundColor: 'var(--code-bg)',
                                color: 'var(--code-text)',
                                padding: '1rem',
                                borderRadius: '0.5rem',
                                overflowX: 'auto',
                                fontFamily: 'monospace',
                            }}
                        >
                            {children}
                        </pre>
                    ),
                    code: ({ children, ...props }) => (
                        <code
                            {...props}
                            style={{ backgroundColor: 'var(--code-bg)', color: 'var(--code-text)' }}
                        >
                            {children}
                        </code>
                    ),
                    ul: ({ children }) => <ul className="list-disc list-inside">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal list-inside">{children}</ol>,
                    li: ({ children }) => <li className="mb-1">{children}</li>,
                }}
            />
        </div>
    );
}
