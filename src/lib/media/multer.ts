import multer, {diskStorage} from "multer";


export function multerUpload(){
    return multer({storage:diskStorage({})})
}

export function multerUploadSingle(fieldName:string){
    multerUpload().single(fieldName)
}

export function multerUploadArray(fieldName:string,maxCount:number){
    multerUpload().array(fieldName,maxCount)
}