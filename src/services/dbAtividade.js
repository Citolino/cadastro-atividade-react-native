import * as SQLite from 'expo-sqlite';


export function getDbConnection() {
    const cx = SQLite.openDatabase('dbTipoAtividade.db');
    return cx;
}
export async function pragmaCreate() {
    return new Promise((resolve, reject) => {
        const query = 'PRAGMA foreign_keys = ON';

        let dbCx = getDbConnection();
        dbCx.transaction(
            (tx) => tx.executeSql(query, [],
                (tx, result) => resolve(true),
            ),
            error => {
                console.log(error);
                resolve(false);
            }
        );
    });
};
export async function createTable() {
    pragmaCreate();
    return new Promise((resolve, reject) => {
        const query = `CREATE TABLE IF NOT EXISTS tb_atividade
        (
            id integer primary key AUTOINCREMENT,
            tipoAtividade text not null,
            descricaoAtividade text not null,
            localAtividade text not null,
            dataEhora decimal not null,
            horaEntrega text not null,
            statusAtividade text not null,
            FOREIGN KEY (tipoAtividade)
                REFERENCES tb_tipo_atividade (tipoAtividade)
                
        )`;

        let dbCx = getDbConnection();
        dbCx.transaction(
            (tx) => tx.executeSql(query, [],
                (tx, resultado) => resolve(true)
            )
        ,
            error => {
                console.log(error);
                resolve(false);
            }
        );
        
    });
};


export async function dropTable() {
    return new Promise((resolve, reject) => {
        const query = `DROP TABLE tb_atividade`;

        let dbCx = getDbConnection();
        dbCx.transaction(
            (tx) => tx.executeSql(query, [],
                (tx, resultado) => resolve(true)
            )
        ,
            error => {
                console.log(error);
                resolve(false);
            }
        );
    });
};

export function obtemTodasAtividades() {

    return new Promise((resolve, reject) => {

        let dbCx = getDbConnection();
        dbCx.transaction(tx => {
            let query = `select ta.id,tta.tipoAtividade,ta.descricaoAtividade,ta.localAtividade,ta.dataEhora,ta.horaEntrega,ta.statusAtividade,tta.id as idTipo 
                         from tb_atividade ta inner join tb_tipo_atividade tta on ta.tipoAtividade = tta.id`;
            tx.executeSql(query, [],
                (tx, registros) => {

                    var retorno = []

                    for (let n = 0; n < registros.rows.length; n++) {
                        let obj = {
                            id: registros.rows.item(n).id,
                            tipoAtividade: registros.rows.item(n).tipoAtividade,
                            descricaoAtividade: registros.rows.item(n).descricaoAtividade,
                            localAtividade: registros.rows.item(n).localAtividade,
                            dataEhora: registros.rows.item(n).dataEhora,
                            horaEntrega: registros.rows.item(n).horaEntrega,
                            statusAtividade: registros.rows.item(n).statusAtividade,
                            idTipo: registros.rows.item(n).idTipo
                        }
                        retorno.push(obj);
                    }
                    resolve(retorno);
                })
        },
            error => {
                console.log(error);
                resolve([]);
            }
        )
    }
    );
}

export function adicionaAtividade(atividade) {

    return new Promise((resolve, reject) => {
        let query = 'insert into tb_atividade ( tipoAtividade,descricaoAtividade,localAtividade,dataEhora,horaEntrega,statusAtividade ) values (?,?,?,?,?,?)';
        let dbCx = getDbConnection();

        dbCx.transaction(tx => {
            tx.executeSql(query, [ atividade.tipoAtividade,atividade.descricaoAtividade,atividade.localAtividade,atividade.dataEhora,atividade.horaEntrega,atividade.statusAtividade],
                
                (tx, resultado) => {
                    resolve(resultado.rowsAffected > 0);
                })
        },
            error => {
                console.log(error);
                resolve(false);
            }
        )
    }
    );
}


export function alteraAtividade(atividade) {
    
    return new Promise((resolve, reject) => {
        let query = 'update tb_atividade set tipoAtividade=?, descricaoAtividade=?,localAtividade=?,dataEhora=?,horaEntrega=?,statusAtividade=? where id=?';
        let dbCx = getDbConnection();

        dbCx.transaction(tx => {
            tx.executeSql(query, [ atividade.tipoAtividade,atividade.descricaoAtividade,atividade.localAtividade,atividade.dataEhora,atividade.horaEntrega,atividade.statusAtividade, atividade.id],
                (tx, resultado) => {
                    resolve(resultado.rowsAffected > 0);
                })
        },
            error => {
                console.log(error);
                resolve(false);
            }
        )
    }
    );
}



export function excluiAtividade(id) {
    console.log(id);
    return new Promise((resolve, reject) => {
        let query = 'delete from tb_atividade where id=?';
        let dbCx = getDbConnection();

        dbCx.transaction(tx => {
            tx.executeSql(query, [id],
                (tx, resultado) => {
                    resolve(resultado.rowsAffected > 0);
                })
        },
            error => {
                console.log(error);
                resolve(false);
            }
        )
    }
    );
}


export function excluiTodasAtividade() {
   
    return new Promise((resolve, reject) => {
        let query = 'delete from tb_atividade';
        let dbCx = getDbConnection();
        dbCx.transaction(tx => {
            tx.executeSql(query, [],
                (tx, resultado) => resolve(resultado.rowsAffected > 0)
            );
        },
            error => {
                console.log(error);
                resolve(false);
            }
        );
    }
    );
}


export function alterarStatus(identificador,status) {
    
    return new Promise((resolve, reject) => {
        let query = 'update tb_atividade set statusAtividade=? where id=?';
        let dbCx = getDbConnection();

        dbCx.transaction(tx => {
            tx.executeSql(query, [ status,identificador],
                (tx, resultado) => {
                    resolve(resultado.rowsAffected > 0);
                })
        },
            error => {
                console.log(error);
                resolve(false);
            }
        )
    }
    );
}
