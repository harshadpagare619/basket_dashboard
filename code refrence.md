Grocery app front end

//for product listing ref video - 37,38
//for product details page  ref video 39
//for search page functionality - ref video 51

//for backend - 
//in the backend server, make a file - user.js in the models. this file is for to store user details which are regiestered on the grocery web app
//inside this file 

const mongoose = require('mongoose');

const userSchema = mongoose.Schema ({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})

userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

userSchema.set('toJSON', {
    virtuals: true,
});

exports.User = mongoose.model('User', userSchema);
exports.userSchema = userSchema;

//install this pacakges - jwt, bcrypt

//in the .env file add this - 

JSON_WEB_TOKEN_SECRET_KEY = 'add anything here'

//now, we will make routes for this user schema
//in the routes file - make a file - user.js

const {User} = require('../models/user');
const express = require('express');
const router = require.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//creating api for user to signup

router.post('/signup', async (req, res) => {
    const {name, phone, email, password} = req.body;

    try {
        const existingUser = await User.findOne({email: email});

        if(existingUser) {
            res.status(400).json({msg: 'User already exist!'});
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const result = await User.create({
            name: name,
            phone: phone,
            email: email,
            password: hashPassword
        });

        const token  = jwt.sign({email: result.email, id:result._id}, process.env.JSON_WEB_TOKEN_SECRET_KEY);

        res.status(200).json({
            user: result,
            token:token
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({msg : 'Soemthing went wrong'});
    }
})

router.post('/signin', async(req, res) => {
    const {email, password} = req.body;

    try {
        const existingUser = await User.findOne({email: email});

        if(!existingUser) {
            res.status(404).json({msg: 'User not found!'})
        }

        const matchPassword = await bcrypt.compare(password, existingUser.password);

        if(!matchPassword) {
            return res.status(400).json({msg: 'Invalid credentials'})
        }

        const token = jwt.sign({email: existingUser.email, id: existingUser._id}, process.env.JSON_WEB_TOKEN_SECRET_KEY);

        res.status(200).json({
            user: existingUser,
            token: token,
            msg: 'User Authenticated'
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({msg: "something went wrong"})
    }
})

router.get('/', async(req, res) => {
    const userList = await User.find();

    if(!userList) {
        res.status(500).json({success: false})
    }
    res.send(userList);
})

router.get('/:id', async(req, res) => {
    const user = await User.findById(req.params.id);

    if(!user) {
        res.status(500).json({message: 'The user with the given ID was not found'})
    }

    res.status(200).send(user);
})

router.delete('/:id', async(req, res) => {
    User.findByIdAndDelete(req.params.id).then(user => {
        if(user) {
            return res.status(200).json({success: true, message: 'The user is deleted'})
        } else {
            return res.status(404).json({success: false, message: 'User not found'})
        }
    }).catch(err => {
        return res.status(500).json({success: false, error: err})
    })
})

// router.get('/get/count', async(req, res) => {
//     const userCount = await User.countDocuments((count) => count)

//     if(!userCount) {
//         res.status(500).json({success: false})
//     }
//     res.send({
//         userCount: userCount
//     });
// })

router.put('/:id', async(req, res) => {
    const {name, phone, email, password} = req.body;

    const userExist = await User.findById(req.params.id);

    let newPassword

    if(req.body.password) {
        newPassword = bcrypt.hashSync(req.body.password, 10)
    } else {
        newPassword = userExist.passwordHash;
    }

    const user = await User.findByIdAndUpdate(
        req.params.id,
        {
            name: name,
            phone: phone,
            email: email,
            password: newPassword
        },
        {new: true}
    )

    if(!user)
    return res.status(400).send('The user cannot be updated!')
    
    res.send(user);
})

module.exports = router;

//make a helper function to import jwt token. without this token user's information api won't work
//make a file by name - jwtHelper.js in any folder any routes (genrally in the utils folder)
//in the jwtHelper.js

var { expressjwt: jwt} = require('express-jwt');

function authJwt() {
    const secret = process.env.JSON_WEB_TOKEN_SECRET_KEY;
    return jwt({secret: secret, algorithms: ["HS256"]})
}

module.exports = authJwt


//in the app.js or index.js -

const authJwt = require('jwt helper file');

//middleware
app.use(authJwt());

//Routes
const userRoutes = require('./routes/user.js');

app.use('/api/user', userRoutes);


//in the front-end side dashboard signup page -in the main function add this

const [formFields, setFormFields] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    isAdmin: true
})

const history = useNavigate();

const context = useContext(MyContext);

useEffect(() => {
    context.setisHideSidebarAndHeader(true);
    window.scrollTo(0,0);
}, []);

const focusInput = (index) => {
    setInputIndex(index);
}

const onChangeInput = (e) => {
    setFormFields(() => (
        {
            ...formFields,
            [e.target.name]: e.target.value
        }
    ))
}

const signUp = (e) => {
    e.preventDefault();

    if(formFields.name === '') {
        context.setAlertBox({
            open: true,
            color: 'error',
            msg: 'please add name'
        })
        return false;
    }
    if(formFields.email === '') {
        context.setAlertBox({
            open: true,
            color: 'error',
            msg: 'please add email'
        })
        return false;
    }
    if(formFields.phone === '') {
        context.setAlertBox({
            open: true,
            color: 'error',
            msg: 'please add phone'
        })
        return false;
    }
    if(formFields.password === '') {
        context.setAlertBox({
            open: true,
            color: 'error',
            msg: 'please add password'
        })
        return false;
    }
    if(formFields.confirmPassword === '') {
        context.setAlertBox({
            open: true,
            color: 'error',
            msg: 'please add confirmPassword'
        })
        return false;
    }
    if(formFields.password === formFields.confirmPassword) {
        context.setAlertBox({
            open: true,
            color: 'error',
            msg: 'password is not matching'
        })
        return false;
    }

    postData('/api/user/signup', formFields).then((res) => {
        console.log(res);
    })

}

//then create input fields for form and wrap this under a form. in the form tag add this line - onSubmit={signUp}

<form onSubmit={signUp}>
    <div className={`form-group position-relative ${inputIndex === 0 && 'focus'}`}>
        <span className='icon'><FaUserCircle /></span>
        <input type="text" className='form-control' placeholder='Enter your name' onFocus={() => focusInput(0)} onBlur={() => setInputIndex(null)} autoFocus name="name" onChange={onChangeInput} />
    </div>
    <div className={`form-group position-relative ${inputIndex === 1 && 'focus'}`}>
        <span className='icon'><FaUserCircle /></span>
        <input type="text" className='form-control' placeholder='Enter your Email' onFocus={() => focusInput(0)} onBlur={() => setInputIndex(null)} autoFocus name="email" onChange={onChangeInput} />
    </div>
    <div className={`form-group position-relative ${inputIndex === 2 && 'focus'}`}>
        <span className='icon'><FaUserCircle /></span>
        <input type="text" className='form-control' placeholder='Enter your Phone' onFocus={() => focusInput(0)} onBlur={() => setInputIndex(null)} autoFocus name="phone" onChange={onChangeInput} />
    </div>
    <div className={`form-group position-relative ${inputIndex === 3 && 'focus'}`}>
        <span className='icon'><FaUserCircle /></span>
        <input type="text" className='form-control' placeholder='Enter your Password' onFocus={() => focusInput(0)} onBlur={() => setInputIndex(null)} autoFocus name="password" onChange={onChangeInput} />
        <span className='toggleShowPassword' onClick={() => setisShowPassword(!isShowPassword)}>
        {
            isShowPasswrod === true ? <IoMdEyeOff /> : <IoMdEye>
        }
        </span>
    </div>
    <div className={`form-group position-relative ${inputIndex === 4 && 'focus'}`}>
        <span className='icon'><FaUserCircle /></span>
        <input type="text" className='form-control' placeholder='Confirm Password' onFocus={() => focusInput(0)} onBlur={() => setInputIndex(null)} autoFocus name="confirmPassword" onChange={onChangeInput} />
        <span className='toggleShowPassword' onClick={() => setisShowPassword(!isShowPassword)}>
        {
            isShowPasswrod === true ? <IoMdEyeOff /> : <IoMdEye>
        }
        </span>
    </div>


    <FormControlLabel control={<Checkbox />} label="I agree to the all Terms & conditions" />

    <div className="form-group">
        <Button type="submit" className="btn-blue btn-lg btn-big w-100">Sign Up </Button>
    </div>
</form>    

<----------------------------- Login Page  --------------->

const context = useContext(MyContext);

cosnt [formFields, setFormFields] = useState({
    email: '',
    password: '',
    isAdmin: true
})

const onChangeInput = (e) => {
    setFormFields(() => (
        {
            ...formFields,
            [e.target.name] : e.target.value
        }
    ))
}


const signIn = (e) => {
    e.preventDefault();

    if(formFields.email ==='') {
        context.seetAlertBox({
            open: true, 
            color: 'error',
            msg: 'Email cannot be blank'
        })
        return false;
    }

    if(formFields.password === '') {
        context.setAlertBox({
            open: true,
            color: 'error',
            msg: 'Password cannot be blank'
        })
        return false;
    } 

    postData('/api/user/signin').then((res) => {

        try {

            localStorage.setItem('token', res.token);

            const user = {
                name: res.user?.name,
                email: res.user?.email,
                userId: res.user?.id
            }
            localStorage.setItem('user', JSON.stringify(user));

            context.setAlertBox({
            open: true,
            color: 'success',
            msg: 'User Login successfully'
        });

        setTimeout(() => {
            <!-- history('/dashboard'); -->

            window.location.href = '/dashboard'
        }, 2000)
        } catch (error) {
            console.log(error);
        }

        
    })
}



<form onSubmit={signIn}>
 //add fields same as sign up page form fields
</form>

//then we will hold the login credentials in a variable using useState hook. so based on the value in the constant we will know authorized user is logged in or not

// in Index.js or App.js

const [user, setUser] = useState({
    name: '',
    email: '',
    userId: ''
})

const values ={
    user, //add this value in the existing values constant
    setUser,
}

useEffect(() => {
    const token = localStorage.getItem('token');

    if(token!==null && token !=="") {
        setIsLogin(true);

        const userData = JSON.parse(localStorage.getItem("user"));

        setUser(userData);

    } else {
        setIsLogin(false);
    }
}, [isLogin])


//in the header component, we will make changes in the user info section where we show users information. if it is no there thene add this 

<div className="myAccWrapper">
<Button className="myAcc d-flex align-items-center" onClick={handleOpenMyAccDrop}>
    <div className="userImg">
    <span className="rounded-circle">
        {context.user?.name?.charAt(0)}
    </span>
    </div>

    <div className="userInfo">
        <h4>{context.user?.name}</h4>
        <p className="mb-0">user name</p>
    </div>
</Button>

</div>

//here on clicking on the user a dropdown menu is open. in that menu options there is one option to logout, we will create a functionality for it and make it actual workable

<MenuItem onclik={logout}>
    <ListItemIcon>
        <Logout fontSize="small' />
    </ListItemIcon>
        Log Out
</MenuItem>    

const history = useNavigate();

const logout= () => {
    localStorage.clear();

    setTimeout(() => {
        history('/login');
    }, 2000);
}

<----------------------------- Grocery web site Sign up page page ---------------------->

//in the main function

const context = useContext(MyContext);
const [isLoading, setIsLoading] = useState(false);

cosnt [formFields, setFormFields] = useState ({
    name: '',
    phone: '',
    email:'',
    password: ''
})

useEffect(() => {
    context.setIsHeaderFooterShow(false);
}, [])

const onChangeInput = (e) => {
    setFormFields(() => (
        {
            ...formFields,
            [e.target.name]: e.target.value
        }
    ))
}

const signup = () => {
    //copy from previous signup function and make changes as per need
}

<-------------------------------- Firebase Authentication -------------------------------------------------->

Go to Firebase.com -> Login using google account or use crendentials signup or login -> go to console

in the console dashbord click on the new project button, to start a new project, name the project as per your need and select the options as per requirement and create the project. it will take few minutes to set-up the project in the firebase

once the project is created it will take you to the project dashboard

on the dashboard, select the medium of your project (androis, ios or web)

when you select the medium, it will ask you to give your project name based on the medium, give the project name and register the product
next it will redirect you to the code blocks to use based on the medium you have selected

for this webapp, we need to install the firebase package to enable it's function and featutres
install firebase - npm install firebase

now make a file in the src folder - firebase.js and copy the code provided by the firebase after the project registration

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDM0O-4BipcrfeGZswDeW2wNRE8nTv9qAg",
  authDomain: "basket-grocery-webapp.firebaseapp.com",
  projectId: "basket-grocery-webapp",
  storageBucket: "basket-grocery-webapp.firebasestorage.app",
  messagingSenderId: "218590327753",
  appId: "1:218590327753:web:a95824aaec0bfbcf9f6e18"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

in the .env file add this firbase configuration (optional) -

VITE_FIREBASE_API_KEY = AIzaSyDM0O-4BipcrfeGZswDeW2wNRE8nTv9qAg
VITE_FIREBASE_AUTH_DOMAIN = basket-grocery-webapp.firebaseapp.com
VITE_FIREBASE_PROJECT_ID = basket-grocery-webapp
VITE_FIREBASE_STORAGE_BUCKET = basket-grocery-webapp.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID = 218590327753
VITE_FIREBASE_APP_ID = 1:218590327753:web:a95824aaec0bfbcf9f6e18

//in the grocery webapp side, we will add this authentication method
//in the SignIn/Login page

import {initializeApp} from "firebase/app"
import {getAuth, signInWithPopup, GoogleAuthProvider} from "firebase/auth";
import {firebase} from "../../firebase"

const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthprovider();

//provide a google login button in the login page/popup, later on we will add a function to it so firebase authentication service will run

button ui - 
<Button
className="loginWithGoogle mt-2"
variant="outlined"
onClick={signInWithGoogle}
>
    <img src={GoogleImg} />Sign In with Google
</Button>

const signInWithGoogle = () => {
    signInWithPopup(auth, googleProvider)
    .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        //The signed-in user info
        const user = result.user;

        const fields = {
            name:user.providerData[0].displayName,
            email:user.providerData[0].email,
            password:null,
            images:user.providerData[0].photoURL,
            phone:user.providerData[0].phoneNumber
        };

        postData("/api/user/authWithGoogle", fields).then((res) => {
            try {
                if(res.error !== true) {
                    localStorage.setItem("token", res.token);

                    const user = {
                        name: res.user?.name,
                        email: res.user?.email,
                        userId: res.user?.id,
                    };

                    localStorage.setItem("user", JSON.stringify(user));

                    context.setAlertBox({
                        open:true,
                        color: "success",
                        msg: res.msg,
                    });

                    setTimeout(() => {
                        setIsLoading(false);
                        window.location.href = "/";
                    }, 2000);
                } else {
                    context.setAlertBox({
                        open: true,
                        color: "error",
                        msg: res.msg
                    });
                    setIsLoading(false);
                }
            } catch (error) {
                console.log(error);
                setIsLoading(false);
            }
        });

        context.setAlertBox({
            open : true,
            color: "success",
            msg: "User Authentication Successfully!'
        });
    })
    .catch((error) => {
        //Handle Error here
        const errorCode = error.code;
        const errorMessage = error.message;
        //The email of the user's account used
        const email = error.customData.email;
        //The AuthCredential tye that was used
        const credential = GoogleAuthProvider.credentialFromError(error);
        context.setAlertBox({
            open: true,
            color: "error",
            msg: errorMessage,
        });

    });
};
 

//in user routes file (in the server backend), we need to add routes to work with firebase auth service

router.post('/authWithGoogle', async(req, res) => {
    const {name, phone, email, password, images} = req.body;

    try {
        const existingUser = await User.findOne({email: email});

        if(!existingUser) {
            const result = await User.create({
                name:name,
                phone:phone,
                email:email,
                password:password,
                images:images,
            });

            const token = jwt.sign({email:result.email, id:result._id}, process.env.JSON_WEB_TOKEN_SECRET_KEY);

            return res.status(200).send({
                user.result,
                token: token,
                msg:'User Login Successfully!'
            })
        }
        else {
            const existingUser = await User.findOne({email: email});
            const token = jwt.sign({email:existingUser.email, id:existingUser._id}, process.env.JSON_WEB_TOKEN_SECRET_KEY);

            return res.status(200).send({
                user:existingUser,
                token:token,
                msg:'User Login Successfully!'
            })
        }
    } catch (error){
        console.log(error);
    }
})

//Creating Firebase auth functionality for SignUp page

in the SignUp page of grocery app

import {getAuth, signInWithPopup, GoogleAuthProvider} from 'firebase/auth';
import {firebaseApp} from '../../firebase';

const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();

copy and paste signInWithGoogle function from login




<---------------------------------- Cart Functionality including backend and frontend --------------------------------------------------->

//in the server site, make a schema file - cart.js in the models folder. in this file we will declare the which fields we want in our cart functionality

const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
    productTitle: {
        name: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    },
    subTotal: {
        type: Number,
        required: true
    },
    productId: {
        type: String,
        required : true
    },
    userId: {
        type: String,
        required: true
    }
})

cartSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

cartSchema.set('toJSON', {
    virtuals: true,
});

exports.Cart = mongoose.model('Cart', cartSchema);
exports.cartSchema = cartSchema;


//make routes for cart - make afile cart.js in routes folder

const {Cart} = require('../models/cart);
const express= require('express');
const router = express.Router();

router.get('/', async(req, res) => {
    try {
        const cartList = await Cart.find(req.query);

        if(!cartList) {
            res.status(500).json({success: false})
        }

        return res.status(200).json(cartList);
    } catch (error){
        res.status(500).json({success: false})
    }
});

router.post('/add', async(req, res) => {
    let cartList = new Cart({
        productTitle: req.body.productTitle,
        image: req.body.image,
        price: req.body.price,
        quantity: req.body.quantity,
        subTotal: req.body.subTotal,
        productId: req.body.productId,
        userId: req.body.userId,
    });

    if(!cartList) {
        res.status(500).json({
            error: err,
            success: false
        })
    }

    cartList = await cartList.save();

    res.status(201).json(cartList);
});

router.delete('/:id', async(req, res) => {
    const cartItem  = await Cart.findById(req.params.id);

    if(!cartItem) {
        res.status(404).json({msg: 'The cart item given id is not found'})
    }

    const deletedItem = await Cart.findByIdAndDelete(req.params.id);

    if(!deletedItem) {
        res.status(404).json({
            message: 'Cart item not found',
            success: false
        })
    }

    res.status(200).json({
        success: true,
        message: 'Cart item deleted!'
    })
})


router.put('/:id', async(req, res) => {
    const cartList = await Cart.findByIdAndUpdate(
        req.params.id,
        {
        productTitle: req.body.productTitle,
        image: req.body.image,
        price: req.body.price,
        quantity: req.body.quantity,
        subTotal: req.body.subTotal,
        productId: req.body.productId,
        userId: req.body.userId,
        },
        {new: true}
    )

    if(!cartList) {
        return res.status(500).json({
            message: 'Cart cannot be update',
            success: false
        })
    }
})


//once the routes are done, go to main index.js or app.js in the server and add routes in this file

const cart = require('./routes/cart.js');

app.use(`'/api/cart', cart);

//for the grocery app front end- we will create a global function to add products in the cart based on the product id

//in the product details page or the places where product will be add to the cart button will display - 

const addtoCart = (data) => {
    context.addToCart(data);
}

//in the grocery app, where add to cart button is shown - 

<Button className='btn-blue btn-lg btn-big btn-round bg-red' onClick={() => addtoCart(productData)}>


//make global function to add products in the cart, in the app.js

const [cartData, setCartData] = useState([]);

const addToCart=(data) - > {
    postData(`/api/cart`);
}

//now we will pass these values in the values variable so we can access it throughout the app

const values = {
    addToCart,
    cartData,
    setCartData
}

//when user clicks on the add to cart button, we will pass the data through the addToCart function. when the data is passed, we need to hold it in a variable, which we will do by creating a variable - cartFields, and handle this variable using useState hook in an object form

let [cartFields, setCartFields] = useState({})

//to pass the  data in this variable we need to make changes in the function

const addToCart = (data) => {
    console.log(data);   //to cross-check if we are getting product details or not
}

//once we get confirmation about getting the data, then make changes in the addToCart functionality

const addToCart = (data) => {
    const user = JSON.parse(localStorage.getItem('user'));

    cartFields.productTitle = dat?.name
    cartFields.image = dat?.images[0]
    cartFields.price = dat?.newPrice
    cartFields.quantity = 1
    cartFields.subTotal = (cartFields.price) * (cartFields.quantity) // or just simply put 0 for time being
    cartFields.productId = dat?.id
    cartFields.userId = user?.userId
    
    console.log(cartFields);
}


//in the product details page 
let [cartFields, setCartFields] = useState({});

const addtoCart = (data) => {
    const user = JSON.parse(localStorage.getItem('user'));

    cartFields.productTitle = productData?.name
    cartFields.image = productData?.images[0]
    cartFields.price = productData?.newPrice
    cartFields.quantity = 1
    cartFields.subTotal = (cartFields.price) * (cartFields.quantity)
    cartFields.productId = productData?.id
    cartFields.userId = user?.userId
    
    context.addToCart(cartFields);
}

//in the place of quantity box in the product details page

<QuantityBox quantity={quantity} />

//in the QuantityBox component

const QuantityBox = (props) => {

useEffect(() => {
    props.quantity(inputVal);

}, [inputVal]);



}

//in product details page

let [productQuantity, setProductQuantity] = useState();

const quantity = (val) => {
    setProductQuantity(val);
}

//make changes in addtoCart function - 

const addtoCart = (data) => {
    cartFields.quantity = productQuantity
    cartFields.subTotal = parseInt(productData?.price * productQuantity)
}

//in main app.jsx

const addToCart = (data) => {
    console.log(data);
    postData(`/api/cart/add`, data).then((res) => {
        if(res!==null && res!==undefined && res!== '') {
            setAlertBox({
                open: true,
                color: 'success',
                msg: 'Item is added in the cart'
            })
        }
    })
}

 <-------------------------------------- Payment Integration ------------------------------->

 //make a new page in the grocery app -> make a folder - Checkout and make a file inside it -> Checkout.jsx

 //in the main app.jsx, make routes for this file

 <Routes>
    <Route exact={true} path="/checkout" element={<Checkout />} />
 </Routes>


//in the Checkout.jsx
// ui codes

import TextField from '@mui/material/TextField';

<section classNAme="section">
    <div className='container'>
        <form>
        <div className='row'>
            <div className="col-md-8">
                <h2 className="hd">BILLING DETAILS</h2>

                <div className="row mt-3">
                <div className="col-md-4">
                    <div className="form-group">
                    <TextField  label="Full Name" variant="outlined">
                    </div>
                </div> 
                </div>
            </div>

            <div className="col-md-4">
                <div className="card orderInfo">
                    <h4 className="hd">Your Order</h4>
                    <div className="table-responsive mt-3">
                        <table className="table table-borderless">
                            <thead>
                            <tr>
                                <th>Product</th>
                                <th>SubTotal</th>
                            </tr>
                            </thead>

                            <tbody>
                            <tr>
                            <td>All Natural Italian-style Chicken meatballs
                            <b>x1</b>
                            </td>
                            <td>$7.25</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
        </form>
    </div>
</section>
 

 //css for checkout page

 .orderinfo {
    background: #fafafa !important;
    padding: 25px !important;
 }

 .orderInfo thead {
    border-top: 1px solid rgba(0,0,0,0.1) !important;
    border-bottom: 1px solid rgba(0,0,0,0.1) !important;
 }

//in this checkout page, create a formFields variable to hold valuse from the address form and save it to later use on fro the checkout process

const [formFields, setFormFields] = useState({
    fullName: '',
    addressLine1: '',
    addrrssLine2: '',   //mentioned the fields as per  custom form designed
})

const onChangeInput = (e) => {
    setFormFields(() => (
        {
            ...formFields,
            [e.target.name]: e.target.value
        }
    ))
}

//onChangeInput function to handle and monitor changes in the input fields, as will it will put the value from this input fields into formFields object


<!---------------------------- Adding Razor Pay functionality ----------------------> 

//in the index.html, add this script tag in the end of body tag

<script src="https://checkout.razorpay.com/v1/checkout.js" > </script>

//make account on razor pay, set up account with necessary information.
//in the dashboard go to the account settings -> api keys -> generate new (if no key available)

//copy this keys in .env file

VITE_RAZORPAY_KEY_ID = rzp_test_eH5lphGxi8cyNH
VITE_RAZORPAY_KEY_SECRET = NkwrDNO4A5tNv91T15vD1oPD

//while creating the checkout page, if we have created any form to collect the address information of the user for delivery of the products, make a function, assign this function to form tag and add these variables/function inside that function

//in this case, checkout page is the page where user can fill the address details. and the address information is saved in the variable using a function named as - Checkout. inside this function below all the validations and posting/fetching methods

const addressInfo = {
    name: formFields.fullName,
    phoneNumber: formFields.phoneNumber,
    address: formFields.streetAddressLine1 + formFields.streetAddressLine2,
    pincode: formFields:zipCode,
    date: new Date().toLocaleString(
        "en-US",
        {
            month: "short",
            day:"2-digit",
            year: "numeric",
        }
    )
}

var options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    key_secret: import.meta.ent.VITE_RAZORPAY_KEY_SECRET,
    amount: parsInt(cartData.length !== 0 && 
        cartData.map(item => parseInt(item.price) * item.quantity).reduce((total, valu) => total + value, 0)
    ),
    currency: "INR",
    order_receipt: 'order_rcptid_' + formFields.fullName,
    name: 'E-Bharat',
    description: 'for testing purpose',
    handler: function (response) {
        console.log(response);

        const paymentId = response.razorpay_payment_id

        const user = JSON.parse(localStorage.getItem("user"));

        const payLoad = {
            data: {
                name: addressInfo.name,
                phoneNumber: formFields.phoneNumber,
                address: formFields.address,
                pincode: formFields.pincode,
                amount: parseInt(cartData.length !== 0 && 
                cartData.map(item => parseInt(item.price) * item.quantity).reduce((total, valu) => total + value, 0)),
                paymentId: paymentId,
                email: user.email,
                userid: user.userId,
                products: cartData,
                data: new Date().toLocaleString(
                    "en-US",
                    {
                        months: "short",
                        day: "2-digit",
                        year: "numeric",
                    }
                )
            }
        }

        postData(`/api/orders`, payLoad).then(res => {
            router.push('/')
        })
    },
    theme: {
        color: '#3399cc'
    }
};

var pay = new window.Razorpay(options);
pay.open();

//once we recieved the payment confirmation on the front-end we need to store the successful orders data in the database.
//for this we will create schema for orders and routes for it. once the order details are stored in the database, user can see the orders details in his account and track the process of orders like pending, delivery etc

//in the server backend, first create a schema in the models forlder - orders.js

const mongoose = require('mongoose');

cosnt orderSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    pincode: {
        type: String,
        required: true
    },
    amount: {
        type: String,
        required: true
    },
    paymentId: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    userid: {
        type: String,
        required: true
    },
    products: [
        {
            productId: {
                type: String,
            },
            productTitle: {
                type: String
            },
            qunatity: {
                type: Number
            },
            price: {
                type: Number
            },
            image: {
                type: String,
            },
            subTotal:{ 
                type: String
            }
        }
    ],
    status: {
        type: String,
        default: "pending"
    },
    date: {
        type: Date,
        default: Date.now,
    },

})

orderSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

orderSchema.set('toJSON', {
    virtuals: true,
});

exports.Order = mongoose.model('Order', orderSchema);
exports.orderSchema = orderSchema;


//make routes for order
//make a file orders.js in routes folder

const {Order} = require('../models/order');
const express = require('express');
const router = express.Router();

router.post('/create', async(req, res) => {

    let order = new Order({
        name: req.body.name,
        phoneNumber: req.body.phoneNumber,
        address: req.body.address,
        pincode: req.body.pincode,
        amount: req.body.amount,
        paymentId: req.body.paymentId,
        email: req.body.email,
        userid: req.body.userid,
        products: req.body.products,

    });

    if(!order) {
        res.status(500).json({
            error: err,
            success: false
        })
    }

    order = await order.save();

    res.status(201).json(order);
});




// in the main index.js add routes for orders

//Routes
const orderSchema = require('./routes/order.js');

app.use(`/api/order`, orderSchema);


<--------------------- Order Page --------------------->

//in the main app.jsx
//make a route for the Order page

<Routes>
    <Route exact={true} path="/account/orders" element={<Orders />}>
</Routes>

//make a file in the pages for orders - Orders(folder) -> Orders.jsx


import React from 'react';

const Orders = () => {

    const [orders, setOrders] = useState([]);

    useEffect(() => {
        window.scrollTo(0,0);

        fetchDataFromApi("/api/orders").then((res) => {
            setOreders(res);
        })
     }, []);

    return (
        <section className="section">
            <div className="container">
                <h2 className="hd">Orders</h2>

                <div className="table-responsive">
                    <table className="table table-striped">
                        <thead classNme="thead-dark">
                            <tr>
                                <th>Payment Id</th>
                                <th>Name</th>
                                <th>Phone Number</th>
                                <th>Address</th>
                                <th>Pincode</th>
                                <th>Total Amount</th>
                                <th>Email</th>
                                <th>User Id</th>
                                <th>Date</th>

                            </tr>
                        </thead>

                        <tbody>
                        {
                            orders?.ordersList?.length !==0 && orders.ordersList?.map(orders, index) => {
                                return (
                                <tr key={index}>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                </tr>
                                )
                            }
                        }
                           
                        </tobody>
                    </table>    
                </div>
            </div>    
        </section>
    )
}

export default Orders;


// Old UserSLice

import {createSlice} from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        isLoggedIn: false,
        userData: null
    },
    reducers: {
        login: (state, action) => {
            state.isLoggedIn = true;
            state.userData = action.payload;
        },
        logout: (state) => {
            state.isLoggedIn = false;
            state.userData = null;
        },
    },
});

export const {login, logout} = userSlice.actions;
export default userSlice.reducer;


// new userslice

import { createSlice } from '@reduxjs/toolkit';
import { loginUser, signupUser } from './userActions';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    isLoggedIn: !!localStorage.getItem('user'),
    userData: JSON.parse(localStorage.getItem('user')) || null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('user');
      state.isLoggedIn = false;
      state.userData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn = true;
        state.userData = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn = true;
        state.userData = action.payload;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;


// useraction slice

import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = 'http://localhost:4000/api/users'; // adjust if needed

export const loginUser = createAsyncThunk('user/login', async (formData, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${API}/signin`, formData);
    localStorage.setItem('user', JSON.stringify(res.data));
    return res.data;
  } catch (error) {
    return rejectWithValue(error.response.data.msg);
  }
});

export const signupUser = createAsyncThunk('user/signup', async (formData, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${API}/signup`, formData);
    localStorage.setItem('user', JSON.stringify(res.data));
    return res.data;
  } catch (error) {
    return rejectWithValue(error.response.data.msg);
  }
});


// Old Login page


import {useEffect} from 'react';
import { useDispatch } from 'react-redux';
import {Link} from 'react-router-dom';
import { setHideHeaderFooter } from '../../features/UI/uiSlice';
import Button from '@mui/material/Button';
import { FcGoogle } from "react-icons/fc";

function Login() {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setHideHeaderFooter(true));

    return () => dispatch(setHideHeaderFooter(false));
  }, [dispatch]);
  
  return (
   <div className='signInPage'>

    <div className='background-svg'>
      <svg
  id="wave"
  style={{ transform: "rotate(180deg)", transition: "0.3s" }}
  viewBox="0 0 1440 490"
  xmlns="http://www.w3.org/2000/svg"
>
  <defs>
    <linearGradient id="sw-gradient-0" x1="0" x2="0" y1="1" y2="0">
      <stop stopColor="rgba(2, 138, 15, 1)" offset="0%" />
      <stop stopColor="rgba(1, 112, 11, 1)" offset="100%" />
    </linearGradient>
  </defs>
  <path
    style={{ transform: "translate(0, 0px)", opacity: 1 }}
    fill="url(#sw-gradient-0)"
    d="M0,441L40,408.3C80,376,160,310,240,294C320,278,400,310,480,285.8C560,261,640,180,720,196C800,212,880,327,960,367.5C1040,408,1120,376,1200,343C1280,310,1360,278,1440,228.7C1520,180,1600,114,1680,73.5C1760,33,1840,16,1920,65.3C2000,114,2080,229,2160,277.7C2240,327,2320,310,2400,326.7C2480,343,2560,392,2640,416.5C2720,441,2800,441,2880,400.2C2960,359,3040,278,3120,236.8C3200,196,3280,196,3360,236.8C3440,278,3520,359,3600,343C3680,327,3760,212,3840,147C3920,82,4000,65,4080,122.5C4160,180,4240,310,4320,367.5C4400,425,4480,408,4560,359.3C4640,310,4720,229,4800,196C4880,163,4960,180,5040,220.5C5120,261,5200,327,5280,326.7C5360,327,5440,261,5520,253.2C5600,245,5680,294,5720,318.5L5760,343L5760,490L5720,490C5680,490,5600,490,5520,490C5440,490,5360,490,5280,490C5200,490,5120,490,5040,490C4960,490,4880,490,4800,490C4720,490,4640,490,4560,490C4480,490,4400,490,4320,490C4240,490,4160,490,4080,490C4000,490,3920,490,3840,490C3760,490,3680,490,3600,490C3520,490,3440,490,3360,490C3280,490,3200,490,3120,490C3040,490,2960,490,2880,490C2800,490,2720,490,2640,490C2560,490,2480,490,2400,490C2320,490,2240,490,2160,490C2080,490,2000,490,1920,490C1840,490,1760,490,1680,490C1600,490,1520,490,1440,490C1360,490,1280,490,1200,490C1120,490,1040,490,960,490C880,490,800,490,720,490C640,490,560,490,480,490C400,490,320,490,240,490C160,490,80,490,40,490L0,490Z"
  />
</svg>
    </div>


    <div className='loginSection'>
      <div className='card p-3 shadow border-0 loginCard'>
        <div className='text-center storeLogo mt-2 mb-2'> 
          <img src="https://mironcoder-hotash.netlify.app/images/logo.webp" />
        </div>

        <form className='mt-3 mb-3 loginForm'>

          <div className='text-center cardText'>
          <h4>Welcome Back</h4>
            <p>Enter your email and password to access your account</p>
          </div>

          <div className='form-group mt-2'>
            <h6>Email</h6>
            <input type="text" placeholder='Enter your email'/>
          </div>

          <div className='form-group '>
            <h6>Password</h6>
            <input type="password" placeholder='Enter your password'/>
          </div>

          {/* <Button className='w-100 mt-1 mb-1'>Sign In</Button>
          <Button className='w-100 mt-1 mb-1'>Sign In with google</Button> */}
          

          <button className='p-2 mt-2 mb-2 w-100 signInbtn'>Sign In</button>
          <button className='p-2 mt-2 mb-2 w-100 googleSignInBtn'><FcGoogle className='mr-2'/>Sign In with google</button>
          

          <div className='bottomMsg mt-2'>
          <p className='text-center'>Dont' have an account? <Link to="/register" className='border-effect'>Sign Up</Link></p>
          </div>
          
        </form>
      </div>
    </div>

   </div>
  )
}

export default Login



// new login page

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { loginUser } from '../../features/user/userActions';
import { setHideHeaderFooter } from '../../features/UI/uiSlice';
import { FcGoogle } from "react-icons/fc";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { isLoggedIn, loading, error } = useSelector((state) => state.user);
  const redirect = location.state?.from || '/';

  useEffect(() => {
    dispatch(setHideHeaderFooter(true));
    return () => dispatch(setHideHeaderFooter(false));
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }))
      .unwrap()
      .then(() => navigate(redirect))
      .catch((err) => alert(err));
  };

  return (
    <div className='signInPage'>
      {/* ... your SVG and layout ... */}
      <form className='mt-3 mb-3 loginForm' onSubmit={handleSubmit}>
        <div className='form-group mt-2'>
          <h6>Email</h6>
          <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Enter your email' />
        </div>
        <div className='form-group'>
          <h6>Password</h6>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Enter your password' />
        </div>
        <button type="submit" className='p-2 mt-2 mb-2 w-100 signInbtn' disabled={loading}>Sign In</button>
        <button className='p-2 mt-2 mb-2 w-100 googleSignInBtn'><FcGoogle className='mr-2' />Sign In with Google</button>
        <p className='text-danger text-center'>{error}</p>
        <div className='bottomMsg mt-2'>
          <p className='text-center'>Don't have an account? <Link to="/register" className='border-effect'>Sign Up</Link></p>
        </div>
      </form>
    </div>
  );
}

export default Login;