import { useState, useEffect } from 'react'

import { db, auth } from './firebaseConnection'
import {
  doc,
  setDoc,
  collection,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore'

import {
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from 'firebase/auth'

import { Trash } from 'phosphor-react'

import './App.css'

export const App = () => {

  const [titulo, setTitulo] = useState('')
  const [autor, setAutor] = useState('')
  const [idPost, setIdPost] = useState('')

  const [invalidLogin, setInvalidLogin] = useState(false)

  const [user, setUser] = useState(false)
  const [userDetail, setUserDetail] = useState({})

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')

  const [posts, setPosts] = useState([])

  useEffect(() => {

    async function loadPosts() {
      const unsub = onSnapshot(collection(db, 'posts'), (snapshot) => {
        let listaPost = []

        snapshot.forEach(doc => {
          listaPost.push({
            id: doc.id,
            titulo: doc.data().title,
            autor: doc.data().author,
          })
        })

        setPosts(listaPost)

      })
        .catch((error) => {
          console.log('DEU ERRO: ' + error);
        })
    }

    loadPosts()

  }, [])

  useEffect(() => {
    async function checkLogin() {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          // Tem usuário logado
          setUser(user)
          setUserDetail({
            uid: user.uid,
            email: user.email
          })
        } else {
          // Não possui usuário logado
          setUser('')
          setUserDetail({})
        }
      })

    }

    checkLogin()

  }, [])

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

  async function editarPost() {

    const docRef = doc(db, 'posts', idPost)

    await updateDoc(docRef, {
      title: titulo,
      author: autor
    })
      .then(() => {
        console.log('POST ATUALIZADO');
        setAutor('')
        setTitulo('')
        setIdPost('')
      })
      .catch(error => {
        console.error(`ERRO AO ATUALIZAR O POST! Erro: ${error}`);
      })

  }

  async function excluirPost(id) {
    const docRef = doc(db, 'posts', id)

    await deleteDoc(docRef)
      .then(() => {
        console.log('POST DELETADO COM SUCESSO!');
      })

  }

  async function novoUsuario() {
    await createUserWithEmailAndPassword(auth, email, senha)
      .then((value) => {
        console.log('CADASTRADO COM SUCESSO');
        console.log(value);
        setEmail('')
        setSenha('')
      })
      .catch((error) => {

        if (error.code === 'auth/weak-password') {
          alert('Senha muito fraca!')
        } else if (error.code === 'auth/email-already-in-use') {
          alert('Email já está sendo usado!')
        }

      })
  }

  async function logarUsuario() {
    await signInWithEmailAndPassword(auth, email, senha)
      .then(value => {
        console.log('USUÁRIO LOGADO COM SUCESSO');
        console.log(value.user);

        setUserDetail({
          uid: value.user.uid,
          email: value.user.email
        })

        setUser(true)
        setInvalidLogin(false)
        setEmail('')
        setSenha('')
      })
      .catch(error => {
        setInvalidLogin(true)
        console.log('ERRO AO FAZER O LOGIN');
      })
  }

  async function fazerLogout() {
    await signOut(auth)
    setUser(false)
    setUserDetail({})
  }

  return (
    <div>
      <h1>ReactJS + Firebase 📝</h1>

      {
        invalidLogin && (
          <div>
            <strong className='invalid-login'>Usuário ou senha inválida! 🙊</strong>
          </div>
        )
      }

      {
        user && (
          <div>
            <strong>Seja bem-vindo(a)! Você está logado!</strong>
            <p>ID: {userDetail.uid} - Email: {userDetail.email}</p>
            <button onClick={fazerLogout}>Sair da conta</button>
          </div>
        )
      }

      <div className="container">
        <h2>Usuários</h2>
        <label>E-mail</label>
        <input
          type="text"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder='Digite seu email'
        />
        <input
          type="text"
          value={senha}
          onChange={e => setSenha(e.target.value)}
          placeholder='Digite sua senha'
        />
        <button onClick={logarUsuario}>Login</button>
        <button onClick={novoUsuario}>Cadastrar</button>
      </div>

      <hr />

      <div className="container">
        <h2>Posts</h2>

        <label>Buscar post</label>
        <input
          type="text"
          value={idPost}
          placeholder='Digite o ID do post'
          onChange={e => setIdPost(e.target.value)}
        />

        <label>Titulo</label>
        <input
          type="text"
          placeholder='Digite o título'
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />

        <label>Autor</label>
        <input
          type="text"
          placeholder="Autor do post"
          value={autor}
          onChange={(e) => setAutor(e.target.value)}
        />

        <button onClick={handleAdd}>Cadastrar</button>
        <button onClick={buscarPost}>Buscar post</button>
        <button onClick={editarPost}>Atualizar post</button>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Autor</th>
            </tr>
          </thead>
          <tbody>

            {
              posts.map(post => {
                return (
                  <tr key={post.id}>
                    <td>{post.id} </td>
                    <td> {post.titulo} </td>
                    <td> {post.autor} </td>
                    <td><button
                      className='delete-button'
                      onClick={() => excluirPost(post.id)}><Trash size={24} /> Excluir </button></td>
                  </tr>
                )
              })
            }

          </tbody>
        </table>


      </div>

    </div>
  )
}
