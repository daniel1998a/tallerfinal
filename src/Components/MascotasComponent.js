import React,{useEffect,useState} from "react";
import axios from 'axios';
import { mostrarAlerta } from "../functions.js";
import Swal from 'sweetalert2';
import withReactContent from "sweetalert2-react-content";


const MascotasComponent=()=>{
    const url = "http://localhost:9000/perros" ;

    const [perros,setPerros] = useState([]);
    const [id,setId]=useState('');
    const [nombre,setNombre]=useState('');
    const [edad,setEdad]=useState('');
    const [raza,setRaza]=useState('');
    const [descrip_cor,setDescrip_cor]=useState('');
    const [descrip_larg,setDescrip_larg]=useState('');
    const [operacion, setOperacion] = useState("");
    const [titulo,setTitulo]=useState("");

    useEffect(()=>{
        getPerros();
    },[]);
    
    const getPerros = async () =>{
        const respuesta = await axios.get(`${url}/buscar`);
        console.log(respuesta.data);
        setPerros(respuesta.data);
    };

    const openModal =(opcion, id, nombre, edad, raza, descrip_cor, descrip_larg)=>{
        setId('');
        setNombre('');
        setEdad('');
        setRaza('');
        setDescrip_cor('');
        setDescrip_larg('');
        setOperacion(opcion);
        if(opcion == 1){
            setTitulo("Registrar Perros")
        }
        else if(opcion==2){
            setTitulo("Editar Nombre");
            setId(id);
            setNombre(nombre);
            setEdad(edad);
            setRaza(raza);
            setDescrip_cor(descrip_cor);
            setDescrip_larg(descrip_larg);
        }
    };

    const validar = ()=>{
        let parametros;
        let metodo;
        if(nombre.trim()===''){
            console.log("Debe escribrir un Nombre");
            mostrarAlerta("Debe escribrir un Nombre")
        }
        else if(edad.trim()==''){
            console.log("Debe escribir una edad");
            mostrarAlerta("Debe escribir una edad")
        }
        else if(raza.trim()==''){
          console.log("Debe escribir la raza");
          mostrarAlerta("Debe escribir la raza")
        }
        else if(descrip_cor.trim()==''){
          console.log("Debe escribir una descriocion corta");
          mostrarAlerta("Debe escribir una drecripcion corta")
        }
        else if(descrip_larg.trim()==''){
          console.log("Debe escribir una descriocion corta");
          mostrarAlerta("Debe escribir una drecripcion larga")
        }
        else{
           if(operacion==1){
            parametros={
                urlExt: `${url}/crear`,
                nombre: nombre.trim(),
                edad: edad.trim(),
                raza: raza.trim(),   
                descrip_cor: descrip_cor.trim(),
                descrip_larg: descrip_larg.trim()
            };
            metodo="POST";
           }
           else{
            parametros={
                urlExt: `${url}/actualizar/${id}`,
                nombre: nombre.trim(),
                edad: edad.trim(),
                raza: raza.trim(),   
                descrip_cor: descrip_cor.trim(),
                descrip_larg: descrip_larg.trim()
            };
            metodo="PUT";
           }
           enviarSolicitud(metodo, parametros);
        }
    };

    const enviarSolicitud = async(metodo,parametros)=>{
        await axios({method: metodo, url: parametros.urlExt, data: parametros })
        .then((respuesta)=>{
            let tipo= respuesta.data.tipo;
            let mensaje = respuesta.data.mensaje;
            mostrarAlerta(mensaje,tipo);
            if(tipo ==="success"){
                document.getElementById("btnCerrarModal").click();
                setPerros();
            }
        })
        .catch((error)=>{
            mostrarAlerta(`Error en la solicitud`,error)
        });
      };
    
      const eliminarMascota=(id,nombre)=>{
        const MySwal = withReactContent(Swal);
        MySwal.fire({
            title: `Estas seguro de eliminar la mascota ${nombre} ?`,
            icon: 'question',
            text: 'Se eliminará Definitivamente',
            showCancelButton: true, 
            confirmButtonText: 'Si, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result)=>{
            if(result.isConfirmed){
                setId(id);
                enviarSolicitud("DELETE",{urlExt: `${url}/eliminar/${id}`,id:id})
            }
            else{
                mostrarAlerta("No se elimino la mascota","info");
            }
    
        })
    
      }

      

    const [currentPage, setcurrentPage]= useState(1)
    const recordsPerPage = 3;
    const lastIndex = currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;
    //const records = perros.slice(firstIndex, lastIndex);
    const npage = Math.ceil(perros.length /  recordsPerPage);
    const numbers = [...Array(npage + 1).keys()].slice(1);

    return(  
        <><div className="container-fluid">
          <nav class="navbar bg-dark border-bottom border-body" data-bs-theme="dark">
            <div class="container-fluid">
              <a class="navbar-brand" href="#">
                Adopcion de mascotas
              </a>
            </div>
          </nav>
        <div className="row mt-3">
          <div className="col-md-4 offset-md-4">
            <div className="d-grid mx-auto">
              <button
              
                onClick={() => openModal(1)}
                className="btn btn-dark"
                class="my-butt"
                data-bs-toggle="modal"
                data-bs-target="#modalMascotas"
              >
                <i className="fa-solid fa-circle-plus" ></i>Añadir
              </button>
            </div>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-12 col-lg-8 offset-0 offset-lg-2">
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>NOMBRE</th>
                    <th>EDAD</th>
                    <th>RAZA</th>
                    <th>FOTO</th>
                    <th>DESCRIPCION</th>
                    <th>DESCRIPCION LARGA</th>
                  </tr>
                </thead>
                <tbody className="table-group-divider">
                  {
                    
                    perros.slice(currentPage * 3 -3,currentPage * 3).map((perro, i) => (
                      <tr key={perro.id}>
                        <td>{perro.id}</td>
                        <td>{perro.nombre}</td>
                        <td>{perro.edad}</td>
                        <td>{perro.raza}</td>
                        <td>{perro.url}</td>
                        <td>{perro.descrip_cor}</td>
                        <td>{perro.descrip_larg}</td>
                        <td>
                          
                          <button
                            onClick={() => openModal(2, perro.id, perro.nombre, perro.edad, perro.raza, perro.descrip_cor, perro.descrip_larg)} //mustra los datos en actualizar
                            className="btn btn-warning"
                            data-bs-toggle="modal"
                            data-bs-target="#modalMascotas">
                            <i className="fa-solid fa-edit"></i>
                          </button>
                        </td>
                        <td>
                          <button
                            onClick={() => eliminarMascota(perro.id, perro.nombre)}
                            className="btn btn-danger">
                            <i className="fa-solid fa-edit"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
       <nav>
        <ul className="pagination">
              <li className="page-item">
                      <a href="#" className="page-link" onClick={prePage}>prev</a>
              </li>
              {
                numbers.map((n, i)=>(
                  <li className={`page-item ${currentPage === n ? 'active' : ''}`} key={i}>
                    <a href='#' className='page-link' 
                    onClick={()=>changeCPage(n)}>{n}</a>
                  </li>
                ))
              }
               <li className="page-item">
                      <a href="#" className="page-link" onClick={nextPage}>next</a>
              </li>
        </ul>
       </nav>


      </div><div id="modalMascotas" className="modal fade" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <label className="h5">{titulo}</label>
              </div>
              <div className="modal-body">
                <input type="hidden" id="id"></input>
                <div className="input-group mb-3">
                  <span className="input-group-text">
                    <i className="fa-solid fa-gift"></i>
                  </span>
                  <input
                    type="text"
                    id="nombre"
                    className="form-control"
                    placeholder="Nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                  ></input>
                </div>
                <div className="input-group mb-3">
                  <span className="input-group-text">
                    <i className="fa-solid fa-gift"></i>
                  </span>
                  <input
                    type="text"
                    id="edad"
                    className="form-control"
                    placeholder="Edad"
                    value={edad}
                    onChange={(e) => setEdad(e.target.value)}
                  ></input>
                </div>
                <div className="input-group mb-3">
                  <span className="input-group-text">
                    <i className="fa-solid fa-gift"></i>
                  </span>
                  <input
                    type="text"
                    id="raza"
                    className="form-control"
                    placeholder="Raza"
                    value={raza}
                    onChange={(e) => setRaza(e.target.value)}
                  ></input>
                </div>
                <div className="input-group mb-3">
                  <span className="input-group-text">
                    <i className="fa-solid fa-gift"></i>
                  </span>
                  <input
                    type="text"
                    id="descrip_cor"
                    className="form-control"
                    placeholder="descrip_cor"
                    value={descrip_cor}
                    onChange={(e) => setDescrip_cor(e.target.value)}
                  ></input>
                </div>
                <div className="input-group mb-3">
                  <span className="input-group-text">
                    <i className="fa-solid fa-gift"></i>
                  </span>
                  <input
                    type="text"
                    id="descrip_larg"
                    className="form-control"
                    placeholder="descrip_larg"
                    value={descrip_larg}
                    onChange={(e) => setDescrip_larg(e.target.value)}
                  ></input>
                </div>
                <div className="d-grid col-6 mx-auto">
                  <button onClick={() => validar()} className="btn btn-success">
                    <i className="fa-solid fa-floppy-disk"></i>Guardar
                  </button>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  id="btnCerrarModal"
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
          <button></button>
        </div></>
        
    
    );

    function prePage(){
      if(currentPage !== firstIndex){
        setcurrentPage(currentPage - 1)
      }
    }

    function changeCPage(id){
      setcurrentPage(id)
    }

    function nextPage() {
      if(currentPage !== lastIndex){
        setcurrentPage(currentPage + 1)
      }
    }

};

export default MascotasComponent;


