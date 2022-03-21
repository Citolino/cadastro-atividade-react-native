import * as SQLite from 'expo-sqlite';


export function getDbConnection() {
    const cx = SQLite.openDatabase('dbTipoAtividade.db');
    return cx;
}

export async function createTable() {
    return new Promise((resolve, reject) => {
        const query = `CREATE TABLE IF NOT EXISTS tb_tipo_atividade
        (
            id integer primary key AUTOINCREMENT,
            tipoAtividade text not null
                
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
        const query = `DROP TABLE tb_tipo_atividade`;

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

export function obtemTodosTiposAtividades() {

    return new Promise((resolve, reject) => {

        let dbCx = getDbConnection();
        dbCx.transaction(tx => {
            let query = 'select * from tb_tipo_atividade';
            tx.executeSql(query, [],
                (tx, registros) => {

                    var retorno = []

                    for (let n = 0; n < registros.rows.length; n++) {
                        let obj = {
                            id: registros.rows.item(n).id,
                            tipoAtividade: registros.rows.item(n).tipoAtividade
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

export function adicionaTipoAtividade(tipoAtividade) {

    return new Promise((resolve, reject) => {
        let query = 'insert into tb_tipo_atividade ( tipoAtividade ) values (?)';
        let dbCx = getDbConnection();

        dbCx.transaction(tx => {
            tx.executeSql(query, [ tipoAtividade.tipoAtividade],
                
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


export function alteraTipoAtividade(tipoAtividade) {
    
    return new Promise((resolve, reject) => {
        let query = 'update tb_tipo_atividade set tipoAtividade=? where id=?';
        let dbCx = getDbConnection();

        dbCx.transaction(tx => {
            tx.executeSql(query, [tipoAtividade.tipoAtividade, tipoAtividade.id],
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



export function excluiTipoAtividade(id) {
    return new Promise((resolve, reject) => {
        let query = 'delete from tb_tipo_atividade where id=?';
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


export function excluiTodosTipoAtividade() {
   
    return new Promise((resolve, reject) => {
        let query = 'delete from tb_tipo_atividade';
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
