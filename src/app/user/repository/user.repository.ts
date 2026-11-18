import {IUser} from "../interface/user.interface";
import {User, userDocument} from "../model/user.model";
import {AbstractRepository} from "../../../lib/db/abstract.repository";

export class UserRepository extends AbstractRepository<IUser>{

    constructor() {
        super(User)
    }
    async findByEmail(email: string):Promise<userDocument | null> {
        return User.findOne({email:email})
    }
}

export default new UserRepository();