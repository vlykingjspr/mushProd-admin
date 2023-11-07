import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { writable } from 'svelte/store'
import { auth } from '../firebase/firebase'


export const authStore = writable({
    user: null,
    loading: true,
    data: {}
})


export const authHandlers = {
    signup: async (email: string, pass: string) => {
        await createUserWithEmailAndPassword(auth, email, pass)
    },
    login: async (email: string, pass: string) => {
        await signInWithEmailAndPassword(auth, email, pass)
    },
    logout: async () => {
        await signOut(auth)
    }
}