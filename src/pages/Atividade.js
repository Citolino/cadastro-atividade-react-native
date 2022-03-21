import { MaterialIcons } from '@expo/vector-icons';
import {
  Alert, Text, TouchableOpacity,
  View, Keyboard, ScrollView, Image
} from 'react-native';
import { TextInput, Paragraph, Dialog, Portal, Appbar } from 'react-native-paper';
import { useState, useEffect } from 'react';
import {
  createTable,
  alteraAtividade,
  excluiAtividade,
  adicionaAtividade,
  excluiTodasAtividade,
  obtemTodasAtividades,
  dropTable
} from '../services/dbAtividade';
import { TextInputMask } from 'react-native-masked-text'
import {
  obtemTodosTiposAtividades
} from '../services/dbTipoAtividade';

import styles from './styles'
import DropDownPicker from 'react-native-dropdown-picker';
import { StatusBar } from 'expo-status-bar';
import {useStatus} from '../hook/statusglobal'

export function Atividade() {
  const [id, setId] = useState("");
  const {recarregaTelaGlobal, setRecarregaTelaGlobal} = useStatus(false);
  
  const [tipoAtividade, setTipoAtividade] = useState("");
  const [descricaoAtividade, setDescricaoAtividade] = useState("");
  const [localAtividade, setLocalAtividade] = useState("");
  const [dataEhora, setDataEhora] = useState("");
  const [horaEntrega, setHoraEntrega] = useState("");
  const [statusAtividade, setStatusAtividade] = useState("");
  const [atividadeList, setAtividadeList] = useState([]);
  const [recarregaTela, setRecarregaTela] = useState(!recarregaTela);
  const [criarTabela, setCriarTabela] = useState(false);
  const [items, setItems] = useState([
    { label: 'Pendente', value: 'Pendente' },
    { label: 'Concluido', value: 'Concluido' }
  ]);

  const [tipoAtividadeList, settipoAtividadeList] = useState([]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [open2, setOpen2] = useState(false);
  async function processamentoUseEffect() {
    if (!criarTabela) {
      setCriarTabela(true);
      await createTable();
    }
   
      await carregaDados();
  
  }
  useEffect(
    () => {
      processamentoUseEffect();
    }, [recarregaTela]);
    useEffect(
      () => {
        processamentoUseEffect();
      }, [recarregaTelaGlobal]);

  async function carregaDados() {
    try {
      let atividade = await obtemTodasAtividades();
      let tipoAtividade = await obtemTodosTiposAtividades();
      setAtividadeList(atividade);
      console.log(atividade);
      let list = [];
      for (let i = 0; i < tipoAtividade.length; i++) {
        let obj = {
          label: tipoAtividade[i].tipoAtividade,
          value: tipoAtividade[i].id
        }
        list.push(obj);
      }
      settipoAtividadeList(list);
      setRecarregaTela(false);

    } catch (e) {
      Alert.alert(e.toString());
    }
  }
  function limparCampos() {
    setId("");
    setTipoAtividade("");
    setDescricaoAtividade("");
    setDataEhora("");
    setLocalAtividade("");
    setHoraEntrega("");
    setStatusAtividade("");

  }
  async function salvar() {

    let novoRegistro = false;
    let identificador = id;
    if (identificador == undefined || identificador == null || identificador == "") {

      novoRegistro = true;
    }
    try {
      let objAtividade = {
        id: identificador,
        tipoAtividade: tipoAtividade,
        descricaoAtividade: descricaoAtividade,
        localAtividade: localAtividade,
        dataEhora: dataEhora,
        horaEntrega: horaEntrega,
        statusAtividade: statusAtividade
      }

      if (tipoAtividade == undefined || tipoAtividade == null || tipoAtividade == "") {

        Alert.alert('Erro', 'Tipo atividade deve ser inserido!');
        return;
      }
      if (descricaoAtividade == undefined || descricaoAtividade == null || descricaoAtividade == "") {

        Alert.alert('Erro', 'Descrição Atividade deve ser inserido!');
        return;
      }
      if (localAtividade == undefined || localAtividade == null || localAtividade == "") {

        Alert.alert('Erro', 'Local atividade deve ser inserido!');
        return;
      }
      if (statusAtividade == undefined || statusAtividade == null || statusAtividade == "") {

        Alert.alert('Erro', 'status atividade deve ser inserido!');
        return;
      }
      if (dataEhora == undefined || dataEhora == null || dataEhora == "") {

        Alert.alert('Erro', 'data atividade deve ser inserido!');
        return;
      }
      var patternData = /(((0[1-9]|[12][0-9]|3[01])([-./])(0[13578]|10|12)([-./])(\d{4}))|(([0][1-9]|[12][0-9]|30)([-./])(0[469]|11)([-./])(\d{4}))|((0[1-9]|1[0-9]|2[0-8])([-./])(02)([-./])(\d{4}))|((29)(\.|-|\/)(02)([-./])([02468][048]00))|((29)([-./])(02)([-./])([13579][26]00))|((29)([-./])(02)([-./])([0-9][0-9][0][48]))|((29)([-./])(02)([-./])([0-9][0-9][2468][048]))|((29)([-./])(02)([-./])([0-9][0-9][13579][26])))/;
      if (!patternData.test(dataEhora)) {
        Alert.alert("Erro","Digite a data no formato Dia/Mês/Ano");
        return ;
      }
      if (horaEntrega == undefined || horaEntrega == null || horaEntrega == "") {

        Alert.alert('Erro', 'hora atividade deve ser inserido!');
        return;
      }
      var patternData = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!patternData.test(horaEntrega)) {
        Alert.alert("Erro","Digite a hora no formato correto");
        return ;
      }

      if (novoRegistro) {
        let resposta = (await adicionaAtividade(objAtividade));

        if (resposta)
          Alert.alert('Sucesso', 'atividade adicionado com sucesso!');
        else
          Alert.alert('Falha ao inserir um novo tipo atividadee!');
      }
      else {
        let resposta = await alteraAtividade(objAtividade);
        if (resposta)
          Alert.alert('Sucesso', 'Alterado com sucesso!');
        else
          Alert.alert('Falha ao alterar A atividade!');
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

      const tipoAtividade = atividadeList.find(atividade => atividade.id == identificador);
      if (tipoAtividade != null) {
        setId(tipoAtividade.id);
        setTipoAtividade(tipoAtividade.idTipo);
        setDescricaoAtividade(tipoAtividade.descricaoAtividade);
        setDataEhora(tipoAtividade.dataEhora);
        setLocalAtividade(tipoAtividade.localAtividade);
        setHoraEntrega(tipoAtividade.horaEntrega);
        setStatusAtividade(tipoAtividade.statusAtividade);

      }
      else {
        limparCampos();
        Alert.alert("Não existe nenhuma atividade salva com esse código.");
      }

    }
    catch (error) {
      Alert.alert("Erro ao recuperar  atividade: " + error.toString());
      console.log(error.toString())
    }

  }

  function deletarAtividade(identificador) {
    Alert.alert('Atenção', 'Confirma a remoção da atividade?',
      [
        {
          text: 'Sim',
          onPress: () => efetivadeletarAtividade(identificador),
        },
        {
          text: 'Não',
          style: 'cancel',
        }
      ]);
  }
  async function efetivadeletarAtividade(identificador) {
    try {
      await excluiAtividade(identificador);
      Keyboard.dismiss();
      Alert.alert('Atividade apagada com sucesso!!!', 'você deletou a atividade selecionada!');
      limparCampos();
      setRecarregaTela(true);
      setRecarregaTelaGlobal(!recarregaTelaGlobal);
    } catch (e) {
      Alert.alert(e);
    }
  }

  function apagarTodos() {
    if (Alert.alert('Muita atenção!!!', 'Confirma a exclusão de todas as atividades?',
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
      await excluiTodasAtividade();
      Alert.alert('Já era apagou foi é tudo...', 'Você apagou todas as atividades!');
      setRecarregaTela(!recarregaTela);
      setRecarregaTelaGlobal(!recarregaTelaGlobal);
    }
    catch (e) {
      Alert.alert(e);
    }
  }
  return (

    <ScrollView style={{ flex: 1 }}>


      <View style={styles.campo}>
      <Text>Descrição atividade</Text>
        <TextInput

          label="Descrição atividade"
          value={descricaoAtividade}
          mode="outlined"
          onChangeText={text => setDescricaoAtividade(text)}
        />
      </View>
      <View style={styles.campo}>
        <Text>Tipo atividade</Text>
        <DropDownPicker
          open={open2}
          value={tipoAtividade}
          items={tipoAtividadeList}
          setOpen={setOpen2}
          setValue={setTipoAtividade}
          setItems={settipoAtividadeList}
          placeholder="Tipo Atividade"
          style={[{ zIndex: 1 }, styles.caixaTexto]}

        />
      </View>
      <View style={styles.campo}>
      <Text>Local atividade</Text>
        <TextInput

          label="Local da atividade"
          value={localAtividade}
          mode="outlined"
          onChangeText={text => setLocalAtividade(text)}
        />
      </View>
      <View style={styles.campo}>
        <Text>Situação</Text>
        <DropDownPicker
          open={open}
          value={statusAtividade}
          items={items}
          setOpen={setOpen}
          setValue={setStatusAtividade}
          setItems={setItems}
          placeholder="Situação"
          style={[{ zIndex: 1 }, styles.caixaTexto]}

        />

      </View>
      <View style={styles.campo}>
        <Text>Data de entrega</Text>
        <TextInputMask style={styles.caixaTexto}
          type={'datetime'}
          options={{
            format: 'DD/MM/YYYY'
          }}
          value={dataEhora}
          placeholder="Data de entrega"
          onChangeText={text => setDataEhora(text)}
        />

        {/* <TextInput

          label="Data de entrega"
          value={dataEhora}
          mode="outlined"
          onChangeText={text => setDataEhora(text)}
        /> */}
      </View>
      <View style={styles.campo}>
        <Text>Hora Entrega</Text>
        <TextInputMask style={styles.caixaTexto}
          type={'datetime'}
          options={{
            format: 'HH:mm'
          }}
          value={horaEntrega}
          placeholder="Hora de entrega"
          onChangeText={text => setHoraEntrega(text)}
        />
        {/* <TextInput

          label="Hora de entrega"
          value={horaEntrega}
          mode="outlined"
          onChangeText={text => setHoraEntrega(text)}
        /> */}
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
          atividadeList.map((atividade, index) => (
            <View style={styles.mainCardView} key={index.toString()}>
              <View>
                <Text style={{ fontSize: 15, fontWeight: 'bold' }} > Tipo atividade : {atividade.tipoAtividade}</Text>
                <Text style={{ fontSize: 15, fontWeight: 'bold' }} > Descrição atividade : {atividade.descricaoAtividade}</Text>
                <Text style={{ fontSize: 15, fontWeight: 'bold' }} > Local atividade : {atividade.localAtividade}</Text>
                <Text style={{ fontSize: 15, fontWeight: 'bold' }} > Data atividade : {atividade.dataEhora}</Text>
                <Text style={{ fontSize: 15, fontWeight: 'bold' }} > Status atividade : {atividade.statusAtividade}</Text>
              </View>
              <View>
                <TouchableOpacity onPress={() => carregar(atividade.id)}>
                  <MaterialIcons name="edit" size={35} color="black" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => deletarAtividade(atividade.id)}>
                  <MaterialIcons name="delete-forever" size={35} color="black" />
                </TouchableOpacity>

              </View>

            </View>
          ))
        }
      </ScrollView>


      <StatusBar style="auto" />
    </ScrollView>




  );
}


