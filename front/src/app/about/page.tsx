/**
 * Componente: About
 *
 * La vista "Acerca de Nosotros" sigue el patrón de renderizado **Static Site Generation (SSG)**.
 * Este patrón es ideal para contenido estático que no cambia frecuentemente, ya que mejora el rendimiento al generar el contenido previamente durante la compilación.
 *
 * La página se organiza en varias secciones que se muestran como tarjetas:
 * - **¿Qué es DCCommit?**: Se explica qué es la plataforma DCCommit.
 * - **Reglas**: Se muestran las reglas de la comunidad, cada una dentro de su propia tarjeta.
 * - **Perfil de los Creadores**: Tarjetas que muestran el perfil de los creadores con su imagen de avatar, nombre y enlace a GitHub.
 *
 * El contenido de la página se genera de manera estática, lo que mejora la velocidad de carga y el SEO. La información sobre los creadores se extrae de un diccionario de objetos que contiene los datos necesarios, como nombre, URL del perfil y avatar. Las tarjetas de los creadores se generan dinámicamente a partir de este diccionario utilizando `map()`.
 *
 * El componente también hace uso de TailwindCSS y DaisyUI para los estilos y se adapta automáticamente al modo claro/oscuro basado en las variables globales definidas en `global.css`.
 *
 * Este componente puede ser utilizado en cualquier lugar dentro de la aplicación React.
 */


const creators = [
    {
        name: "Alexandra San Martín",
        profileUrl: "https://github.com/Lexiesm",
        avatarUrl: "https://avatars.githubusercontent.com/u/101207522?v=4",
    },
    {
        name: "Joaquín Peralta Pérez",
        profileUrl: "https://github.com/roahoki",
        avatarUrl: "https://avatars.githubusercontent.com/u/89496233?v=4",
    },
    {
        name: "Ignacia González Goicovich",
        profileUrl: "https://github.com/IgnaciaGonzlez",
        avatarUrl: "https://avatars.githubusercontent.com/u/81325107?v=4",
    },
];

export default function About() {
    return (
        <div
            className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[var(--font-geist-sans)] w-full" // Añadimos w-full y eliminamos max-w-screen-lg
            style={{ backgroundColor: 'var(--background-color)', color: 'var(--text-color)' }}
        >
            {/* Título */}
            <h1 className="text-4xl font-bold mb-8" style={{ color: 'var(--text-color)' }}>
                Acerca de Nosotros
            </h1>

            {/* Sección: Qué es DCCommit */}
            <section className="text-lg mb-12 w-full sm:w-3/4 lg:w-3/4">
                <div className="card bg-base-100 shadow-xl w-full">
                    <div className="card-body">
                        <h2 className="text-2xl font-semibold mb-4">¿Qué es DCCommit?</h2>
                        <p>
                            DCCommit es tu plataforma ideal para aprender habilidades de codificación. Nos dedicamos a proporcionar recursos educativos de alta calidad para ayudarte a tener éxito en tu camino de programación. 🚀
                        </p>
                    </div>
                </div>
            </section>

            {/* Sección: Reglas */}
            <section className="text-lg mb-12 w-full sm:w-3/4 lg:w-3/4">
                <h2 className="text-2xl font-semibold mb-4">Reglas</h2>
                <div className="flex flex-col gap-6">
                    {/* Tarjetas para las reglas */}
                    <div className="card w-full bg-base-100 shadow-xl mb-4">
                        <div className="card-body">
                            <h3 className="text-xl font-semibold">No al plagio 🚫</h3>
                            <p>Siempre da crédito a tus fuentes. La originalidad es clave. 🌟</p>
                        </div>
                    </div>

                    <div className="card w-full bg-base-100 shadow-xl mb-4">
                        <div className="card-body">
                            <h3 className="text-xl font-semibold">Sé respetuoso 🤝</h3>
                            <p>Trata a todos los miembros con amabilidad y respeto. ¡La comunidad primero! 💬</p>
                        </div>
                    </div>

                    <div className="card w-full bg-base-100 shadow-xl mb-4">
                        <div className="card-body">
                            <h3 className="text-xl font-semibold">Haz preguntas ❓</h3>
                            <p>Participa activamente en discusiones con la comunidad. No dudes en preguntar. 🤔</p>
                        </div>
                    </div>

                    <div className="card w-full bg-base-100 shadow-xl mb-4">
                        <div className="card-body">
                            <h3 className="text-xl font-semibold">Contribuye a la comunidad 🤗</h3>
                            <p>Comparte tu conocimiento y ayuda a los demás. ¡Todos crecemos juntos! 🌱</p>
                        </div>
                    </div>

                    <div className="card w-full bg-base-100 shadow-xl mb-4">
                        <div className="card-body">
                            <h3 className="text-xl font-semibold">Aprende siempre 📚</h3>
                            <p>Esté dispuesto a aprender y recibir retroalimentación. ¡El aprendizaje es constante! 📖</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Sección: Cómo hacer un Post */}
            <section className="text-lg mb-12 w-full sm:w-3/4 lg:w-3/4">
                <div className="card bg-base-100 shadow-xl w-full">
                    <div className="card-body">
                        <h2 className="text-2xl font-semibold mb-4">Cómo publicar un Post</h2>
                        <p>
                            Para publicar en DCCommit, primero debes crear un Post. Este será revisado por nuestro equipo antes de ser publicado, asegurándonos de que todo el contenido cumpla con nuestras normas. 🔍
                        </p>
                        <p>
                            ¡Asegúrate de seguir las reglas de la comunidad y de ser respetuoso con los demás miembros! 🙌
                        </p>
                    </div>
                </div>
            </section>

            {/* Sección: Perfil de GitHub */}
            <section className="text-lg mb-12 w-full sm:w-3/4 lg:w-3/4">
                <h2 className="text-2xl font-semibold mb-4 text-center" style={{ color: 'var(--text-color)' }}>
                    Conoce a los Creadores
                </h2>
                <div className="flex flex-wrap justify-center gap-6 mt-6">
                    {/* Mapeo sobre el diccionario de creadores */}
                    {creators.map((creator, index) => (
                        <a
                            key={index}
                            href={creator.profileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="card w-60 bg-base-100 shadow-xl transition-all duration-300"
                            style={{ color: 'var(--text-color)' }}
                        >
                            <figure className="avatar flex justify-center">
                                <div className="w-24 h-24 mt-6 mb-6 rounded-full ring-2 ring-offset-2 ring-primary">
                                    <img
                                        src={creator.avatarUrl}
                                        alt={`Creador ${index + 1}`}
                                        className="object-cover"
                                    />
                                </div>
                            </figure>
                            <div className="card-body text-center">
                                <h3 className="text-xl font-semibold">{creator.name}</h3>
                                <p className="text-blue-600 hover:text-blue-800">
                                    Ver Perfil de GitHub
                                </p>
                            </div>
                        </a>
                    ))}
                </div>
            </section>


        </div>
    );
}
