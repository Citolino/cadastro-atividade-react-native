import { MaterialIcons } from '@expo/vector-icons';
import {
  Alert, Text, TouchableOpacity,
  View, Keyboard, ScrollView, Image
} from 'react-native';
import { TextInput, Paragraph, Dialog, Portal, Appbar } from 'react-native-paper';
import { useState, useEffect } from 'react';
import {
  createTable,
  alteraTipoAtividade,
  excluiTipoAtividade,
  obtemTodosTiposAtividades,
  excluiTodosTipoAtividade,
  adicionaTipoAtividade,
  dropTable
} from '../services/dbTipoAtividade';
import {
  obtemTodasAtividades
} from '../services/dbAtividade';
import {useStatus} from '../hook/statusglobal'
import styles from './styles'
export function TipoAtividade() {
  const [id, setId] = useState("");
  const [tipoAtividade, setTipoAtividade] = useState("");
  const [tipoAtividadeList, setTipoAtividadeList] = useState([]);
  const [recarregaTela, setRecarregaTela] = useState(true);
  const [criarTabela, setCriarTabela] = useState(false);
  const [AtividadeList, setAtividadeList] = useState([]);
  const {recarregaTelaGlobal, setRecarregaTelaGlobal} = useStatus(false);

  async function processamentoUseEffect() {

    if (!criarTabela) {
      setCriarTabela(true);
      await createTable();
    }
    if (recarregaTela) {
      await carregaDados();
    }
  }
  useEffect(
    () => {
      processamentoUseEffect();
    }, [recarregaTela]);

  async function carregaDados() {
    try {
      let tipoAtividade = await obtemTodosTiposAtividades();
      setTipoAtividadeList(tipoAtividade);
      setRecarregaTela(false);
      console.log(tipoAtividade);
    } catch (e) {
      Alert.alert(e.toString());
    }
  }
  function limparCampos() {
    setId("");
    setTipoAtividade("");

  }
  async function salvar() {

    let novoRegistro = false;
    let identificador = id;
    if (identificador == undefined || identificador == null || identificador == "") {

      novoRegistro = true;
    }
    try {
      let objTipoAtividade = {
        id: identificador,
        tipoAtividade: tipoAtividade
      }

      if (tipoAtividade == '' || tipoAtividade == null || tipoAtividade == undefined){

        Alert.alert('Erro', 'Tipo atividade deve ser inserido!');
        return;
      }
      const teste = tipoAtividadeList.find(atividade => atividade.tipoAtividade.toString().toUpperCase() == tipoAtividade.toString().toUpperCase());
      if (teste != null){
        Alert.alert('Erro', 'Tipo atividade ja cadastrada!');
        return;
      }

      if (novoRegistro) {
        let resposta = (await adicionaTipoAtividade(objTipoAtividade));

        if (resposta)
          Alert.alert('Sucesso', 'Tipo atividade adicionado com sucesso!');
        else
          Alert.alert('Falha ao inserir um novo tipo atividadee!');
      }
      else {
        let resposta = await alteraTipoAtividade(objTipoAtividade);
        if (resposta)
          Alert.alert('Sucesso', 'Alterado com sucesso!');
        else
          Alert.alert('Falha ao alterar o tipo atividade!');
      }

      Keyboard.dismiss();
      limparCampos();
      setRecarregaTela(true);
      setRecarregaTelaGlobal(!recarregaTelaGlobal);
    }
    catch (error) {
      Alert.alert("Erro ao salvar: " + error.toString());
    }

  }

  function carregar(identificador) {
    try {

      const tipoAtividade = tipoAtividadeList.find(tipoAtividade => tipoAtividade.id == identificador);

      if (tipoAtividade != null) {
        setId(tipoAtividade.id);
        setTipoAtividade(tipoAtividade.tipoAtividade);

      }
      else {
        limparCampos();
        Alert.alert("Não existe nenhuma tipo atividade salvo com esse código.");
      }

    }
    catch (error) {
      Alert.alert("Erro ao recuperar tipo atividade: " + error.toString());
      console.log(error.toString())
    }

  }

  function deletarTipoAtividade(identificador) {
    Alert.alert('Atenção', 'Confirma a remoção do tipo de atividade?',
      [
        {
          text: 'Sim',
          onPress: () => efetivadeletarTipoAtividade(identificador),
        },
        {
          text: 'Não',
          style: 'cancel',
        }
      ]);
  }
  async function efetivadeletarTipoAtividade(identificador) {
    try {
      let atividadeList = await obtemTodasAtividades();
      const teste = atividadeList.find(atividade => atividade.idTipo.toString().toUpperCase() == identificador);
      if (teste != null){
        Alert.alert('Erro', 'Tipo atividade cadastrada para uma atividade!');
        return;
      }
     
      await excluiTipoAtividade(identificador);
      Keyboard.dismiss();
      Alert.alert('Tipo Atividade apagado com sucesso!!!', 'você deletou o tipo de atividade selecionado!');
      limparCampos();
      setRecarregaTela(true);
      setRecarregaTelaGlobal(!recarregaTelaGlobal);
    } catch (e) {
      Alert.alert(e);
    }
  }

  function apagarTodos() {
    if (Alert.alert('Muita atenção!!!', 'Confirma a exclusão de todos os tipos de atividades?',
      [
        {
          text: 'Bora la!',
          onPress: () => {
            efetivaExclusao();
          }
        },
        {
          text: 'Não!!!',
          style: 'cancel'
        }
      ]));
  }

  async function efetivaExclusao() {
    try {

      let atividadeList = await obtemTodasAtividades();
     
      let tipoatividadeList = await obtemTodosTiposAtividades();

      for (let i = 0; i < tipoatividadeList.length; i++) {
        
        const teste = atividadeList.find(atividade => atividade.idTipo.toString().toUpperCase() ==  tipoatividadeList[i].id);
        if (teste != null){
          Alert.alert('Erro', `Tipo atividade cadastrada para uma atividade! Tipo atividade : ${tipoatividadeList[i].tipoAtividade}`);
          return;
        }
      }
      
      await excluiTodosTipoAtividade();
      Alert.alert('Já era apagou foi é tudo...', 'Você apagou todos os tipos de atividades!');
      setRecarregaTela(!recarregaTela);
      setRecarregaTelaGlobal(!recarregaTelaGlobal);
    }
    catch (e) {
      Alert.alert(e);
    }
  }
  return (

    <ScrollView>
      <View style={styles.campo}>
        <TextInput

          label="Tipo atividade"
          value={tipoAtividade}
          mode="outlined"
          placeholder="Digite o típo da atividade"
          onChangeText={text => setTipoAtividade(text)}
        />
      </View>
      <View style={styles.areaBotoes}>
        <TouchableOpacity style={styles.botaoSalvar}
          onPress={() => { salvar() }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold' }}>Salvar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botaoCarregar}
          onPress={() => { apagarTodos() }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold' }}>Apagar Todos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botaoLimpar}
          onPress={() => { limparCampos() }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold' }}>Limpar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ paddingTop: 10 }}>
        {
          tipoAtividadeList.map((tipoAtividade, index) => (
            <View style={styles.mainCardView} key={index.toString()}>
              <View>
                <Text style={{ fontSize: 15, fontWeight: 'bold' }} > Tipo atividade : {tipoAtividade.tipoAtividade}</Text>

              </View>
              <View>
                <TouchableOpacity onPress={() => carregar(tipoAtividade.id)}>
                  <MaterialIcons name="edit" size={35} color="black" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => deletarTipoAtividade(tipoAtividade.id)}>
                  <MaterialIcons name="delete-forever" size={35} color="black" />
                </TouchableOpacity>

              </View>

            </View>
          ))
        }
      </ScrollView>

    </ScrollView>




  );
}


