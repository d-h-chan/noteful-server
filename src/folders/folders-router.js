const express = require('express')
const path = require('path')
const xss = require('xss')
const FoldersService = require('./folders-service')

const foldersRouter = express.Router()
const jsonParser = express.json()

const serializeFolder = folder => ({
  id: folder.id,
  folder: xss(folder.name),
})

foldersRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    FoldersService.getAllFolders(knexInstance)
      .then(articles => {
        res.json(articles.map(serializeFolder))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { name } = req.body
    const newFolder = { name }

    for (const [key, value] of Object.entries(newFolder))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })
    
    FoldersService.insertFolder(
      req.app.get('db'),
      newFolder
    )
      .then(folder => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${folder.id}`))
          .json(serializeFolder(folder))
      })
      .catch(next)
  })

foldersRouter
  .route('/:article_id')
  .all((req, res, next) => {
    FoldersService.getById(
      req.app.get('db'),
      req.params.article_id
    )
      .then(article => {
        if (!article) {
          return res.status(404).json({
            error: { message: `Article doesn't exist` }
          })
        }
        res.article = article
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeFolder(res.article))
  })
  .delete((req, res, next) => {
    FoldersService.deleteArticle(
      req.app.get('db'),
      req.params.article_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = foldersRouter