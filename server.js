import express from 'express'
import jsonServer from 'json-server'
import dotenv from 'dotenv'
import db from './quran.json' assert {type: "json"};
// assert {type: "json"}
import path, {dirname} from 'path'
import {fileURLToPath} from 'url'
import fs from 'fs'
import bodyParser from 'body-parser'

dotenv.config()

const server = jsonServer.create()
const router = jsonServer.router('quran.json')
const middlewares = jsonServer.defaults()
const port = process.env.PORT || 7777
const baseUrl = process.env.BASEURL
const __dirname = dirname(fileURLToPath(import.meta.url))


server.use(middlewares)
server.use(bodyParser.json())
server.use(bodyParser.urlencoded({
	extended: true
}))

server.get('/home', (req, res) => {
	res.json({
		message: 'Welcome to AlQuran Indo',
		api: {
			surah: '/quran/:number',
			ayat: '/surah/:number/:ayat'
		}
	})
})

server.get('/quran/:number', (req, res) => {
	let number = req.params.number
	let quran = db.data.map(d => d)
	let find = quran.find(d => d.number == number)
	
	res.json({
		message: `Surah number ${number}`,
		data: find
	})
})

server.get('/surah/:number/:ayat', (req, res) => {
	let number = req.params.number 
	let ayat = req.params.ayat
	
	fs.readFile('./quran.json', 'utf-8', (err, data) => {
		const db = JSON.parse(data)
		let quran = db.data.map(d => d)
		let finding = quran.find(d => d.number == number).verses.map(d => d)
		let verse = finding.find(d => d.number.inSurah == ayat)

		if(err){
			res.json({
				message: `Error query data : ${err}`
			}).status(404)
		}else{
			res.json({
				message: `Surah number ${number} / Ayat ${ayat}`,
				data: verse
			}).status(200)
		}
	})

})

server.get('/list-surah', (req, res) => {
	fs.readFile('./quran.json', 'utf-8', (err, data) => {
		const db = JSON.parse(data)
		let list_surah = []
		db.data.map(d => {
			console.log(d)
			list_surah.push({number: d.number, list: d.name})
		})

		
		if(err){
			res.json({
				message: `Error query data : ${err}`
			}).status(404)
		}else{
			res.json({
				message: `Fetch list surah`,
				data: list_surah
			}).status(200)
		}
	})
})

server.use(router)

server.listen(port, () => {
	console.log(`Server berjalan di port : ${port}`)
})