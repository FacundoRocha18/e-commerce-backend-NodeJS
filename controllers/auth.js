const { request, response } = require('express');
const bcrypt = require('bcrypt');
const { getUserQuery, insertUserQuery } = require('../database/users');


const createUser = (req = request, res = response) => {

    let userData = req.body;

    const isValidated = validation(userData);

    try {

        if (!isValidated) {

            console.log('La información proporcionada es nula')
        } else {

            console.log('La información ha sido validada');
            console.log('Nuevo usuario registrado');
            insertUserQuery(userData);

        }

    } catch (error) {

        throw console.error(error);
    }

    res.json({
        ok: true,
        msg: 'New user registered.'
    });

};

const onAuth = async (req = request, res = response) => {

    const { uEmail, uPassword } = req.body;

    try {

        const { email, password, name } = await getUserQuery(uEmail);

        console.log(email, password, name)

        if (uEmail === email && await bcrypt.compare(uPassword, password)) {

            console.log('ok')
            const randomToken = (length = 24) => {

                return Math.random().toString(16).substring(2, length);
            };

            res.send({
                ok: true,
                message: 'User logged successfully',
                loginData: {
                    token: randomToken(),
                    username: name
                }
            })
        } else {
            res.send({
                ok: false,
                message: 'Please check your password'
            })
        }


    } catch (error) {
        res.status(404).send(/* 'Sorry, can´t find that' + */ error);
    }

}

const renewToken = (req, res = response) => {

    res.send({
        ok: true,
        token: 'token123'
    });

};

const validation = (data) => {

    const { email, name, address, phone, password } = data;

    const userDataArray = [email, name, address, phone, password];

    let isValidated;

    for (let i = 0; i < userDataArray.length; i++) {

        if (!userDataArray[i]) {

            return isValidated = false;

        } else {

            isValidated = true;
        }
    };

    return isValidated;
}

module.exports = {
    createUser,
    onAuth,
    renewToken
}