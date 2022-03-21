import { StyleSheet } from 'react-native';
import { Colors } from 'react-native-paper';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    title : {     
        alignItems:'center'
    },
    campo : {
       
        width:'90%',
        alignContent:'center',
        paddingLeft:25,
        paddingTop:20
       
    },
    viewRow:{
        flexDirection:'row'
    },
    areaBotoes : {
        paddingLeft:20,
        flexDirection : 'row',
        justifyContent:'space-between',
        width:'90%',
        paddingTop:20,
        alignItems:'center',
        zIndex: 1
        
    },
    botaoSalvar:{
        shadowColor: Colors.shadow,
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 1,
        shadowRadius: 15,
        backgroundColor: '#74D458',
        elevation: 2, // Android
        height: 50,
        width: 100,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        elevation: 8,
        borderRadius:9,
    },
    botaoCarregar:{
        shadowColor: Colors.shadow,
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 1,
        shadowRadius: 15,
        backgroundColor: '#74D458',
        elevation: 2, // Android
        height: 50,
        width: 100,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        elevation: 8,
        borderRadius:9,
    },
    botaoLimpar:{
        shadowColor: Colors.shadow,
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 1,
        shadowRadius: 15,
        backgroundColor: '#74D458',
        elevation: 2, // Android
        height: 50,
        width: 100,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        elevation: 8,
        borderRadius:9,
    },
    mainCardView: {
        height: 120,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'#FAF5F5',
        borderRadius: 15,
        shadowColor: Colors.shadow,
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 1,
        shadowRadius: 8,
        elevation: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 16,
        paddingRight: 14,
        marginTop: 15,
        marginBottom: 6,
        marginLeft: 16,
        marginRight: 16,
      },
      caixaTexto: {
        borderColor: "black",
        borderWidth: 1,
        height: 60,
        paddingHorizontal: 10,
        borderRadius: 4,
        backgroundColor:'#FAF7F7'
    },
  });

  export default styles;