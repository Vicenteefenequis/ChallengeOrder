const express = require('express')
const userJson = require('../users-data.json')

const fakeDb = userJson

const app = express()
app.use(express.json())

const PORT = 3333

app.listen(PORT,() => {
    console.log(`Server Starter on Port ${PORT}`)
})

const validator = new Validator()

app.post('/candidates',validator.userInput, validator.userExists,(request,response) => {
    const userRepository = new UserRepository()
    userRepository.create(request.body)
    
    return response.status(201).json()
})

app.get('/candidates/search',validator.searchTags,(request,response) => {
    const userRepository = new UserRepository()
    const tags = request.query.tags
    
    try{ 
        const usersFound = userRepository.searchByTag(tags)
        return response.status(200).json(usersFound)
    }catch(error) {
        return response.status(404).json({message: error.message})
    }
})

class UserRepository { 
    create(user) {
        fakeDb.push(user)
    }
    
    searchByTag(tags){
        const users = []
        
        fakeDb.forEach(user => user.tags.map(tag => {
            if(tags.includes(tag)){
                users.push(user)
            }
        }))
        
        const noRepeatUsers = [...new Set(users)]
        
        noRepeatUsers.sort(sortTagsOrder(tags))
        
        if(!noRepeatUsers.length){
            throw new Error('Nenhum usuario corresponde a busca')
        }
        
        return noRepeatUsers
    }
}

class Validator {
    searchTags(request,response,next){
        if(!request.query.tags){
            return response.status(400).json({message: 'Parametro de busca de tags obrigatorio'})
        }
        
        request.query.tags = request.query.tags.split(',')
        
        next()
    }
    
    userExists(request,response,next){
        const {id} = request.body
        
        const userExists = fakeDb.find(user => user.id === id)
        
        if(userExists){
            return response.status(403).json({message: 'Usario ja existe'})
        }
        
        next()
    }
    
    userInput(request,response,next){
        if(!request.body){
            return response.status(400).json({message: 'Corpo da requisicao vazio'})
        }
        
        const requiredFields = ['id','name']
        const recievedFields = Object.keys(request.body)
        
        requiredFields.forEach((field) => {
            if(!recievedFields.includes(field)){
                return response.status(400).json({message : `Campo ${field} obrigatorio`})
            }
        })
        
        try {
            const tags = this.validatorTagsInput(request.body.tags)
            request.body.tags = tags
        }catch(error){
            response.status(400).json({message: error.message})
        }
        
        next()
    }
    
    tagsInput(tags){
        if(!tags.length){
            throw new Error('Campo de Tags Obrigatorio')
        }
        
        if(tags.length > 40){
            throw new Error('Campo de tag muito grande')
        }
        const tagFormat = new RegExp(/[a-zA-Z0-9-]+/gm) 
        const tagsNoRepeat = []
        
        tags.forEach(tag => {
            const matchTag = tag.replace(tagFormat,"")
            
            if(!!matchTag) throw new Error('Tag Invalida')
            
            if(!tagsNoRepeat.includes(tag)) {
                tagsNoRepeat.push(tag)
            }
        })
        
        return tagsNoRepeat
    }
}

function sortTagsOrder(tags){
    return (a,b) => {
        let countA = 0
        let countB = 0
        tags.forEach(tag => {
            if(a.tags.includes(tag)) countA++
            if(b.tags.includes(tag)) countB++
        })
        return countB - countA
    }
}