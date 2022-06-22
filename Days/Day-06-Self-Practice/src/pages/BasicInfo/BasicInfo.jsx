import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom'
// Custom Component
import Input from '../../components/Input/Input';
import Loader from '../../components/Loader/Loader';
// Context provider
import { AlertContext } from '../../providers/AlertProvider';
import { DetailContext } from '../../providers/DetailProvider';
// Extract Api
import ApiRequest from '../../Backend/api';
const Api = ApiRequest();

export default function BasicInfo() {
    let navigate = useNavigate();
    const
        { setAlert } = useContext(AlertContext),
        { userDetails, setUserDetails } = useContext(DetailContext),
        [loading, setLoading] = useState(true),
        [firstName, setFirstName] = useState(''),
        [lastName, setLastName] = useState(''),
        [age, setAge] = useState(''),
        // Trigger Events
        SubmitButton = (event) => {
            console.log("Submit Button Triggered");
            event.preventDefault()
            if (firstName !== null && lastName !== null && age !== null) {
                // Send Data To Conform Info Page
                setUserDetails({ firstName, lastName, age })
                // Push to Conform Info Page
                navigate("/confirm", { replace: true })
            } else {
                setAlert({
                    showAlert: true,
                    message: 'Please fill all the fields'
                });
            }
        },
        ResetButton = (event) => {
            console.log("Reset Button Triggered");
            [setAge, setFirstName, setLastName].forEach(item => item(''));
            setUserDetails({ firstName: "", lastName: "", age: "" })
            setAlert({ showAlert: false, message: '' })
        },
        DeleteButton = (event) => {
            console.log("Delete Button Triggered");
            deleteDetails();
            [setAge, setFirstName, setLastName].forEach(item => item(''));
            setUserDetails({ firstName: "", lastName: "", age: "" })
        },
        RefreshButton = (e) => {
            console.log("Refresh Button Triggered")
            setLoading(true)
            fetchDetails()
        },
        // Fetch Function
        fetchDetails = () => {
            console.log("Fetch Request Invoked")
            Api
                .get()
                .then(response => {
                    console.log("API Get Response")
                    if (response.firstName !== '' && response.lastName !== '' && response.age !== '') {
                        setUserDetails({
                            firstName: response.firstName,
                            lastName: response.lastName,
                            age: response.age
                        })
                        setAge(response.age)
                        setFirstName(response.firstName)
                        setLastName(response.lastName)
                    }
                    if (userDetails.firstName !== "" && userDetails.lastName !== '' && userDetails.age !== '') {
                        setAge(userDetails.age)
                        setFirstName(userDetails.firstName)
                        setLastName(userDetails.lastName)
                    }
                    setTimeout(() => {
                        setLoading(false)
                    }, 1e3)
                })
        },
        deleteDetails = () => {
            console.log("DeleteRequest Invoked");
            // Check if Exists And Only Delete
            const
                firstCondition = firstName !== null && lastName !== null && age !== null,
                secondCondition = userDetails.firstName !== "" && userDetails.lastName !== '' && userDetails.age !== ''
            if (firstCondition && secondCondition) {
                Api
                    .delete()
                    .then((status) => {
                        console.log("API Delete Response")
                        if (status === "success")
                            setAlert({
                                showAlert: true,
                                message: "User Deleted Successfully"
                            })
                        else {
                            setAlert({
                                showAlert: true,
                                message: "Problem Deleting Using"
                            })

                        }
                    })
            } else {
                setAlert({
                    showAlert: true,
                    message: "User Details Not Found"
                })
            }
        };
    // Initial Load
    useState(() => {
        console.log("Initial Load")
        fetchDetails()
    }, [])
    // JSX Handling
    return <div className='m-2'>
        <Loader isLoading={loading} title="Basic Information" />
        {!loading ?
            <div className='row'>
                <form className='col-12'>
                    <div className='card'>
                        <h4 className='card-header'>Basic Information</h4>
                        <Input required={true} label="First Name" type="text" id="firstName" placeholder='Enter First Name' value={firstName !== '' ? firstName : ""} onChange={(e) => setFirstName(e.target.value)} />
                        <Input required={true} label="Last Name" type="text" id="lastName" placeholder='Enter Last Name' value={lastName !== '' ? lastName : ""} onChange={(e) => setLastName(e.target.value)} />
                        <Input required={true} label="Age" type="number" id="age" min="1" max="100" placeholder='Enter Age' value={age !== '' ? age : ""} onChange={(e) => setAge(e.target.value)} />
                        <div className='form-group center'>
                            <button className='btn btn-purple' type="submit" onClick={SubmitButton}>Submit</button>
                            <button className='btn btn-orange' type="button" onClick={ResetButton}>Reset</button>
                            <button className='btn btn-danger' type="button" onClick={DeleteButton}>Delete</button>
                            <button className='btn btn-primary' type="button" onClick={RefreshButton}>Refresh</button>
                        </div>
                    </div>
                </form>
            </div>
            : null}
    </div>
}