import {Router} from 'express'
import {authRouter} from "./app/auth/auth.route";
import {userRouter} from "./app/user/user.route";

export const router = Router()

router.use('/auth',authRouter)
router.use('/user',userRouter)
// router.use('/post')
// router.use('/comment')