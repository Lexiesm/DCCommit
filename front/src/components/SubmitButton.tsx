interface SubmitButtonProps {
    onClick?: () => void;
    isSubmitting?: boolean;
    text?: string;
    submittingText?: string;
}

export default function SubmitButton({ 
    onClick, 
    isSubmitting = false, 
    text = "Crear", 
    submittingText = "Procesando..." 
}: SubmitButtonProps) {
    return (
        <button
            onClick={onClick}
            disabled={isSubmitting}
            type="submit"
            className="btn w-full md:w-auto"
            style={{
                backgroundColor: 'var(--submit-button-bg)',
                color: 'var(--submit-button-text)',
            }}
        >
            {isSubmitting ? submittingText : text}
        </button>
    );
}
