import React from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";

import styles from "./Login.module.scss";
import {useForm} from "react-hook-form";
import {Navigate} from "react-router-dom";
import {fetchRegister, selectIsAuth} from "../../redux/slices/auth";
import {useDispatch, useSelector} from "react-redux";

export const Registration = () => {
	const isAuth = useSelector(selectIsAuth);
	const dispatch = useDispatch();
	
    const {
        register,
        handleSubmit,
        formState: {errors, isValid}
    } = useForm({
        defaultValues: {
            fullName: 'Вася Пупкин',
            email:'vasy123@test.ru',
            password:'123456',
        },
        mode: 'onChange'
    });
    
    const onSubmit = async (values) => {
        const data = await dispatch(fetchRegister(values))

        if (!data.payload){
            return alert('Не удалось зарегистрироваться!');
        }
        if ('token' in data.payload){
            localStorage.setItem('token', data.payload.token);
        }
    }
	
	if (isAuth){
		return <Navigate to={'/'} />
	}
    
	return (
		<Paper classes={{root: styles.root}}>
			<Typography classes={{root: styles.title}} variant="h5">
				Создание аккаунта
			</Typography>
			<div className={styles.avatar}>
				<Avatar sx={{width: 100, height: 100}}/>
			</div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                    className={styles.field}
                    label="Полное имя"
                    error={Boolean(errors.fullName?.message)}
                    helperText={errors.fullName?.message}
                    {...register('fullName', {required: 'Укажите имя', minLength:{value:3, message:'Минимум 3 символа'}})}
                    fullWidth
                />
                <TextField
                    className={styles.field}
                    label="E-Mail"
                    type="email"
                    error={Boolean(errors.email?.message)}
                    helperText={errors.email?.message}
                    {...register('email', {required: 'Укажите почту'})}
                    fullWidth
                />
                <TextField
                    className={styles.field}
                    label="Пароль"
                    type="password"
                    error={Boolean(errors.password?.message)}
                    helperText={errors.password?.message}
                    {...register('password', {required: 'Укажите пароль', minLength:{value:5, message:'Минимум 5 символов'}})}
                    fullWidth
                />
                <Button disabled={!isValid} type="submit" size="large" variant="contained" fullWidth>
                    Войти
                </Button>
            </form>
		</Paper>
	);
};
