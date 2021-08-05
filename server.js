import express from 'express'
import * as z from 'zod'


const app = express()


app.get('/', (req, res) => res.send('Hello World'))

app.listen(3000)