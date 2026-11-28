import {DeleteResult, HydratedDocument, Model, QueryFilter, QueryOptions, Types, UpdateQuery} from "mongoose";

export abstract class AbstractRepository<T> {

    protected constructor(private readonly model:Model<T>) {
    }

    async create(data:Partial<T>): Promise<HydratedDocument<T>> {
        return this.model.create(data);
    }

    async update(filter:QueryFilter<T>, newData:UpdateQuery<T>,options?:QueryOptions<T>):Promise<HydratedDocument<T> | null> {
        return this.model.findOneAndUpdate(filter,newData,{returnDocument:"after"})
    }

    async delete(filter:QueryFilter<T>):Promise<DeleteResult> {
        return this.model.deleteOne(filter)
    }

    async getOne(filter:QueryFilter<T>):Promise<HydratedDocument<T> | null> {
        return this.model.findOne(filter)
    }
}