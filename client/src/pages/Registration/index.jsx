import React, {useEffect, useRef, useState} from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";

import styles from "./Login.module.scss";
import {useForm} from "react-hook-form";
import {Navigate, useNavigate} from "react-router-dom";
import {authData, fetchRegister, selectIsAuth} from "../../redux/slices/auth";
import {useDispatch, useSelector} from "react-redux";
import axios from "../../axios";

export const Registration = () => {
	const isAuth = useSelector(selectIsAuth);
	const stateData = useSelector(authData);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const avatarRef = useRef(null);
	
	const [avatarImage, setAvatarImage] = useState(null);
	
	useEffect(() => {
		uploadAvatar();
	}, [stateData])
	
	const changeAvatar = async () => {
		setAvatarImage(await readURL(avatarRef.current.files[0]))
	}
	const deleteImage = () => {
		setAvatarImage(null);
		avatarRef.current.value = '';
	}
	
	const readURL = file => {
		return new Promise((res, rej) => {
			const reader = new FileReader();
			reader.onload = e => res(e.target.result);
			reader.onerror = e => rej(e);
			reader.readAsDataURL(file);
		});
	};
	
    const {
        register,
        handleSubmit,
        formState: {errors, isValid}
    } = useForm({
        defaultValues: {
            fullName: 'Вася Пупкин 2',
            email:'vasya2@test.ru',
            password:'123456',
        },
        mode: 'onChange'
    });
	
	const uploadAvatar = async () => {
		if (!isAuth) return ;
		
		if (!avatarRef.current.files[0]){
			navigate("/");
		}
		
		try {
			const formData = new FormData();
			formData.append('image', avatarRef.current.files[0])
			const {data} = await axios.post('/upload', formData);
			await axios.post('/auth/avatar', {
				userId: stateData._id,
				avatarUrl: data.url,
			});
			navigate("/");
		} catch (err) {
			console.warn(err);
			alert('Ошибка загрузки файла');
		}
	}
    
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
		// return <Navigate to={'/'} />
	}
    
	return (
		<Paper classes={{root: styles.root}}>
			<Typography classes={{root: styles.title}} variant="h5">
				Создание аккаунта
			</Typography>
			{
				avatarImage &&
				(<Button
					type="submit"
					classes={{root: styles['delete-btn']}}
					onClick={deleteImage}
					size="small"
					variant="contained"
				>
					Удалить
				</Button>)
			}
			<div className={styles.avatar} onClick={() => avatarRef.current.click()}>
				{avatarImage ?
					(<img src={avatarImage} alt="User avatar"/>)
					:
					(<Avatar sx={{width: 100, height: 100}}/>)
				}
			</div>
            <form onSubmit={handleSubmit(onSubmit)}>
				<input
					ref={avatarRef}
					onChange={changeAvatar}
					type="file"
					accept="image/png, image/jpeg"
					hidden
				/>
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
                    Создать пользователя
                </Button>
            </form>
		</Paper>
	);
};
