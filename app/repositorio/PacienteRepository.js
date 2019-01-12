 
class PacienteRepository {
    
    constructor(conexao) {
       this._conexao = conexao;
    }

    porId(id, callback ) {
        this._conexao.query(`select * from paciente where id = ${id}`, callback);
    }


    todos(callback ) {
      this._conexao.query('select * from paciente', callback);
    }

   
    salva(paciente, callback) {
        console.log('ID ' + paciente.id);

        if ( (paciente.hasOwnProperty('id')) && (paciente.id > 0) ) {
               this._conexao.query('update paciente set ? where id = ' + paciente.id, paciente, callback);
               console.log('executou update');

        } else {
            this._conexao.query('insert into paciente set ?', paciente, callback);
            console.log('executou insert');

        }    
    }

    remove(paciente, callback) {
        this._conexao.query('delete from paciente where id = ' + paciente.id, callback);
    }

} 

module.exports = () => { return PacienteRepository };