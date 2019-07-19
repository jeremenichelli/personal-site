const fs = require('fs')
const mkdirp = require('mkdirp')
const glob = require('glob')
const { promisify } = require('util')

exports.asyncReadFile = promisify(fs.readFile)
exports.asyncWriteFile = promisify(fs.writeFile)

exports.asyncMakeDirectory = (path, options) =>
  new Promise((res, rej) => {
    mkdirp(path, options, (err) => {
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
