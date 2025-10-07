import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function Formulario({ onSave, onCancel, registroEmEdicao }) {
  const [HorasEdicao, setHorasEdicao] = useState('');
  const [TempoVideo, setTempoVideo] = useState('');
   const [TempoSono, setTempoSono] = useState('');

  useEffect(() => {
    if (registroEmEdicao) {
      setHorasEdicao(String(registroEmEdicao.edicao));
      setTempoVideo(String(registroEmEdicao.video));
      setTempoSono(String(registroEmEdicao.sono));
    } else {
      setHorasEdicao('');
      setTempoVideo('');
      setTempoSono('');
    }
  }, [registroEmEdicao]);

  const handleSaveClick = () => {
    onSave(HorasEdicao, TempoVideo, TempoSono );
  };

  return (
    <View style={styles.card}>
      <Text style={styles.subtitulo}>
        {registroEmEdicao ? 'Editando Registro (Update)' : 'Novo Registro (Create)'}
      </Text>
      <TextInput style={styles.input} placeholder="Horas de Edição" keyboardType="numeric" value={HorasEdicao} onChangeText={setHorasEdicao} />
      <TextInput style={styles.input} placeholder="Tempo de Video" keyboardType="numeric" value={TempoVideo} onChangeText={setTempoVideo} />
       <TextInput style={styles.input} placeholder="Tempo de Sono" keyboardType="numeric" value={TempoSono} onChangeText={setTempoSono} />

      <TouchableOpacity style={styles.botao} onPress={handleSaveClick}>
        <Text style={styles.botaoTexto}>
          {registroEmEdicao ? 'Atualizar Registro' : 'Gravar no Arquivo'}
        </Text>
      </TouchableOpacity>

      {registroEmEdicao && (
        <TouchableOpacity style={styles.botaoCancelar} onPress={onCancel}>
          <Text style={styles.botaoTexto}>Cancelar Edição</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
    card: { backgroundColor: '#3c2557', borderRadius: 8, padding: 15, marginHorizontal: 15, marginBottom: 20, elevation: 3 },
    subtitulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, color: '#ffffe6' },
    input: { borderWidth: 1, borderColor: '#180030', borderRadius: 5, padding: 12, fontSize: 16, marginBottom: 10 },
    botao: { backgroundColor: '#180030', padding: 15, borderRadius: 5, alignItems: 'center', marginTop: 5 },
    botaoTexto: { color: '#ffffe6', fontSize: 16, fontWeight: 'bold' },
    botaoCancelar: { backgroundColor: '#3c2557', padding: 10, borderRadius: 5, alignItems: 'center', marginTop: 10 },
});