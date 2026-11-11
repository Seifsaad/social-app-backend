import {AbstractRepository} from "../../../lib/db/abstract.repository";
import {IPost, Post} from "../model/post.moel";

class PostRepository extends AbstractRepository<IPost> {
    constructor() {
        super(Post);
    }
}

export default new PostRepository();