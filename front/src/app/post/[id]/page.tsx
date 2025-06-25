import ClientPostDetail from '@/components/PostDetail/ClientPostDetail';

// Solución para Next.js 15: primero hay que esperar a que params se resuelva
export default async function PostDetailPage(props: any) {
  // Esperar a que todo el objeto params se resuelva primero
  const params = await props.params;
  const id = params.id;
  const postId = parseInt(id);
  return <ClientPostDetail postId={postId} />;
}
