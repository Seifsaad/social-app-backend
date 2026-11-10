import {Router} from 'express'
// import './common/db/connection'

export const router = Router()

router.use('/auth')
router.use('/user')
router.use('/post')
router.use('/comment')