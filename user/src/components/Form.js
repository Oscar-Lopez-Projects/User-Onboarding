import React, { useState, useEffect } from 'react';
import axios from "axios";
import * as yup from "yup";

//step 1: set up the form inputs and labels to display
//step 2: set up inital state for all of the inputs
//step 3: import axios and yup
//step 4: set up state for errors and set up yup Schema
//step 5: we want to use useEffect to compare schema with state form
//step 6: set up setButtonDisabled
//step 7: create handle input change& put it on each input
//step 8: We need to set up inline validation & add persist fn to add validationChange
//step 9: display error to the user
//step 10: set up post const & set up formSubmit& display data using json to make sure it works!

const Form = () => {
    const [formState, setFormState]= useState({
        name: "",
        email: "",
        password: "",
        terms: ""
    });

    const [errors, setErrors]= useState({
        name: "",
        email: "",
        password: "",
        terms: ""
    })

    const formSchema = yup.object().shape({
        name: yup.string().required("Name is a required field."),
        email: yup
        .string()
        .email("Must be a valid email address.")
        .required("Must include email address."),
        password: yup.string()
        .required("Password is a required field")
        .min(8, 'Password is too short - should be 8 chars minimum.'),
        terms: yup.boolean().oneOf([true],"please agree to terms of use")
    });
    
    useEffect(()=>{
        console.log('form state is change')
        formSchema.isValid(formState).then(valid => {
            console.log('valid? ', valid)
            setButtonDisabled(!valid);
        });
    },[formState]);

    // state for whether our button should be disabled or not.
     const [buttonDisabled, setButtonDisabled] = useState(true);

     const inputChange= e =>{
         e.persist();
         const newFormData={
             ...formState,
             [e.target.name]:
                e.target.type === "checkbox" ? e.target.checked : e.target.value
         };
         validationChange(e);
         setFormState(newFormData);
     };

     const validationChange = e =>{
        yup
        .reach(formSchema, e.target.name)
        .validate(e.target.value)
        .then(valid => {
          setErrors({
            ...errors,
            [e.target.name]: ""
          });
        })
        .catch(err => {
          setErrors({
            ...errors,
            [e.target.name]: err.errors[0]
          });
        });
     };

     const [post, setPost] = useState([]);

     const formSubmit = e => {
        e.preventDefault();
        axios
          .post("https://reqres.in/api/users", formState)
          .then(res => {
            setPost(res.data); // get just the form data from the REST api
    
            // reset form if successful
            setFormState({
              name: "",
              email: "",
              terms: "",
              positions: "",
              motivation: ""
            });
          })
          .catch(err => console.log(err.response));
      };



    return(
        <form onSubmit={formSubmit}> 
            <label htmlFor="name">
            name
            <input 
            type="text"
            name="name"
            value={formState.name}
            onChange={inputChange}
            />
            {errors.name.length > 0 ? <p>{errors.name}</p> : null}
            </label>

             <label htmlFor="email">
            email
            <input 
            type="text"
            name="email"
            value={formState.email}
            onChange={inputChange}
            />
            {errors.email.length > 0 ? (<p>{errors.email}</p>) : null}
            </label>

             <label htmlFor="password">
            password
            <input 
            type="text"
            name="password"
            value={formState.password}
            onChange={inputChange}
            />
            {errors.password.length > 0 ? (<p>{errors.password}</p>) : null}
            </label>
            <label htmlFor="terms">
               <input
               type="checkbox"
               name="terms"
               checked={formState.terms} /* This will be changed later */
               onChange={inputChange}
               />
               Terms and Conditions!
            </label>
            <pre>{JSON.stringify(post, null, 2)}</pre>
            <button disabled={buttonDisabled}>Submit</button>

        </form>
        
    )
}
export default Form;