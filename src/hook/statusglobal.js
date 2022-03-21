import React, { useContext, createContext,useState } from 'react'

const StatusContext = createContext();

export default function statusGlobal({ children }) {
    const [recarregaTelaGlobal, setRecarregaTelaGlobal] = useState(false);
    return (
        <StatusContext.Provider value={{ recarregaTelaGlobal, setRecarregaTelaGlobal }}>
            {children}
        </StatusContext.Provider>
    );
}

export function useStatus(){
    const status = useContext(StatusContext);
    const {recarregaTelaGlobal,setRecarregaTelaGlobal} = status;
    return {recarregaTelaGlobal,setRecarregaTelaGlobal};
}