import express, {Request, Response} from 'express'

const app = express()
const port = 3000
const jsonBodyMiddleware = express.json()
app.use(jsonBodyMiddleware)

const db = {
    videos: [{
        "id": 0,
        "title": "string",
        "author": "string",
        "canBeDownloaded": true,
        "minAgeRestriction": null,
        "createdAt": "2024-01-29T19:51:08.546Z",
        "publicationDate": "2024-01-29T19:51:08.546Z",
        "availableResolutions": [
            "P144"
        ]
    },
        {
            "id": 1,
            "title": "11111111",
            "author": "string111",
            "canBeDownloaded": true,
            "minAgeRestriction": null,
            "createdAt": "2025-01-29T19:51:08.546Z",
            "publicationDate": "2024-01-29T19:51:08.546Z",
            "availableResolutions": [
                "P144"
            ]
        }]
}

type TVideo = {
    id: number
    title: string
    author: string
    canBeDownloaded: boolean
    minAgeRestriction: any
    createdAt: string
    publicationDate: string
    availableResolutions: string[]
}

app.get('/', (req: Request, res: Response) => {
    res.send('Hell2o d2as!')
})
app.delete('/testing/all-data', (req: Request, res: Response) => {
    db.videos = []
    res.sendStatus(204)
})

app.get('/videos', (req: Request, res: Response) => {
    res.send(db.videos)
})


app.post('/videos', (req: Request, res: Response) => {
    console.log(req.body.title)
    let isValid = true
    const newVideo: TVideo = {
        id: Date.now(),
        'title': req.body.title,
        "author": req.body.author,
        "canBeDownloaded": false,
        "minAgeRestriction": null,
        "createdAt": "2024-01-29T09:17:06.754Z",
        // "createdAt": new Date().toISOString(),
        "publicationDate": "2024-01-30T09:17:06.754Z",
        "availableResolutions": [
            "P144"
        ]
    }
    if (typeof (req.body.title) !== 'string' || typeof (req.body.author) !== 'string') {
        isValid = false
    }
    let myErrorsMessages:Object[] = []
    checkValid('title', req.body.title, 'string', 40)
    checkValid('author', req.body.author, 'string', 20)
    // checkValid('canBeDownloaded', req.body.canBeDownloaded, 'boolean', 100)
    // checkValid('minAgeRestriction', req.body.minAgeRestriction, 'number', 18)
    // checkValid('publicationDate', req.body.publicationDate, 'string', 180)
    let arr = req.body.availableResolutions
    for(let i of arr){
        if( i[0]!== 'P'){
            myErrorsMessages.push({
                message: 'error',
                field: 'availableResolutions'
            })
        }
    }

    function checkValid(name:string, data:any, type:string, maxLength:number) {
        if (!data && typeof (data) !== type) {
            myErrorsMessages.push({
                message: 'error',
                field: name
            })
        } else if (type === 'number') {
            if (typeof (data) !== type || data > 18 || data < 1) {
                myErrorsMessages.push({
                    message: 'error',
                    field: name
                })
            }
        } else if (typeof (data) !== type || maxLength < data.length && type !== 'boolean') {
            console.log(data.length, 'data length')
            console.log(data, 'data')
            myErrorsMessages.push({
                message: 'error',
                field: name
            })
        }
    }

    if (myErrorsMessages.length ===0) {
        db.videos.push(newVideo)
        res.status(201).send(newVideo)
    } else {
        res.status(400).send({
            errorsMessages: myErrorsMessages
        })
    }


})

app.get('/videos/:id', (req: Request, res: Response) => {
    const videoId = Number(req.params.id)
    console.log(videoId, 'videoid')
    const video = db.videos.find(v => v.id === videoId)
    if (video) {
        res.send(video)
    }
    res.send(404)
})
app.delete('/videos/:id', (req: Request, res: Response) => {
    // for(let i = 0; i < db.videos.length;i++){
    //     if(db.videos[i].id===+req.params.id){
    //         db.videos.splice(i,1)
    //         res.send(204)
    //         return
    //     }
    // }
    // res.send(404)
    const videoId = Number(req.params.id)
    console.log(videoId, 'videoid')
    const videoToDelete = db.videos.find(v => v.id === videoId)
    if (videoToDelete) {

        for (let video in db.videos) {
            console.log(db.videos[+video].id, 'veddd')
            if (db.videos[+video].id === videoToDelete.id) {
                db.videos.splice(Number(video), 1)
                res.send(204)
                return
            }
        }
    }
    res.send(404)
})

app.put('/videos/:id', (req: Request, res: Response) => {
    let isValid = true
    if (typeof (req.body.title) !== 'string' || typeof (req.body.author) !== 'string') {
        isValid = false
    }
    let myErrorsMessages:Object[] = []
    checkValid('title', req.body.title, 'string', 40)
    checkValid('author', req.body.author, 'string', 20)
    checkValid('canBeDownloaded', req.body.canBeDownloaded, 'boolean', 100)
    checkValid('minAgeRestriction', req.body.minAgeRestriction, 'number', 18)
    checkValid('publicationDate', req.body.publicationDate, 'string', 180)

    function checkValid(name:string, data:any, type:string, maxLength:number) {
        if (!data && typeof (data) !== type) {
            myErrorsMessages.push({
                message: 'error',
                field: name
            })
        } else if (type === 'number') {
            if (typeof (data) !== type || data > 18 || data < 1) {
                myErrorsMessages.push({
                    message: 'error',
                    field: name
                })
            }
        } else if (typeof (data) !== type || maxLength < data.length && type !== 'boolean') {
            console.log(data.length, 'data length')
            console.log(data, 'data')
            myErrorsMessages.push({
                message: 'error',
                field: name
            })
        }
    }

    console.log(myErrorsMessages, 'errrors')
    let findVideo = db.videos.find(v => v.id === Number(req.params.id))
    if (!findVideo) {
        res.sendStatus(404)
        console.log(1)

    }

    if (myErrorsMessages.length > 0) {
        res.status(400).send({errorsMessages: myErrorsMessages})
        console.log(2)
    } else if (findVideo && isValid !== false) {
        console.log(3)

        findVideo.title = req.body.title
        findVideo.author = req.body.author
        findVideo.availableResolutions = req.body.availableResolutions
        findVideo.canBeDownloaded = req.body.canBeDownloaded
        findVideo.minAgeRestriction = req.body.minAgeRestriction
        findVideo.publicationDate = req.body.publicationDate
        res.sendStatus(204)
    }

})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})