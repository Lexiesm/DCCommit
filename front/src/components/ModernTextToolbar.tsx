'use client';
import { useState, useRef, useEffect } from 'react';
import { FiBold, FiItalic, FiLink, FiList, FiCode, FiImage } from 'react-icons/fi';
import { RiListOrdered } from 'react-icons/ri';
import { FaQuoteRight } from 'react-icons/fa';

interface TextToolbarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minRows?: number;
  maxRows?: number;
}

export default function ModernTextToolbar({
  value,
  onChange,
  placeholder = 'Add to the discussion',
  minRows = 3,
  maxRows = 8
}: TextToolbarProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const insertAtCursor = (before: string, after: string = '') => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    const newValue = value.substring(0, start) + before + selectedText + after + value.substring(end);
    onChange(newValue);
    
    // Re-focus and move cursor to the right position
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = start + before.length + selectedText.length;
      textarea.selectionEnd = start + before.length + selectedText.length;
    }, 0);
  };

  const handleToolbarAction = (action: string) => {
    switch (action) {
      case 'bold':
        insertAtCursor('**', '**');
        break;
      case 'italic':
        insertAtCursor('*', '*');
        break;
      case 'link':
        insertAtCursor('[', '](https://)');
        break;
      case 'quote':
        insertAtCursor('> ');
        break;
      case 'list':
        insertAtCursor('- ');
        break;
      case 'ordered-list':
        insertAtCursor('1. ');
        break;
      case 'code':
        insertAtCursor('```\n', '\n```');
        break;

      default:
        break;
    }
  };

  // Auto adjust text area height
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    textarea.style.height = 'auto';
    const newHeight = Math.min(
      Math.max(textarea.scrollHeight, minRows * 24), // 24px is approx line height
      maxRows * 24
    );
    textarea.style.height = `${newHeight}px`;
  }, [value, minRows, maxRows]);

  return (
    <div className={`border border-gray-700 rounded-lg overflow-hidden transition-all ${isFocused ? 'border-violet-500 shadow-lg shadow-violet-500/20' : ''}`}>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-gray-800 text-white p-3 outline-none resize-none overflow-hidden"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={{ minHeight: `${minRows * 24}px` }}
      />
      
      {/* Toolbar */}
      <div className="flex items-center bg-gray-900 px-2 py-1 border-t border-gray-700">
        <div className="flex space-x-1 overflow-x-auto">
          <ToolbarButton
            onClick={() => handleToolbarAction('bold')}
            icon={<FiBold size={16} />}
            tooltip="Bold"
          />
          <ToolbarButton
            onClick={() => handleToolbarAction('italic')}
            icon={<FiItalic size={16} />}
            tooltip="Italic"
          />
          <ToolbarButton
            onClick={() => handleToolbarAction('link')}
            icon={<FiLink size={16} />}
            tooltip="Link"
          />
          <ToolbarButton
            onClick={() => handleToolbarAction('quote')}
            icon={<FaQuoteRight size={14} />}
            tooltip="Quote"
          />
          <ToolbarButton
            onClick={() => handleToolbarAction('list')}
            icon={<FiList size={16} />}
            tooltip="Bullet List"
          />
          <ToolbarButton
            onClick={() => handleToolbarAction('ordered-list')}
            icon={<RiListOrdered size={16} />}
            tooltip="Numbered List"
          />
          <ToolbarButton
            onClick={() => handleToolbarAction('code')}
            icon={<FiCode size={16} />}
            tooltip="Code Block"
          />

        </div>
      </div>
    </div>
  );
}

interface ToolbarButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  tooltip: string;
}

function ToolbarButton({ onClick, icon, tooltip }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
      title={tooltip}
    >
      {icon}
    </button>
  );
}
