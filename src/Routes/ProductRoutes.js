const Router=require('express').Router()
const {ProductContrrollers}=require('./../controllers')
// const {auth}=require('./../helpers/Auth')

Router.post('/Addproduct',ProductContrrollers.AddProduct)
Router.post('/Addproductfoto',ProductContrrollers.Addproductfoto)
Router.get('/getproduct',ProductContrrollers.getProduct)
Router.get('/getproduct/:id',ProductContrrollers.getProductsdetails)
Router.get('/getpendapatan',ProductContrrollers.getpendapatan)
Router.get('/getpotensial',ProductContrrollers.getpotensial)
Router.get('/getpenjualterbaik',ProductContrrollers.getpenjualterbaik)
Router.get('/getcategoryterbaik',ProductContrrollers.getcategoryterbaik)
Router.get('/getbukanpenjual',ProductContrrollers.getbukanpenjual)
Router.get('/getbestprod',ProductContrrollers.getbestproduct)


// cannot get||post||put||delete artinya endpointnya belum adaa
module.exports=Router