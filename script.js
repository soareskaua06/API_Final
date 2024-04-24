// User Form = Pega os dados do formulário e envia para o Banco de Dados
const userForm = document.getElementById('user-form')

// User List = Mostra os dados do Banco de Dados
const userList = document.getElementById('user-list')

function listUsers() {
    fetch('http://localhost:3000/usuarios')
        .then(response => response.json())
        .then(data => {
            userList.innerHTML = '';
            data.forEach(user => {
                const li = document.createElement('li');
                li.innerHTML = `ID: ${user.id} - Nome: ${user.nome} - Idade: ${user.idade} - Curso: ${user.curso}`;
                userList.appendChild(li);
            });
        })
        .catch(error => console.error('Erro:', error));
}



userForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevenção padrão de erros

    try {
        const userId = await getNextUserId(); // Obtém o próximo ID disponível
        const name = document.getElementById('name').value;
        const age = document.getElementById('age').value;
        const course = document.getElementById('course').value;

        // Enviando os dados para o servidor
        fetch('http://localhost:3000/usuarios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: userId,
                    nome: name,
                    idade: age,
                    curso: course
                }),
            })
            .then(response => response.json())
            .then(() => {
                listUsers();
                userForm.reset();
            })
            .catch(error => console.error('Erro:', error));
    } catch (error) {
        // Trata o erro ao obter o próximo ID disponível
        console.error('Erro ao obter o próximo ID:', error);
    }
});



const deleteUserForm = document.getElementById('delete-user-form');

deleteUserForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevenção padrão de envio do formulário

    const userId = document.getElementById('user-id').value;

    fetch(`http://localhost:3000/usuarios/${userId}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (response.ok) {
                alert('Usuário excluído com sucesso!');
                listUsers(); // Atualiza a lista de usuários após a exclusão
            } else {
                alert('Erro ao excluir usuário.');
            }
        })
        .catch(error => console.error('Erro:', error));
});

async function getNextUserId() {
    try {
        const response = await fetch('http://localhost:3000/usuarios');
        const data = await response.json();
        const numberOfUsers = data.length;
        const nextUserId = numberOfUsers + 1;
        return nextUserId;
    } catch (error) {
        console.error('Erro ao contar usuários:', error);
        throw error; // Você pode querer propagar o erro para que ele seja tratado fora dessa função.
    }
}

// Adicionando evento de envio para o formulário de edição
const editUserForm = document.getElementById('edit-user-form');

editUserForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevenção padrão de envio do formulário

    const userId = document.getElementById('edit-user-id').value;
    const newName = document.getElementById('edit-name').value;
    const newAge = document.getElementById('edit-age').value;
    const newCourse = document.getElementById('edit-course').value;

    // Enviando os dados atualizados para o servidor
    fetch(`http://localhost:3000/usuarios/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nome: newName,
                idade: newAge,
                curso: newCourse
            }),
        })
        .then(response => response.json())
        .then(() => {
            listUsers(); // Atualiza a lista de usuários após a edição
            editUserForm.reset(); // Limpa o formulário de edição
        })
        .catch(error => console.error('Erro:', error));
});



listUsers()