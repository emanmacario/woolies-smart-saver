import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';


function Login(props) {
  const [email, setEmail] = useState(null);
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const user = {
      email: email,
      username: username,
      password: password
    }

    console.log(JSON.stringify(user));
    
    axios.post('http://localhost:5000/users/login', user, { withCredentials: true })
      .then((res) => {
        console.log("Login response:")
        console.log(res.data);
        if (res.status === 200) {
          console.log("Res status is 200")
          props.setIsAuth(true);
          props.history.push('/viewProducts');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (

    <div className="container-fluid d-flex justify-content-center">
      <div className='col-md-4 p-5 mt-5 rounded shadow'>
        <h4 className="mb-4">Sign In</h4>
        <div className="mt-4 py-4">
          <hr className="mb-4" />
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Username</Form.Label>
              <Form.Control 
                required 
                type="text" 
                placeholder="Enter username" 
                onChange={(event) => setUsername(event.target.value)}/>
            </Form.Group>

            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control 
                required 
                type="password" 
                placeholder="Enter password"
                onChange={(event) => setPassword(event.target.value)} />
            </Form.Group>

            <Form.Group className="d-flex justify-content-end my-4">
              <Button
                variant="primary" 
                type="submit">
                Login
              </Button>
            </Form.Group>
          </Form>
        </div>
        
      </div>
    </div>
    
    
    
  )
}

const styles = {
  signUp: {
    width: "33%",
    padding: "1.5em",
    borderRadius: "10%",
    backgroundColor: "rgba(255, 255, 255, 0.815)",
    margin: "auto"
  },
  h1: {
    fontSize: "24px",
  }
};

export default Login;