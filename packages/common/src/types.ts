import { z } from 'zod';

// create a schema for the data we want to validate
export const CreateUserSchema = z.object({
    username: z.string().min(3).max(255),
    password: z.string().min(5).max(20),
    name: z.string().min(3).max(20),
})

export const SigninSchema = z.object({
    username: z.string().min(3).max(255),
    password: z.string().min(5).max(20), 
})

export const CreateRoomSchema = z.object({
     name: z.string().min(3).max(20), 
})