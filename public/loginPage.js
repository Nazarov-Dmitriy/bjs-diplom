'use strict';

const useForm = new UserForm();

useForm.loginFormCallback = data => {
    ApiConnector.login(data, response => {
        if (response.success) {
            document.location.reload();
        } else {
            useForm.setLoginErrorMessage(response.error);
        }
    });
};


useForm.registerFormCallback = data => {
    ApiConnector.register(data, response => {
        if (response.success) {
            document.location.reload();
        } else {
            useForm.setRegisterErrorMessage(response.error);
        }
    });
};
