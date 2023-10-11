import dataBase from '../ConectionDb/connectionDb.js'

class categoriaController {
    constructor(){}

    getAllCategories = (req,res,next) => {
        const  idUser = req.params.idUser;
        const ref = dataBase.ref('usuarios/' + idUser + '/categorias');
        
        ref.once("value", (snapshot) => {
            const categorias = snapshot.val() 
            res.send({ success: true, message: "Categorias encontradas", categorias });
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
            const result = dataBase.ref('usuarios/' + idUser + '/categorias').push(newCategorie);
            res.status(200).send("Categoria creada con exito")
        } catch{
            res.status(404).send({ success: false, result: "Categoria no fue creada" });
        }
    }
}

export default categoriaController