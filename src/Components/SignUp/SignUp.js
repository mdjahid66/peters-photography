
import React, { useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useCreateUserWithEmailAndPassword, useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import auth from '../../firebase.init';
import SocialLogin from '../SocialLogin/SocialLogin';


const SignUp = () => {
    const [userInfo, setUserInfo] = useState({
        email: '',
        password: '',
        confirmPass: "",
    });
    const [errors, setErrors] = useState({
        emailError: '',
        passwordError: '',
        generalError: '',
    })

    const [
        createUserWithEmailAndPassword,
        user,
        loading,
        hookError,
    ] = useCreateUserWithEmailAndPassword(auth, { sendEmailVerification: true });

    const handleEmailChange = (event) => {
        const emailRegex = /\S+@\S+\.\S+/;
        const validEmail = emailRegex.test(event.target.value);
        if (validEmail) {
            setUserInfo({ ...userInfo, email: event.target.value });
            setErrors({ ...errors, emailError: '' });
        }
        else {
            setErrors({ ...errors, emailError: 'Invalid email' });
            setUserInfo({ ...userInfo, email: '' });
        }
    }

    const passwordChange = (event) => {
        const passRegex = /.{6,}/;
        const validPass = passRegex.test(event.target.value);

        if (validPass) {
            setUserInfo({ ...userInfo, password: event.target.value });
            setErrors({ ...errors, passwordError: '' });
        }
        else {
            setErrors({ ...errors, passwordError: 'Password must be at least 6 characters' });
        }
    }
    const confirmPasswordChange = (event) => {
        if (event.target.value === userInfo.password) {
            setUserInfo({ ...userInfo, confirmPass: event.target.value });
            setErrors({ ...errors, passwordError: "" });
        } else {
            setErrors({ ...errors, passwordError: "Password's don't match" });
            setUserInfo({ ...userInfo, confirmPass: "" });
        }
    }

    const handleSignup = (event) => {
        event.preventDefault();
        createUserWithEmailAndPassword(userInfo.email, userInfo.password);

    }
    useEffect(() => {
        if (hookError) {

            switch (hookError?.code) {
                case "auth/invalid-email":
                    toast('invalid email')
                    break;
                case 'auth/invalid-password':
                    toast('invalid password')
                    break;
                default:
                    toast('something went wrong')

            }


        }
    }, [hookError]);

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    useEffect(() => {
        if (user) {
            navigate(from);
        }
    }, [user])


    return (
        <div className="container w-25 mx-auto login-form">
            <h2 className='mb-4 text-center mt-2 title'>Please Sign Up</h2>

            <Form onSubmit={handleSignup}>
                <Form.Group className="mb-3" controlId="formBasicEmail">

                    <Form.Control onChange={handleEmailChange} type="email" placeholder="Enter email"  />
                    {errors?.emailError && <p className="text-danger">{errors.emailError}</p>}
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Control onChange={passwordChange} type="password" placeholder="Password" required />
                    {errors?.passwordError && <p className="text-danger">{errors.passwordError}</p>}
                </Form.Group>

                <Form.Group className="mb-3" controlId="ConfirmPassword">
                    <Form.Control onChange={confirmPasswordChange} type="password" placeholder="Confirm Password" required />

                </Form.Group>

                <p>Already have an account? <Link to='/login' className="text-primary">Login Instead</Link></p>

                <Button variant="dark w-50 mx-auto d-block " type="submit">
                    Login
                </Button>
                <SocialLogin />
                <ToastContainer />
            </Form>

        </div>
    );
};

export default SignUp;