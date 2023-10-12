import dataBase from '../ConectionDb/connectionDb.js'

class categoriaController {
    constructor(){}

    getAllCategories = async (req,res,next) => {
        const  idUser = req.params.idUser;

        const usuarioRef = dataBase.collection('usuarios');

        usuarioRef
        .doc(idUser)
        .get()
        .then((userDoc) => {
              const userData = userDoc.data();
      
              const categorias = userData.categorias;
      
              if (categorias) {
                res.send({ success: true, message: "Categorias encontradas", categorias });;
              } else {
                res.send({ message: 'No existen categorias creadas' });
              }
          })
    }
    createCategoria = async (req,res,next) => {
        const  idUser = req.params.id;
        try{
            const {nombre, descripcion, montoMax } = req.body;

            if (montoMax <= 0) {
                throw new Error("El monto debe ser mayor a 0");
            }
            
            const newCategorie = {
                nombre : nombre,
                descripcion : descripcion,
                montoMax : montoMax
            };

            dataBase.collection('usuarios').doc(idUser).update({categorias: newCategorie})
            res.status(200).send("Categoria creada con exito")
        } catch{
            res.status(404).send({ success: false, result: "Categoria no fue creada" });
        }
    }
}

export default categoriaController