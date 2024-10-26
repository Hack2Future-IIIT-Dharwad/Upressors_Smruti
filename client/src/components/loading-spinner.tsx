import React, { useCallback } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';


const LoadingSpinner: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();


    const request = useCallback(() => {
        const queryParams = new URLSearchParams(location.search);
        const queryParamValue = queryParams.get('code');
        const postData = {
            code: queryParamValue,
        };


        console.log(postData)

        axios
            .post('http://localhost:5000/api/oauth/google', postData)
            .then((response) => {
                const { token, userId } = response.data;
                localStorage.setItem('token', token)
                localStorage.setItem('userId', userId)

                navigate('/');

            })
            .catch((error) => {
                if (error.response) {
                    console.log(
                        'Server responded with an error status:',
                        error.response.status,
                    );
                    console.log('Response data:', error.response.data);
                }
            });
    }, [location]);

    useEffect(() => {
        request();
    }, [request]);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white">
            <div className="animate-spin rounded-full border-t-4 border-black border-solid h-12 w-12"></div>
        </div>
    );
};

export default LoadingSpinner;