import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Platform,
  TouchableOpacity,
  Alert,
  Button,
} from 'react-native';

import * as Database from './services/Database';
import Formulario from './components/Formulario';
import ListaRegistros from './components/ListaRegistros';
import * as Sharing from 'expo-sharing';
import Grafico from './components/Grafico';

export default function App() {
  const [registros, setRegistros] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [editingId, setEditingId] = useState(null);
   const [registroEmEdicao, setRegistroEmEdicao] = useState(null);
  const [ordenacao, setOrdenacao] = useState('recentes');

  useEffect(() => {
    const init = async () => {
      const dados = await Database.carregarDados();
      setRegistros(dados);
      setCarregando(false);
    };
    init();
  }, []);

  useEffect(() => {
    if (!carregando) {
      Database.salvarDados(registros);
    }
  }, [registros, carregando]);

  const handleSave = (horasEdicao, tempoVideo,  tempoSono) => {
  const edicaoNum = parseFloat(horasEdicao) || 0;
  const videoNum = parseFloat(tempoVideo) || 0;
  const sonoNum = parseFloat(tempoSono) || 0;

  if (registroEmEdicao) {
    const registrosAtualizados = registros.map(reg =>
      reg.id === registroEmEdicao.id
        ? { ...reg, edicao: edicaoNum, video: videoNum, sono: sonoNum }
        : reg
    );
    setRegistros(registrosAtualizados);
    Alert.alert('Sucesso!', 'Registro atualizado!');
  } else {
    const novoRegistro = { id: new Date().getTime(), data: new Date().toLocaleDateString('pt-BR'), edicao: edicaoNum, video: videoNum, sono: sonoNum  };
    setRegistros([...registros, novoRegistro]);
    Alert.alert('Sucesso!', 'Registro salvo!');
  }

  setRegistroEmEdicao(null);

    if (editingId) {
      const registrosAtualizados = registros.map(reg =>
        reg.id === editingId ? { ...reg, edicao: edicaoNum, video: videoNum, sono: sonoNum } : reg
      );
      setRegistros(registrosAtualizados);
    } else {
      const novoRegistro ={ id: new Date().getTime(), data: new Date().toLocaleDateString('pt-BR'), edicao: edicaoNum, video: videoNum, sono: sonoNum };
      setRegistros([...registros, novoRegistro]);
    }
    setEditingId(null);
  };

  const handleDelete = (id) => {
    setRegistros(registros.filter(reg => reg.id !== id));
  };

  const handleEdit = (registro) => {
    setEditingId(registro.id);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleIniciarEdicao = (registro) => {
  setRegistroEmEdicao(registro);
};

const handleCancelarEdicao = () => {
  setRegistroEmEdicao(null);
};

  const exportarDados = async () => {
      const fileUri = Database.fileUri; 
      if (Platform.OS === 'web') {
          const jsonString = JSON.stringify(registros, null, 2);
          if (registros.length === 0) { return Alert.alert("Aviso", "Nenhum dado para exportar."); }
          const blob = new Blob([jsonString], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a'); a.href = url; a.download = 'dados.json'; a.click();
          URL.revokeObjectURL(url);
      } else {
          const fileInfo = await FileSystem.getInfoAsync(fileUri);
          if (!fileInfo.exists) { return Alert.alert("Aviso", "Nenhum dado para exportar."); }
          if (!(await Sharing.isAvailableAsync())) { return Alert.alert("Erro", "Compartilhamento não disponível."); }
          await Sharing.shareAsync(fileUri);
      }
  };

  if (carregando) {
    return <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#3c2557" /></View>;
  }

   let registrosExibidos = [...registros]; 
if (ordenacao === 'maior_Edicao') {

  registrosExibidos.sort((a, b) => b.edicao - a.video);
} else {
  
  registrosExibidos.sort((a, b) => b.id - a.id);
}

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.titulo}>Editando</Text>
        <Grafico registros={registrosExibidos} />
        <Text style={styles.subtituloApp}>App Componentizado</Text>
        <Text style={styles.titulo}>Edição</Text>
      

        <Formulario 
          onSave={handleSave} 
          onCancel={handleCancelarEdicao}
          registroEmEdicao={registroEmEdicao}
        />

        <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 10, gap: 10 }}>
  <Button title="Mais Recentes" onPress={() => setOrdenacao('recentes')} />
  <Button title="Maior Valor (Edição)" onPress={() => setOrdenacao('maior_Edição')} />
  <Button title="Editar" onPress={() => onEdit(reg)} />
</View>

        <ListaRegistros 
          registros={registrosExibidos}
          onEdit={handleIniciarEdicao}
          onDelete={handleDelete}
        />

        <View style={styles.card}>
            <Text style={styles.subtitulo}>Exportar "Banco de Dados"</Text>
            <TouchableOpacity style={styles.botaoExportar} onPress={exportarDados}>
                <Text style={styles.botaoTexto}>Exportar arquivo dados.json</Text>
            </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: Platform.OS === 'android' ? 25 : 0, backgroundColor: '#180030' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  titulo: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginVertical: 20, color: '#ffffe6' },
  subtituloApp: { textAlign: 'center', fontSize: 16, color: '#ffffe6', marginTop: -20, marginBottom: 20, fontStyle: 'italic' },
  card: { backgroundColor: '#3c2557', borderRadius: 8, padding: 15, marginHorizontal: 15, marginBottom: 20, elevation: 3 },
  subtitulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, color: '#ffffe6' },
  botaoExportar: { backgroundColor: '#3c2557', padding: 15, borderRadius: 5, alignItems: 'center', marginTop: 5 },
  botaoTexto: { color: '#3c2557', fontSize: 16, fontWeight: 'bold' },
});