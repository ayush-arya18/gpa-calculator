const express = require('express');
const bodyParser = require('body-parser');
const _=require('lodash');
const mongoose =require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/userDB')
const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
});
const User=mongoose.model('User',userSchema);
const bcrypt=require('bcrypt');
const app=express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set( 'view engine', 'ejs' );
app.use(express.static("public"));

app.get( '/', function(req, res){
    res.render('login');
});
app.post("/",function(req,res){
    res.render('home');
});
app.post('/:userCustomRoute',async  (req,res)=>{
    var userRoute=_.capitalize(req.params.userCustomRoute);
    if(userRoute==="Login"){
        try{
            const {username,password}=req.body;
            User.findOne({username:username}).then(async found=>{
                if(!found){
                    res.render('fail',{reason:"incorrect username or password"});
                }
                else{
                    const passwordMatch=await bcrypt.compare(password,found.password);
                    if(!passwordMatch)
                        res.render('fail',{reason:"Wrong Password"});
                    else{
                        res.render('home');
                    }
                }
            });
        }catch(error){
            res.render( "fail", { reason : "authentication failed"});
        }
    }
    else if (userRoute==="Register")
        res.render('register');
    else if (userRoute==="Registeration"){
        User.findOne({username:req.body.username}).then(async found=>{
            if(!found){
                try {
                    const  username = req.body.username;
                    const password = req.body.password;
                    const hashedPassword = await bcrypt.hash(password, 10);
                    const user = new User({ username:username, password: hashedPassword });
                    await user.save();
                    res.render('home');
                } catch (error) {
                    res.render('fail',{reason:"Registeration failed"});
                }
            }
            else{
                res.render('fail',{reason:'Username already exists!'});
            }
        });
    }
    else if(userRoute==="Failure")
        res.redirect('/');
    else if (userRoute==="Sgpa")
        res.render('sgpa');
    else if(userRoute==="Cgpa")
        res.render('cgpa');
    else if(userRoute==="Phy")
        res.render('phy');
    else if(userRoute==="Chem")
        res.render('chem');
    else if(userRoute==="Third")
        res.render('third');
    else if(userRoute==="Fourth")
        res.render('fourth');
    else if(userRoute==="Fifth")
        res.render('fifth');
    else if(userRoute==="Sixth")
        res.render('sixth');
    else if(userRoute==="Seventh")
        res.render('seventh');
    else if(userRoute==="Eighth")
        res.render('eighth');
    else if(userRoute==="Calc_cgpa"){
        let sgpa=[parseFloat(req.body.fst_sem),
        parseFloat(req.body.snd_sem),
        parseFloat(req.body.trd_sem),
        parseFloat(req.body.frth_sem),
        parseFloat(req.body.fth_sem),
        parseFloat(req.body.sith_sem),
        parseFloat(req.body.seth_sem),
        parseFloat(req.body.eth_sem)];
        let sum=0;
        for(var i=0; i<8; i++){
            sum=sum+sgpa[i];
        }
        let cgpa=sum/8
        res.render('result',{grade:"cgpa" ,marks:cgpa} )  ;  
    }
    else if (userRoute==="Calc_sgpa"){
        let sub=[parseInt(req.body.first),
        parseInt(req.body.second),
        parseInt(req.body.third),
        parseInt(req.body.fourth),
        parseInt(req.body.fifth),
        parseInt(req.body.sixth),
        parseInt(req.body.seventh),
        parseInt(req.body.eighth),
        parseInt(req.body.nineth)];
        for (var i=0; i<9; i++){
            if(sub[i]>=90){
                sub[i]=10;
            }else{
                sub[i]=parseInt(sub[i]/10)+1;
            }
        }
        if(req.body.sem==1 || req.body.sem==2){
            let mul=(sub[0]*4)+(sub[1]*4)+(sub[2]*3)+(sub[3]*3)+(sub[4]*3)+(sub[5]*1)+(sub[6]*1)+(sub[7]*1);
            let sgpa=parseFloat((mul/20).toPrecision(3));
            res.render('result',{grade:"sgpa", marks:sgpa} );
        }
        else if(req.body.sem==3 || req.body.sem==4){
            let mul=(sub[0]*3)+(sub[1]*4)+(sub[2]*3)+(sub[3]*3)+(sub[4]*3)+(sub[5]*3)+(sub[6]*2)+(sub[7]*2)+(sub[8]*1);
            let sgpa=parseFloat((mul/24).toPrecision(3)); 
            res.render('result',{grade:"sgpa", marks:sgpa} );
        }else if (req.body.sem==5){
            let mul=(sub[0]*3)+(sub[1]*4)+(sub[2]*4)+(sub[3]*3)+(sub[4]*3)+(sub[5]*3)+(sub[6]*2)+(sub[7]*2)+(sub[8]*1);
            let sgpa=parseFloat((mul/25).toPrecision(3)); 
            res.render('result',{grade:"sgpa", marks:sgpa} );
        }
        else if (req.body.sem==6){
            let mul=(sub[0]*4)+(sub[1]*4)+(sub[2]*4)+(sub[3]*3)+(sub[4]*3)+(sub[5]*2)+(sub[6]*2)+(sub[7]*2);
            let sgpa=parseFloat((mul/24).toPrecision(3));
            res.render('result',{grade:"sgpa", marks:sgpa} );
        }
        else if(req.body.sem==7){
            let mul=(sub[0]*4)+(sub[1]*4)+(sub[2]*3)+(sub[3]*3)+(sub[4]*3)+(sub[5]*2)+(sub[6]*1);
            let sgpa=parseFloat((mul/20).toPrecision(3));
            res.render('result',{grade:"sgpa", marks:sgpa} );
        }
        else if(req.body.sem==8){
            let mul=(sub[0]*3)+(sub[1]*3)+(sub[2]*8)+(sub[3]*1)+(sub[4]*3);
            let sgpa=parseFloat((mul/18).toPrecision(3));
            res.render('result',{grade:"sgpa", marks:sgpa} );
        }
    }
});
app.listen(9000, function (){
    console.log("Server is running on port 9000");
});