const dados = require('./dados.json');
const express = require('express');
const fs = require('fs');
const cors = require('cors');

const server = express();
server.use(cors());
server.use(express.json());

server.listen(3001, () => {
    console.log("O servidor está funcional");
});

server.get('/', (req, res) => {
    return res.json({ mensagem: "Estou funcionando!" });
});

// Create da API
server.post('/usuarios', (req, res) => {
    const novoUsuario = req.body;

    if (!novoUsuario.nome || !novoUsuario.idade || !novoUsuario.curso) {
        return res.status(400).json({ mensagem: "Dados incompletos, tente novamente" });
    } else {
        novoUsuario.id = dados.Usuarios.length + 1;
        dados.Usuarios.push(novoUsuario);
        salvarDados(dados);

        return res.status(201).json({ mensagem: "Cadastro feito com sucesso!", usuario: novoUsuario });
    }
});

// Read da API
server.get('/usuarios', (req, res) => {
    return res.json(dados.Usuarios);
});

// Update da API
server.put('/usuarios/:id', (req, res) => {
    const usuarioId = parseInt(req.params.id);
    const atualizarUser = req.body;

    const indiceUsuario = dados.Usuarios.findIndex(u => u.id === usuarioId);

    if (indiceUsuario === -1) {
        return res.status(404).json({ mensagem: "Usuário não encontrado" });
    } else {
        dados.Usuarios[indiceUsuario] = { ...dados.Usuarios[indiceUsuario], ...atualizarUser };
        salvarDados(dados);

        return res.status(200).json({ mensagem: "Atualização feita com sucesso!", usuario: dados.Usuarios[indiceUsuario] });
    }
});

// Delete da API
server.delete('/usuarios/:id', (req, res) => {
    const usuarioId = parseInt(req.params.id);

    const indiceUsuario = dados.Usuarios.findIndex(u => u.id === usuarioId);

    if (indiceUsuario === -1) {
        return res.status(404).json({ mensagem: "Usuário não encontrado" });
    } else {
        dados.Usuarios.splice(indiceUsuario, 1);
        salvarDados(dados);

        return res.status(200).json({ mensagem: "Usuário excluído com sucesso!" });
    }
});

// Função que salva os dados
function salvarDados(dados) {
    fs.writeFileSync('./dados.json', JSON.stringify(dados, null, 2));
}
