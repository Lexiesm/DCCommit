'use server'

import { checkRole } from '@/utils/roles'
import { clerkClient } from '@clerk/nextjs/server'
import { log } from 'console'

export async function setRole(formData: FormData) {
    const client = await clerkClient()

    // Check that the user trying to set the role is an admin
    if (!checkRole('admin')) {
        log('User is not an admin')
        return
    }

    try {
        const res = await client.users.updateUserMetadata(formData.get('id') as string, {
            publicMetadata: { role: formData.get('role') },
        })
        log(res)
        return 
    } catch (err) {
        log(err)
        return
    }
}

export async function removeRole(formData: FormData) {
    const client = await clerkClient()

    // Check that the user trying to set the role is an admin
    if (!checkRole('admin')) {
        log('User is not an admin')
        return
    }

    try {
        const res = await client.users.updateUserMetadata(formData.get('id') as string, {
            publicMetadata: { role: null },
        })
        log(res)
        return
    } catch (err) {
        log(err)
        return
    }
}