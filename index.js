const dados = require('./dados.json')
const express = require('express')
const fs = require('fs')
const cors = require('cors')
const path = require('path');
const swaggerUi = require('swagger-ui-express');    
const swaggerDocument = require('./swagger.json');

const server = express()
server.use(cors())
server.use(express.json())

server.listen(3000, () => {
    console.log("O servidor está funcional");
})

server.get('/', (req, res) => {
    return res.json({ mensagem: "Estou funcionando!" })
})

// CRUD DA API

// Create da API
server.post('/usuarios', (req, res) => {
    const novoUsuario = req.body

    if (!novoUsuario.nome || !novoUsuario.idade || !novoUsuario.curso) {
        return res.status(400).json({ mensagem: "Dados incompletos, tente novamente" })
    } else {
        dados.Usuarios.push(novoUsuario)
        salvarDados(dados)

        return res.status(201).json({ mensagem: "Dados completos, cadastro feito com sucesso!" })
    }
})

// Read da API
server.get('/usuarios', (req, res) => {
    return res.json(dados.Usuarios)
})

// Update da API
server.put('/usuarios/:id', (req, res) => {
    const usuarioId = parseInt(req.params.id)
    const atualizarUser = req.body

    const indiceUsuario = dados.Usuarios.findIndex(u => u.id === usuarioId)

    if (indiceUsuario === -1) {
        return res.status(404).json({ mensagem: "Usuário não encontrado" })
    } else {
        dados.Usuarios[indiceUsuario].nome = atualizarUser.nome || dados.Usuarios[indiceUsuario].nome
        
        dados.Usuarios[indiceUsuario].idade = atualizarUser.idade || dados.Usuarios[indiceUsuario].idade

        dados.Usuarios[indiceUsuario].curso = atualizarUser.curso || dados.Usuarios[indiceUsuario].curso

        salvarDados(dados)

        return res.status(201).json({ mensagem: "Dados completos, atualização feita com sucesso!" })
    }
})


//Delete da API
server.delete('/usuarios/:id', (req, res) => {
    const id = parseInt(req.params.id)

    // filtrar os usuarios, removendo pelo id correspondente

    dados.Usuarios = dados.Usuarios.filter(u => u.id !== id)

    salvarDados(dados)

    return res.status(200).json({ mensagem: "Usuario excluido com sucesso!" })
})

// Função que salva os dados
function salvarDados() {
    fs.writeFileSync(__dirname + '/dados.json', JSON.stringify(dados, null, 2))
}