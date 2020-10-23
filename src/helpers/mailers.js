const nodemailer=require('nodemailer')
let transporter=nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:'annoyancehannibal@gmail.com',
        pass:'kknwylrknrwxjvvr'
    },
    tls:{
        rejectUnauthorized:false
    }
})

module.exports=transporter