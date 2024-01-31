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




app.get('/videos/:id', (req: Request, res: Response) => {
    let findVideo = db.videos.find(v => v.id === +req.params.id)
    if (findVideo) {
        res.status(200).send(findVideo)
    } else {
        res.sendStatus(404)
    }
})


app.delete('/videos/:id', (req: Request, res: Response) => {
    let findVideoIndex = db.videos.findIndex(v => v.id === +req.params.id)
    if (findVideoIndex >= 0) {
        db.videos.splice(findVideoIndex, 1)
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})
app.post('/videos', (req: Request, res: Response) => {
    const newVideo: TVideo = {
        id: Date.now(),
        'title': req.body.title,
        "author": req.body.author,
        "canBeDownloaded": false,
        "minAgeRestriction": null,
        "createdAt": "2024-01-29T09:17:06.754Z",
        "publicationDate": "2024-01-30T09:17:06.754Z",
        "availableResolutions": [
            "P144"
        ]
    }
    let myErrorsMessages:Object[] = []
    checkValid('title', req.body.title, 'string', 40)
    checkValid('author', req.body.author, 'string', 20)
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
            myErrorsMessages.push({
                message: 'error',
                field: name
            })
        }
    }

    let findVideo = db.videos.find(v => v.id === Number(req.params.id))
    if (!findVideo) {
        res.sendStatus(404)
    }

    if (myErrorsMessages.length > 0) {
        res.status(400).send({errorsMessages: myErrorsMessages})
    } else if (findVideo && isValid !== false) {
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