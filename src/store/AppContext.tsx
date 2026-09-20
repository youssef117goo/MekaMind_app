import React, { createContext, useContext, useState, ReactNode } from 'react';

// Types
export interface PinMapping {
  inputs: Record<string, number>;
  outputs: Record<string, number>;
}

export interface Board {
  id: string;
  name: string;
  inputsCount: number;
  outputsCount: number;
  pinMapping: PinMapping;
  createdAt: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  assignedBoard: string;
  status: 'online' | 'offline';
  aliases: Record<string, string>;
  lastSeen: string;
}

export interface SensorReading {
  id: string;
  inputId: string;
  value: number;
  timestamp: string;
}

// Initial Data
const initialBoards: Board[] = [
  {
    id: 'BOARD_7788',
    name: 'MekaMind Standard',
    inputsCount: 3,
    outputsCount: 2,
    pinMapping: {
      inputs: { 'INP_1': 2, 'INP_2': 4, 'INP_3': 5 },
      outputs: { 'OUT_1': 15, 'OUT_2': 16 }
    },
    createdAt: '2024-01-15'
  },
  {
    id: 'BOARD_9900',
    name: 'MekaMind Pro',
    inputsCount: 5,
    outputsCount: 4,
    pinMapping: {
      inputs: { 'INP_1': 2, 'INP_2': 4, 'INP_3': 5, 'INP_4': 12, 'INP_5': 13 },
      outputs: { 'OUT_1': 15, 'OUT_2': 16, 'OUT_3': 17, 'OUT_4': 18 }
    },
    createdAt: '2024-02-20'
  }
];

const initialClients: Client[] = [
  {
    id: 'USER_123',
    name: 'أحمد محمد',
    email: 'ahmed@example.com',
    assignedBoard: 'BOARD_7788',
    status: 'online',
    aliases: {
      'INP_1': 'حساس الحرارة',
      'INP_2': 'حساس الرطوبة',
      'INP_3': 'حساس الضوء',
      'OUT_1': 'موتور السير',
      'OUT_2': 'مصباح LED'
    },
    lastSeen: '2024-03-15 14:30'
  },
  {
    id: 'USER_456',
    name: 'سارة علي',
    email: 'sara@example.com',
    assignedBoard: 'BOARD_9900',
    status: 'offline',
    aliases: {
      'INP_1': 'حساس الحركة',
      'INP_2': 'حساس الغاز',
      'OUT_1': 'الإنذار',
      'OUT_2': 'المروحة'
    },
    lastSeen: '2024-03-14 09:15'
  }
];

interface AppContextType {
  boards: Board[];
  clients: Client[];
  currentClient: Client | null;
  setCurrentClient: (client: Client | null) => void;
  addBoard: (board: Board) => void;
  updateBoard: (board: Board) => void;
  deleteBoard: (id: string) => void;
  addClient: (client: Client) => void;
  updateClient: (client: Client) => void;
  deleteClient: (id: string) => void;
  updateAliases: (clientId: string, aliases: Record<string, string>) => void;
  getBoardById: (id: string) => Board | undefined;
  getClientById: (id: string) => Client | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [boards, setBoards] = useState<Board[]>(initialBoards);
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [currentClient, setCurrentClient] = useState<Client | null>(initialClients[0]);

  const addBoard = (board: Board) => setBoards(prev => [...prev, board]);
  
  const updateBoard = (board: Board) => setBoards(prev => 
    prev.map(b => b.id === board.id ? board : b)
  );

  const deleteBoard = (id: string) => setBoards(prev => prev.filter(b => b.id !== id));

  const addClient = (client: Client) => setClients(prev => [...prev, client]);

  const updateClient = (client: Client) => setClients(prev =>
    prev.map(c => c.id === client.id ? client : c)
  );

  const deleteClient = (id: string) => setClients(prev => prev.filter(c => c.id !== id));

  const updateAliases = (clientId: string, aliases: Record<string, string>) => {
    setClients(prev => prev.map(c => 
      c.id === clientId ? { ...c, aliases } : c
    ));
    if (currentClient?.id === clientId) {
      setCurrentClient(prev => prev ? { ...prev, aliases } : null);
    }
  };

  const getBoardById = (id: string) => boards.find(b => b.id === id);
  const getClientById = (id: string) => clients.find(c => c.id === id);

  return (
    <AppContext.Provider value={{
      boards, clients, currentClient, setCurrentClient,
      addBoard, updateBoard, deleteBoard,
      addClient, updateClient, deleteClient,
      updateAliases, getBoardById, getClientById
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
