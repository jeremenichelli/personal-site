const rimraf = require('rimraf')
const glob = require('glob')
const fs = require('fs')
const { readFile, writeFile } = fs.promises
const mkdirp = require('mkdirp')
const ENVIRONMENT = process.env.NODE_ENV || 'production'

exports.ENVIRONMENT = ENVIRONMENT

exports.asyncReadFile = readFile

exports.asyncWriteFile = writeFile

exports.asyncMakeDirectory = (path, options) =>
  new Promise((res, rej) => {
    mkdirp(path, options, (err) => {
      if (err) rej(err)
      res()
    })
  })

exports.asyncRimraf = (path) =>
  new Promise((res, rej) => {
    rimraf(path, (err) => {
      if (err) return rej(err)
      res()
    })
  })

exports.asyncGlob = (pattern, options) =>
  new Promise((res, rej) => {
    glob(pattern, options, (err, files) => {
      if (err) return rej(err)
      res(files)
    })
  })
