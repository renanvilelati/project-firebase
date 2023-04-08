import { useState } from 'react'

import { db } from './firebaseConnection'
import { doc, setDoc, collection, addDoc, getDoc, getDocs } from 'firebase/firestore'

import './App.css'

export const App = () => {

  const [titulo, setTitulo] = useState('')
  const [autor, setAutor] = useState('')
  const [posts, setPosts] = useState([])

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
        console.error('GEROU UM ERRO ' + error);
      })
  }

  async function buscarPost() {

    // Buscando apenas um documento
    // const postRef = doc(db, 'posts', 'vMl0hg0TnlpNk1znCwS2')
    // await getDoc(postRef)
    //   .then((snapshot) => {
    //     setAutor(snapshot.data().author)
    //     setTitulo(snapshot.data().title)
    //   })
    //   .catch((error) => {
    //     console.error('ERRO AO BUSCAR');
    //   })

    const postRef = collection(db, 'posts')
    await getDocs(postRef)
      .then((snapshot) => {

        let lista = []

        snapshot.forEach(doc => {
          lista.push({
            id: doc.id,
            titulo: doc.data().title,
            autor: doc.data().author,
          })
        })

        setPosts(lista)

      })
      .catch((error) => {
        console.log('DEU ERRO: ' + error);
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
        <button onClick={buscarPost}>Buscar post</button>

        <ul>
          {
            posts.map(post => {
              return (
                <li key={post.id}>
                  <span>Título: {post.titulo}</span> <br />
                  <span>Autor: {post.autor}</span> <br />
                </li>
              )
            })
          }
        </ul>

      </div>

    </div>
  )
}
