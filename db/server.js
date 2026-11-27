/*
  作者：杨阳
  学号：24002120323
  建立时间：2026-11-26
  使用大模型：DeepSeek-V4.1-Flash
  功能名称：诗词数据接口服务
*/

const express = require('express')
const fs = require('fs')
const path = require('path')
const app = express()
const port = 3004

// 允许跨域访问，页面从其他端口或 file:// 打开时也能取到数据
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  next()
})

app.get('/api/poems', (req, res) => {
  const dbPath = path.join(__dirname, 'db.json')
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if(err) return res.status(500).json({err:'读取失败'})
    const json = JSON.parse(data)
    res.json(json.poems)
  })
})

app.get('/api/authors', (req, res) => {
  const dbPath = path.join(__dirname, 'db.json')
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if(err) return res.status(500).json({err:'读取失败'})
    const json = JSON.parse(data)
    res.json(json.authors)
  })
})

app.listen(port, ()=>{
  console.log(`数据服务器已启动：http://localhost:3004/api/poems`)
})

