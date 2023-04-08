import { useState } from 'react'

import { db } from './firebaseConnection'
import { doc, setDoc, collection, addDoc } from 'firebase/firestore'

import './App.css'

export const App = () => {

  const [titulo, setTitulo] = useState('')
  const [autor, setAutor] = useState('')

  async function handleAdd() {
    // Usando o setDoc é preciso informar qual o ID do documento
    // await setDoc(doc(db, 'posts', '12345'), {
    //   title: titulo,
    //   author: autor
    // })
    //   .then(() => {
    //     console.log('DADOS REGISTRADOS NO BANCO!');
    //   })
    //   .catch((error) => {
    //     console.log('GEROU UM ERRO ' + error);
    //   })

    // Usando o addDoc o ID é incrementado automáticamente
    await addDoc(collection(db, 'posts'), {
      title: titulo,
      author: autor
    })
      .then(() => {
        console.log('DADOS REGISTRADOS NO BANCO!');
        setAutor('')
        setTitulo('')
      })
      .catch((error) => {
        console.log('GEROU UM ERRO ' + error);
      })
  }

  return (
    <div>
      <h1>ReactJS + Firebase :)</h1>

      <div className="container">
        <label>Titulo:</label>
        <textarea
          type="text"
          placeholder='Digite o titulo'
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />

        <label>Autor:</label>
        <input
          type="text"
          placeholder="Autor do post"
          value={autor}
          onChange={(e) => setAutor(e.target.value)}
        />

        <button onClick={handleAdd}>Cadastrar</button>
        {/* <button onClick={buscarPost}>Buscar post</button> */}

      </div>

    </div>
  )
}
