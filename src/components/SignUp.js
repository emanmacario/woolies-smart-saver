import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';


function SignUp() {
  const [username, setUsername] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [redirectPath, setRedirectPath] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault()
    console.log("Handling signup submit");
    
    axios.post('http://localhost:5000/users/register/', {
      username: username,
      password: password,
      email: email
    }, {
      withCredentials: true,
    })
    .then((res) => {
      console.log("Sign up response: ")
      console.log(res);

      if (res.status === 200) {
        setRedirectPath('/login');
      }
    })
    .catch((err) => {
      console.log(`Login error: ${err}`);
    })
  }

  // Redirect to login page on sign up completion
  if (redirectPath) {
    return <Redirect to={{ pathname: redirectPath }} />
  } 

  return (
    <div className="container-fluid d-flex flex-column align-items-center">
      <div className='col-md-3 p-5 mt-5 rounded shadow'>
        <h4 className="mb-4">Sign Up</h4>
        <div className="mt-4 py-4">
          <hr className="mb-4" />
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Username</Form.Label>
              <Form.Control 
                required
                type="text" 
                placeholder="Enter username" 
                onChange={(e) => setUsername(e.target.value)}/>
            </Form.Group>

            <Form.Group>
              <Form.Label>Email address</Form.Label>
              <Form.Control 
                required 
                type="email" 
                placeholder="Enter email"
                onChange={(e) => setEmail(e.target.value)}/>
              <Form.Text className="text-muted">
              We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>

            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control 
                required 
                type="password"
                placeholder="Password" 
                onChange={(e) => setPassword(e.target.value)}/>
            </Form.Group>

            <Button 
              className="float-right" 
              variant="primary" 
              type="submit">
              Submit
            </Button>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default SignUp;