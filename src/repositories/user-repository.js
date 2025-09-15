const CrudRepository=require('./crud-repository')
const {prisma}=require('../config')

class UserRepository extends CrudRepository{
    constructor(){
        super(prisma.user)
    }
}