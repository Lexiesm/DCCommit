export { }

// Create a type for the roles
export type Roles = 'admin' | 'moderator' | 'user'

// Post status types
export type PostStatus = 'pending' | 'approved' | 'rejected'

// Post type definition
export interface PostType {
  id: number;
  user?: UserType;
  date: string;
  title: string;
  content: string;
  tags: string[];
  comments: number;
  reactions: number;
  readTime: string;
  status: PostStatus;
}

export interface UserType {
  id: number;
  clerkId: string;
  name: string;
  nickname: string;
  password: string;
  profile_picture: string;
  email: string;
  rol: string;
}

declare global {
    interface CustomJwtSessionClaims {
        metadata: {
            role?: Roles
        }
    }
}