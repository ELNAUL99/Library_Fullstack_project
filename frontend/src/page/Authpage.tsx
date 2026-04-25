import { Box, Button, TextField, Typography } from '@mui/material'
import { useAppDispatch } from '../hooks/reduxHook';
import { useState } from 'react'
import { UserLogin, UserRegister } from '../types/user';
import { login, register } from '../redux/reducer/userReducer';

const Authpage = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const dispatch = useAppDispatch();
    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function clearFields() {
        setUsername("");
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
    }

    function onSubmit() {
        if (isSignUp) {
            let newUser:UserRegister = {
                username: username,
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password,
            }
            dispatch(register(newUser)).then(() => setIsSignUp(!isSignUp));
        } else {
            let credentials:UserLogin = {
                username: username,
                password: password
            }
            dispatch(login(credentials)).then(()=> window.location.replace('/'));
        }
        setTimeout(() => {
            clearFields();
        }, 500);
    }

    return (
        <div>
            <form>
                <Box 
                    display={"flex"} 
                    flexDirection={"column"} 
                    maxWidth={400} 
                    alignItems={"center"} 
                    justifyContent={"center"} 
                    margin="auto" 
                    marginTop={5}
                    padding={3}
                    borderRadius={5}
                    boxShadow={"5px 5px 10px #ccc"}
                    sx={{
                        ":hover": {
                            boxShadow: '10px 10px 20px #ccc',
                        }
                    }}>
                    <Typography variant='h3' padding={3} textAlign={"center"}>{isSignUp ? "SignUp" : "Login"} here!</Typography>
                    {isSignUp && <TextField margin='normal' type={'text'} variant='outlined' placeholder='First Name' value={firstName} onChange={(e) => setFirstName(e.target.value)}/>}
                    {isSignUp &&<TextField margin='normal' type={'text'} variant='outlined' placeholder='Last Name' value={lastName} onChange={(e) => setLastName(e.target.value)}/>}
                    <TextField margin='normal' type={'text'} variant='outlined' placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)}/>
                    {isSignUp && <TextField margin='normal' type={'email'} variant='outlined' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)}/>}
                    <TextField margin='normal' type={'password'} variant='outlined' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)}/>
                    <Button sx={{marginTop: 3, borderRadius: 3}} variant="contained" color="info" onClick={onSubmit}>{isSignUp ? "SignUp" : "Login"}</Button>
                    <Button onClick={() => setIsSignUp(!isSignUp)} sx={{marginTop: 3, borderRadius: 3}}>Change to {isSignUp ? "Login" : "SignUp"}</Button>
                </Box>
            </form>
        </div>
    )
}

export default Authpage