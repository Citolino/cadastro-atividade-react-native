import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home } from '../pages/Home';
import { TipoAtividade } from '../pages/TipoAtividade';
const Tab = createBottomTabNavigator();
import { Feather,AntDesign,MaterialCommunityIcons   } from '@expo/vector-icons';
import { Atividade } from '../pages/Atividade';


export function AppRoutes() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{headerTitleAlign:'center'}}>
      <Tab.Screen 
        name="Tipo Atividade" 
        component={TipoAtividade}
        options={{tabBarIcon: () => {
          return <MaterialCommunityIcons name="format-list-bulleted-type" size={24} color="black" />
        }}}
         />
        <Tab.Screen 
        name="Inicio" 
        component={Home} 
        options={{tabBarIcon: () => {
          return <Feather name="home" size={24} color="black" />
        }}}
        />
        <Tab.Screen 
        name=" Atividade" 
        component={Atividade}
        options={{tabBarIcon: () => {
          return <AntDesign name="book" size={24} color="black" />
        }}}
         />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

