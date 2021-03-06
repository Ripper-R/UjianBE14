const {db}=require('../connections')
const {uploader}=require('./../helpers/uploader')
const fs=require('fs')
const { isFunction } = require('util')

module.exports={
    AddProduct:(req,res)=>{
        try {
            const path='/product'//ini terserah
            const upload=uploader(path,'PROD').fields([{ name: 'image'}])
            upload(req,res,(err)=>{
                if(err){
                    return res.status(500).json({ message: 'Upload picture failed !', error: err.message });
                }
                console.log('berhasil upload')
                console.log(req.files)
                const {image} = req.files;
                console.log(image)
                // console.log(robin)
                const imagePath = image ? path + '/' + image[0].filename : null;
                console.log(imagePath)
                console.log(req.body.data)
                const data = JSON.parse(req.body.data); 
                let datainsert={
                    namaproduct:data.namaproduct,
                    capacity:data.capacity,
                    harga:data.harga,
                    banner:imagePath,
                    deskripsi:data.deskripsi,
                    tanggalmulai:data.tanggalmulai,
                    tanggalberakhir:data.tanggalberakhir
                }
                // data.banner=imagePath
                console.log(datainsert)
                // res.send('berhasil')
                db.query('insert into product set ?',datainsert,(err)=>{
                    if (err){
                        if(imagePath){
                            fs.unlinkSync('./public'+imagePath)
                        }
                        return res.status(500).send(err)
                    }
                    let sql=`select * from product`
                    db.query(sql,(err,dataproduct)=>{
                        if (err) return res.status(500).send(err)
                        return res.status(200).send(dataproduct)
                    })
                })
            })
        } catch (error) {
            return res.status(500).send(error)
        }
    },
    getProduct:(req,res)=>{
        let sql=`select * from product `
        db.query(sql,(err,dataproduct)=>{
            if (err) return res.status(500).send(err)
            return res.status(200).send(dataproduct)
        })
    },
    Addproductfoto:(req,res)=>{
        try {
            const path='/product/foto'//ini terserah
            const upload=uploader(path,'FOTOPROD').fields([{ name: 'image'}])
            upload(req,res,(err)=>{
                if(err){
                    return res.status(500).json({ message: 'Upload picture failed !', error: err.message });
                }
                console.log('berhasil upload')
                console.log(req.files)
                const {image} = req.files;
                console.log(image)
                // console.log(robin)
                const datamany=[]
                const data = JSON.parse(req.body.data); 
                
                // console.log(imagePaths)
                console.log(data,'data')
                let imagePath
                image.forEach(val=>{
                    imagePath =  path + '/' + val.filename
                    datamany.push([imagePath,data.product_id])
                })
                // const imagePath = image ? path + '/' + image[0].filename : null;
                // res.send('berhasil')
                console.log(datamany)
                db.query('insert into productfoto (gambar,product_id) VALUES ?',[datamany],(err)=>{
                    if (err){
                        // kalo insert gagal hapus foto
                        image.forEach(val=>{
                            imagePath =  path + '/' + val.filename
                            fs.unlinkSync('./public'+ imagePath)
                        })
                        console.log(err)
                        return res.status(500).send(err)
                    }
                    return res.status(200).send('success')
                    // let sql=`select * from product`
                    // db.query(sql,(err,dataproduct)=>{
                    //     if (err) return res.status(500).send(err)
                    // })
                })
            })
        } catch (error) {
            return res.status(500).send(error)
        }
    },
    getProductsdetails:(req,res)=>{
        const {id}=req.params
        let sql=`select * from product where id=?`
        db.query(sql,id,(err,dataprod)=>{
            if (err){
                return res.status(500).send(err.message)
            }
            sql=`select * from  productfoto where product_id=?`
            db.query(sql,id,(err,datafoto)=>{
                if (err){
                    return res.status(500).send(err.message)
                }
                return res.status(200).send({dataprod:dataprod[0],datafoto})
            })
        })
    },
    getpendapatan:(req,res)=>{
        let sql=`select count(*), sum(quantity*hargabeli) as pendapatan
        from transaksi
        where status='Finished'`
        db.query(sql,(err,results)=>{
            if(err){
                return res.status(500).send(err.message)
            }
            return res.status(200).send(results)
        })
    },
    getpotensial:(req,res)=>{
        let sql=`select count(*) ,sum(quantity*hargabeli*0.1) as potensial
        from transaksi`
        db.query(sql,(err,results)=>{
            if(err){
                return res.status(500).send(err.message)
            }
            return res.status(200).send(results)
        })
    },
    getpenjualterbaik:(req,res)=>{
        let sql=`select *
        from transaksi 
        where status='Finished'`
        db.query(sql,(err,results)=>{
            if(err){
                return res.status(500).send(err.message)
            }
            return res.status(200).send(results)
            
        })
    },
    getcategoryterbaik:(req,res)=>{
        let sql=`select *
        from products p
        join category_products cp
        on p.categoryprodid=cp.id
        join transaksi tr
        where status='Finished'
        group by cp.namacategory`
        db.query(sql,(err,results)=>{
            if(err){
                return res.status(500).send(err.message)
            }
            return res.status(200).send(results)
        })
    },
    getbukanpenjual:(req,res)=>{
        let sql=`select *
        from penjual pe
        right join users u
        on pe.userid=u.id`
        db.query(sql,(err,results)=>{
            if(err){
                return res.status(500).send(err.message)
            }
            return res.status(200).send(results)
        })
    },
    //nomor 3
    getbestproduct:(req,res)=>{
        let sql=`select namatoko,nama 
        from products p
        join penjual pe
        where p.penjualid=pe.id
        group by penjualid`
        db.query(sql,(err,results)=>{
            if(err){
                return res.status(500).send(err.message)
            }
            return res.status(200).send(results)
        })
    }

}
