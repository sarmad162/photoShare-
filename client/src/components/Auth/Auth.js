import React, { useState } from 'react';
import {Avatar, Button, Paper, Grid, Typography, Container } from '@material-ui/core';
import { GoogleLogin  } from 'react-google-login';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import LockOutLinedIcon from '@material-ui/icons/LockOutlined';
import Icon from './Icon';
import useStyles from './styles';
import Input from './Input';
import { signin, signup } from '../../actions/auth';

const initialState = { firstName: '', lastName: '', email: '', password: '', confirmPassword: ''};

const Auth = () => {
  const classes = useStyles();
  const [showPassword, setShowPassword] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState(initialState);

  const dispatch = useDispatch();
  const history = useHistory();


  const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword);

  const handleSubmit = (e) =>{
    e.preventDefault();
    
    if(isSignup){
      dispatch(signup(formData, history))
    } else{
      dispatch(signin(formData, history))
    }
  };

  const handleChange = (e) =>{
    setFormData({ ...formData, [e.target.name]: e.target.value});
    
  }

  const switchMode = () => {
    setIsSignup((pervIsSignup) => ! pervIsSignup);
    setShowPassword(false)
  }

  const googleSuccess = async(res) =>{
      const result = res?.profileObj;
      const token = res?.tokenId;

      try {
        dispatch({type: 'AUTH', data: {result, token}});

        history.push('/');

      } catch (error) {
        console.log(error);
      }
  };
  const googleFailure = (error) =>{
    console.log(error)
  };

  return (
    <Container component="main" maxWidth='xs' >
      <Paper className={classes.paper} elevation={3}>
        <Avatar className={classes.avatar}>
          <LockOutLinedIcon />
        </Avatar>
        <Typography variant='h5'>{isSignup ? 'تسجيل ': 'تسجيل الدخول'}</Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2} >
            {
              isSignup && (
                <>
                  <Input name='firstName' label="الاسم" handleChange={handleChange} autoFocus half/>
                  <Input name='lastName' label="اللقب" handleChange={handleChange} autoFocus half/>
                </>
              )}
              <Input name='email' label='البريد الالكتروني' handleChange={handleChange} type="email" />
              <Input name='password' label='كلمة المرور' handleChange={handleChange} type={showPassword ? 'text' : 'password'} handleShowPassword={handleShowPassword} />
              { isSignup && <Input name='confirmPassword' label='اعد كتابة كلمة المرور' handleChange={handleChange} type="password" />}
          </Grid>
          <Button type='submit' fullWidth variant='contained' color='primary' className={classes.submit} >
            {isSignup ? 'تسجيل' : 'تسجيل الدخول'}
          </Button>
          < GoogleLogin 
            clientId = '502024151797-vh0kdj69n28cnqdusei6uaanib3vkare.apps.googleusercontent.com'
            render = {(renderProps) =>(
              <Button 
              className={classes.googleButton} 
              color="primary" 
              fullWidth 
              onClick={renderProps.onClick} 
              disabled={renderProps.disabled} 
              startIcon={<Icon />}
              variant='contained'
              > Google تسجيل الدخول بحساب </Button>
            )}
            onSuccess={googleSuccess}
            onFailure={googleFailure}
            cookiePolicy="single_host_origin"
          
          />
          <Grid container justifyContent='flex-end'>
            <Grid item>
                  <Button onClick={switchMode}>
                    { isSignup ? 'لدي حساب ؟ سجَل دخولك' : "ليس لديك حساب ؟ قم بالتسجيل"}
                  </Button>
            </Grid>

          </Grid>
        </form>
      </Paper>

    </Container>
  )
}

export default Auth;