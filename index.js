//configuração inicial
const express = require('express')
const app = express()
const cors = require('cors')

//configuração de banco
const mongoose = require('mongoose')
const Login = require('./model/login')
const Cadastro = require('./model/cadastro')

app.use(cors());
app.use(express.urlencoded({extended: true }));
//criação das rotas
app.use(express.json())

app.post('/login', async (req, res) => {
    const { email, senha } = req.body;
   
    try {
        const usuario = await Cadastro.findOne({email,senha});
        if (usuario){
            res.status(200).json({message: "Login efetuado com suuuuuuuuuucesso!"});
        } else {
            res.status(401).json({message: "Erro ao fazer login. Verificar suas credenciais"});
        }
    } catch (error) {
        res.status(500).json({ error: error.message})
    }
})

app.get('/login', async (req, res) => {
    try {
        const login = await Login.find()
        res.status(200).json(login)
    } catch (error) {
        res.status(500).json({ error: error })
    }

});

app.post('/cadastro', async (req, res) => {
    const {nome, cpf, telefone, celular, email, senha, confirmeSenha} = req.body;

    if (!nome || !cpf || !celular || !email || !senha || !confirmeSenha) {
        // Se algum campo obrigatório estiver ausente, retorne uma resposta com erro
        return res.status(400).json({ error: 'Todos os campos com "*" devem ser preenchidos.' });
    }

    // Verifica se as senhas coincidem
    if (senha !== confirmeSenha) {
        // Se as senhas não coincidirem, retorne uma resposta com erro
        return res.status(400).json({ error: 'As senhas não coincidem.' });
    }

    const cadastro = {
        nome, 
        cpf, 
        telefone, 
        celular, 
        email, 
        senha, 
        confirmeSenha,
    };
    try {
        await Cadastro.create(cadastro);
        res.status(201).json({ Message: 'Cadastro realizado com suuuuuuuuuucesso!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

app.post("/forgot-password", async (req, res) => {
    const { email } = req.body;
    try {
        const usuario = await Cadastro.findOne({ email });
        if (!usuario) {
            return res.status(404).json({ error: 'Usuário não encontrado' }); 
        }
        const token = gerarToken();
        enviarEmailRedefinicaoSenha(email, token);
        
        return res.status(200).json({message: 'E-mail de redefinição de senha enviado com sucesso.'});
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao processar solixitação de redefinição de senha'});
    }
});

app.post('/reset-password', async (req, res) => {
    const { token, novaSenha } = req.body;

    try {
        const usuario = await Cadastro.findOne({ token });
        if (!usuario) {
            return res.status(404).json({ error: 'Token inválido' });
        }
        usuario.senha = novaSenha;
        await usuario.save();

        return res.status(200).json({ message: 'Senha redefinida com sucesso.'});
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao redefinir senha' });
    }
});

    const lingerieSchema = new mongooseSchema({
        modelo: {
            type: String,
            required: true
        },
        tamanho: {
            type: String,
            required: true
        },
        cor: {
            type: String,
            required: true
        },
        preco: {
            type: Number,
            required: true
        }
    });

    const Lingerie = mongoose.model('lingerie', lingerieSchema);
    
    app.post|('/lingeries', async (req, res) => { 
        const { modelo, cor, tamanho, preco } = req.body;
        try {
            // Cria uma nova instância do modelo Lingerie com os dados recebidos na requisição
            const lingerie = new Lingerie({
                modelo,
                tamanho,
                cor,
                preco
            });
    
            // Salva a nova lingerie no banco de dados
            await lingerie.save();    
            res.status(201).json({ Message: 'Lingerie cadastrada com sucesso!' });
        } catch (error) {
            // Em caso de erro, retorna uma resposta com status 500 e o erro ocorrido
            res.status(500).json({ error: error.message });
        }
    });
    
    mongoose.connect('mongodb+srv://portohortensia1992:160215@teste.1yb8dry.mongodb.net/')
        .then(() => {
            console.log('Conectou')
            app.listen(3000)
    
        })
        .catch((err) => console.log(err))
