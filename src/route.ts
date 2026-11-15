import {Router} from 'express'
import {authRouter} from "./app/auth/auth.route";

export const router = Router()

router.use('/auth',authRouter)
// router.use('/user')
// router.use('/post')
// router.use('/comment')