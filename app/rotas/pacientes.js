module.exports = function (app) {

    app.get('/pacientes', function (req, resp) {

        let conexao = new app.infra.ConnectionFactory().getConexao();
        let pacientes = new app.repositorio.PacienteRepository(conexao);

        pacientes.todos(function (erros, resultado) {

            if (erros) {
                console.log(erros);
            }
            resp.render('pacientes/listagem', {lista: resultado });
        });
        conexao.end();
    });

    /* ---------------------------------------------------------------- */
    app.get('/pacientes/form', function (req, resp) {
        resp.render('pacientes/form-cadastro', {errosValidacao: {},  paciente: {} });
    });


    app.post('/pacientes', function (req, resp) {

        let paciente = req.body;
        console.log(paciente);

        req.assert('nome', 'Nome do paciente é obrigatório.').notEmpty();
        req.assert('idade', 'Idade do paciente é obrigatório.').notEmpty();
        req.assert('altura', 'alutra no Formato inválido').isFloat();
        //req.assert('dataCadastro', 'Data inválida').isDate();

        let erros = req.validationErrors();

        if (erros) {
            resp.render('pacientes/form-cadastro', { errosValidacao: erros, paciente: paciente });
            return;
        }


        let conexao = new app.infra.ConnectionFactory().getConexao();
        let pacientes = new app.repositorio.PacienteRepository(conexao);

        pacientes.salva(paciente, function (erros, resultados) {
           //resp.render('pacientes/listagem' );   
           resp.redirect('/pacientes');
        });

        conexao.end();

    });

    app.post('/pacientes/remove/(:id)', function (req, resp) {
        let paciente = {
            id: req.params.id
        }

        let conexao = new app.infra.ConnectionFactory().getConexao();
        let pacientes = new app.repositorio.PacienteRepository(conexao);

        pacientes.remove(paciente, function (erros, resultados) {
            resp.redirect('/pacientes');
        });
    });


    app.get('/paciente/edita/(:id)', function (req, resp) {
        

        let conexao = new app.infra.ConnectionFactory().getConexao();
        let pacientes = new app.repositorio.PacienteRepository(conexao);

        pacientes.porId(req.params.id, function (erros, resultado) {
            if (erros ) {
                console.log(erros);
            }
            resp.render('pacientes/form-cadastro', {errosValidacao: erros,  
                                                    paciente: {
                                                        id: resultado[0].id,
                                                        nome: resultado[0].nome,
                                                        idade: resultado[0].idade,
                                                        altura: resultado[0].altura,
                                                        dataCadastro: resultado[0].dataCadastro } 
            });
            console.log(resultado);
        });
        conexao.end();
    });


}