import { MaterialIcons } from '@expo/vector-icons';
import {
  Alert, Text, TouchableOpacity,
  View, Keyboard, ScrollView, Image
} from 'react-native';
import { TextInput, Paragraph, Dialog, Portal, Appbar } from 'react-native-paper';
import { useState, useEffect } from 'react';
import {
  createTable,
  obtemTodasAtividades,
  alterarStatus,
  dropTable
} from '../services/dbAtividade';

import styles from './styles'
export function Home() {
  const [id, setId] = useState("");
  const [tipoAtividade, setTipoAtividade] = useState("");
  const [AtividadeList, setAtividadeList] = useState([]);
  const [AtividadeListFiltrado, setAtividadeListFiltrado] = useState([]);
  const [recarregaTela, setRecarregaTela] = useState(true);
  const [criarTabela, setCriarTabela] = useState(false);



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

  async function carregaDados() {
    try {
      let Atividade = await obtemTodasAtividades();
      console.log(Atividade);
      setAtividadeList(Atividade);


      setAtividadeListFiltrado(Atividade);
      setRecarregaTela(true);
    } catch (e) {
      Alert.alert(e.toString());
    }
  }
  function pendente() {
    try {
      console.log('teste');
      const atividadeAux = AtividadeList.filter(atividade => atividade.statusAtividade == 'Pendente');
      setAtividadeListFiltrado(atividadeAux);
     
    } catch (e) {
      Alert.alert(e.toString());
    }
  }
  function concluido() {
    try {
      console.log(AtividadeList);

      const atividadeAux = AtividadeList.filter(atividade => atividade.statusAtividade == 'Concluido');
      setAtividadeListFiltrado(atividadeAux);
      
    } catch (e) {
      Alert.alert(e.toString());
    }
  }
  function todos() {
    try {
      setAtividadeListFiltrado(AtividadeList);
      setRecarregaTela(!setRecarregaTela);
    } catch (e) {
      Alert.alert(e.toString());
    }
  }

  function alterarStatusAtividade(identificador,status) {
    Alert.alert('Atenção', `Confirma a alteração do status ${status} para ${status=='Pendente'?'Concluido':'Pendente'}`,
      [
        {
          text: 'Sim',
          onPress: () => efetivarAlterarStatus(identificador,status),
        },
        {
          text: 'Não',
          style: 'cancel',
        }
      ]);
  }
  async function efetivarAlterarStatus(identificador,status) {
    try {

      let statusTroca = status=='Pendente'?'Concluido':'Pendente'
      await alterarStatus(identificador,statusTroca);
      Keyboard.dismiss();
      Alert.alert('Status alerado com sucesso!!!', 'você alterou o status da atividade selecionada!');
      setRecarregaTela(!setRecarregaTela);
    } catch (e) {
      Alert.alert(e);
    }
  }
  return (

    <ScrollView>

      <View style={styles.areaBotoes}>
        <TouchableOpacity style={styles.botaoSalvar}
          onPress={() => { pendente() }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold' }}>Pendente</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botaoCarregar}
          onPress={() => { concluido() }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold' }}>Concluido</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botaoLimpar}
          onPress={() => { todos() }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold' }}>Todos</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ paddingTop: 10 }}>
        {
          AtividadeListFiltrado.map((atividade, index) => (
            <TouchableOpacity key={index.toString()}
            onPress={() => { alterarStatusAtividade(atividade.id,atividade.statusAtividade) }}>
              <View style={styles.mainCardView} >
                <View>
                  <Text style={{ fontSize: 15, fontWeight: 'bold' }} > Tipo atividade : {atividade.tipoAtividade}</Text>
                  <Text style={{ fontSize: 15, fontWeight: 'bold' }} > Descrição atividade : {atividade.descricaoAtividade}</Text>
                  <Text style={{ fontSize: 15, fontWeight: 'bold' }} > Local atividade : {atividade.localAtividade}</Text>
                  <Text style={{ fontSize: 15, fontWeight: 'bold' }} > Data atividade : {atividade.dataEhora}</Text>
                  <Text style={{ fontSize: 15, fontWeight: 'bold' }} > Status atividade : {atividade.statusAtividade}</Text>
                </View>

              </View>
            </TouchableOpacity>

          ))
        }
      </ScrollView>

    </ScrollView>




  );
}


