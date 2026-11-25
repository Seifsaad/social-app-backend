import multer, {diskStorage} from "multer";


export function multerUpload(){
    return multer({storage:diskStorage({})})
}

export function multerUploadSingle(fieldName:string){
    return multerUpload().single(fieldName)
}

export function multerUploadArray(fieldName:string,maxCount:number){
    return multerUpload().array(fieldName,maxCount)
}