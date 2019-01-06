var express = require('express')
var app = express()
 
// SHOW LIST OF USERS
app.get('/', function(req, res, next) {
    req.getConnection(function(error, conn) {
        conn.query('SELECT * FROM pacientes ORDER BY id DESC',function(err, rows, fields) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                res.render('paciente/list', {
                    title: 'Lista de Pacientes', 
                    data: ''
                })
            } else {
                // render to views/user/list.ejs template file
                res.render('paciente/list', {
                    title: 'Lista de Pacientes', 
                    data: rows
                })

            }
        })
    })
})


// SHOW ADD USER FORM
app.get('/add', function(req, res, next){    
    // render to views/user/add.ejs
    res.render('paciente/add', {
        title: 'Adiciona novo usuário',
        nome_crianca: '',
        nome_pais: '',
        sexo: ''        
    })
})
 
// ADD NEW USER POST ACTION
app.post('/add', function(req, res, next){    
    req.assert('nome_crianca', 'Name childe is required').notEmpty()           //Validate name
    req.assert('nome_pais', 'parents is required').notEmpty()             //Validate age
    req.assert('sexo', 'gender is required').notEmpty()  //Validate email
 
    var errors = req.validationErrors()
    
    if( !errors ) {   //No errors were found.  Passed Validation!
        
        /********************************************
         * Express-validator module
         
        req.body.comment = 'a <span>comment</span>';
        req.body.username = '   a user    ';
 
        req.sanitize('comment').escape(); // returns 'a &lt;span&gt;comment&lt;/span&gt;'
        req.sanitize('username').trim(); // returns 'a user'
        ********************************************/
        var user = {
            nome_crianca: req.sanitize('nome_crianca').escape().trim(),
            nome_pais: req.sanitize('nome_pais').escape().trim(),
            sexo: req.sanitize('sexo').escape().trim()
        }
        
        req.getConnection(function(error, conn) {
            conn.query('INSERT INTO pacientes SET ?', user, function(err, result) {
                //if(err) throw err
                if (err) {
                    req.flash('error', err)
                    
                    // render to views/user/add.ejs
                    res.render('paciente/add', {
                        title: 'Adiciona novo usuário',
                        nome_crianca: '',
                        nome_pais: '',
                        sexo: ''        
                    })
                } else {                
                    req.flash('success', 'Data added successfully!')
                    
                    // render to views/user/add.ejs
                    res.render('paciente/add', {
                        title: 'Adiciona novo usuário',
                        nome_crianca: '',
                        nome_pais: '',
                        sexo: ''        
                    })
                }
            })
        })
    }
    else {   //Display errors to user
        var error_msg = ''
        errors.forEach(function(error) {
            error_msg += error.msg + '<br>'
        })                
        req.flash('error', error_msg)        
        
        /**
         * Using req.body.name 
         * because req.param('name') is deprecated
         */ 
         res.render('paciente/add', {
            title: 'Adiciona novo usuário',
            nome_crianca: '',
            nome_pais: '',
            sexo: ''        
        })
    }
})




// DELETE USER
app.delete('/delete/(:id)', function(req, res, next) {
    var user = { id: req.params.id }
    
    req.getConnection(function(error, conn) {
        conn.query('DELETE FROM pacientes WHERE id = ' + req.params.id, user, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                // redirect to users list page
                res.redirect('/pacientes')
            } else {
                req.flash('success', 'User deleted successfully! id = ' + req.params.id)
                // redirect to users list page
                res.redirect('/pacientes')
            }
        })
    })
})


// SHOW EDIT USER FORM
app.get('/edit/(:id)', function(req, res, next){
    req.getConnection(function(error, conn) {
        conn.query('SELECT * FROM pacientes WHERE id = ' + req.params.id, function(err, rows, fields) {
            if(err) throw err
            
            // if user not found
            if (rows.length <= 0) {
                req.flash('error', 'Paciente not found with id = ' + req.params.id)
                res.redirect('/pacientes')
            }
            else { // if user found
                // render to views/user/edit.ejs template file
                res.render('paciente/edit', {
                    title: 'Edita Paciente', 
                    //data: rows[0],
                    id: rows[0].id,
                    nome_crianca: rows[0].nome_crianca,
                    nome_pais: rows[0].nome_pais,
                    sexo: rows[0].sexo                   
                })
            }            
        })
    })
})


// EDIT USER POST ACTION
app.put('/edit/(:id)', function(req, res, next) {
    req.assert('nome_crianca', 'Name childe is required').notEmpty()           //Validate name
    req.assert('nome_pais', 'parents is required').notEmpty()             //Validate age
    req.assert('sexo', 'gender is required').notEmpty()  //Validate email
 
    var errors = req.validationErrors()
    
    if( !errors ) {   //No errors were found.  Passed Validation!
        
        /********************************************
         * Express-validator module
         
        req.body.comment = 'a <span>comment</span>';
        req.body.username = '   a user    ';
 
        req.sanitize('comment').escape(); // returns 'a &lt;span&gt;comment&lt;/span&gt;'
        req.sanitize('username').trim(); // returns 'a user'
        ********************************************/
        var user = {
            nome_crianca: req.sanitize('nome_crianca').escape().trim(),
            nome_pais: req.sanitize('nome_pais').escape().trim(),
            sexo: req.sanitize('sexo').escape().trim()
        }
        
        req.getConnection(function(error, conn) {
            conn.query('UPDATE pacientes SET ? WHERE id = ' + req.params.id, user, function(err, result) {
                //if(err) throw err
                if (err) {
                    req.flash('error', err)
                    
                    // render to views/user/add.ejs
                    res.render('paciente/edit', {
                        title: 'Edita Paciente',
                        id: req.params.id,
                        nome_crianca: req.body.nome_crianca,
                        nome_pais: req.body.nome_pais,
                        sexo: req.body.sexo
                    })
                } else {
                    req.flash('success', 'Data updated successfully!')
                    
                    // render to views/user/add.ejs
                    res.render('paciente/edit', {
                        title: 'Edita Paciente',
                        id: req.params.id,
                        nome_crianca: req.body.nome_crianca,
                        nome_pais: req.body.nome_pais,
                        sexo: req.body.sexo
                    })
                }
            })
        })
    }
    else {   //Display errors to user
        var error_msg = ''
        errors.forEach(function(error) {
            error_msg += error.msg + '<br>'
        })
        req.flash('error', error_msg)
        
        /**
         * Using req.body.name 
         * because req.param('name') is deprecated
         */ 
         res.render('paciente/edit', {
            title: 'Edita Paciente',
            id: req.params.id,
            nome_crianca: req.body.nome_crianca,
            nome_pais: req.body.nome_pais,
            sexo: req.body.sexo
        })
    }
})
 

 

module.exports = app