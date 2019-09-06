const rimraf = require('rimraf')
const glob = require('glob')
const fs = require('fs')
const { readFile, writeFile, mkdir } = fs.promises

exports.asyncReadFile = readFile

exports.asyncWriteFile = writeFile

exports.asyncMakeDirectory = mkdir

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
