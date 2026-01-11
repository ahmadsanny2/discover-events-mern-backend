import { Response } from "express"
import { IReqUser } from "../utils/interfaces"
import uploader from "../utils/uploader"

export default {
    async single(req: IReqUser, res: Response) {
        if (!req.file) {
            return res.status(400).json({
                data: null,
                messsage: "File is not exist"
            })
        }

        try {
            const result = await uploader.uploadSingle(req.file as Express.Multer.File)
            res.status(200).json({
                data: result,
                message: "File uploaded successfully"
            })
        } catch {
            res.status(500).json({
                data: null,
                message: "Failed to upload file"
            })
        }
    },

    async multiple(req: IReqUser, res: Response) {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                data: null,
                messsage: "Files is not exist"
            })
        }

        try {
            const result = await uploader.uploadMultiple(req.files as Express.Multer.File[])
            res.status(200).json({
                data: result,
                message: "Files uploaded successfully"
            })
        } catch {
            res.status(500).json({
                data: null,
                message: "Failed to upload files"
            })
        }
    },

    async remove(req: IReqUser, res: Response) {
        try {
            const { fileUrl } = req.body as { fileUrl: string }
            const result = await uploader.remove(fileUrl)

            res.status(200).json({
                message: "File removed successfully",
                data: result
            })
        } catch{
            res.status(500).json({
                message: "Failed to remove file",
                data: null
            })
        }
    }
}