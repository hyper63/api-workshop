import express from 'express'
import * as z from 'zod'
import swaggerUI from 'swagger-ui-express'
import YAML from 'yamljs'

const app = express()
const swaggerSpec = YAML.load('./openapi-example.yml')

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec))
app.get('/', (req, res) => res.send('Hello World'))


export default app