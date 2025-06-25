import { Roles } from '@/types/globals'
import { auth } from '@clerk/nextjs/server'

export const checkRole = async (role: Roles) => {
    const { sessionClaims } = await auth()
    return sessionClaims?.metadata.role === role
}

export const isAdmin = async () => {
    return checkRole('admin')
}

export const isModerator = async () => {
    return checkRole('moderator')
}

export const isUser = async () => {
    return checkRole('user')
}