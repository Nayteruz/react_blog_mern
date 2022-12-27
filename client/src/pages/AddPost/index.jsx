import React, {useRef, useState} from "react";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import SimpleMDE from "react-simplemde-editor";

import "easymde/dist/easymde.min.css";
import styles from "./AddPost.module.scss";
import {useSelector} from "react-redux";
import {selectIsAuth} from "../../redux/slices/auth";
import {Navigate, useNavigate} from "react-router-dom";
import axios from "../../axios";

export const AddPost = () => {
	
	const navigate = useNavigate();
	
    const isAuth = useSelector(selectIsAuth);
    
	const [isLoading, setIsLoading] = useState(false);
	const [text, setText] = useState("");
	const [title, setTitle] = useState("");
	const [tags, setTags] = useState("");
	const [imageUrl, setImageUrl] = useState('');
    const inputFileRef = useRef(null);
	
	const onChange = React.useCallback((value) => {
		setText(value);
	}, []);
    
    const handleChangeFile = async (event) => {
    	try {
			const formData = new FormData();
			const file = event.target.files[0];
			formData.append('image', file)
			const {data} = await axios.post('/upload', formData);
			setImageUrl(data.url);
		} catch (err) {
			console.warn(err);
			alert('Ошибка загрузки файла');
		}
    }
    const onCLickRemoveImage = () => {
    	setImageUrl('');
    }
	
	const onSubmit = async () => {
		try {
			
			const fields = {
				title,
				text,
				tags,
				imageUrl,
			}
			
			setIsLoading(true);
			const {data} = await axios.post('/posts', fields);
			console.log(data)
			const id = data._id;
			
			navigate('/posts/' + id);
		} catch (err) {
			console.warn(err)
			alert('Ошибка при создании статьи!')
		}
	}
	
	const options = React.useMemo(
		() => ({
			spellChecker: false,
			maxHeight: "400px",
			autofocus: true,
			placeholder: "Введите текст...",
			status: false,
			autosave: {
				enabled: true,
				delay: 1000,
			},
		}),
		[]
	);
    
    if (!window.localStorage.getItem('token') && !isAuth){
        return <Navigate to={"/"} />
    }
	
	return (
		<Paper style={{padding: 30}}>
			<Button onClick={() => inputFileRef.current.click()} variant="outlined" size="large">
				Загрузить превью
			</Button>
            <input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden/>
			{imageUrl &&(
				<div className={styles.imageWrap}>
					<Button onClick={onCLickRemoveImage} color="error" variant="contained">
						Удалить
					</Button>
					<img className={styles.image} src={`http://localhost:5000${imageUrl}`} alt="Uploaded"/>
				</div>
			)}
			<TextField
				classes={{root: styles.title}}
				variant="standard"
				placeholder="Заголовок статьи..."
                value={title}
                onChange={e => setTitle(e.target.value)}
				fullWidth
			/>
			<TextField
				classes={{root: styles.tags}}
				variant="standard"
				placeholder="Тэги"
                value={tags}
                onChange={e => setTags(e.target.value)}
				fullWidth
			/>
			<SimpleMDE
				className={styles.editor}
				value={text}
				onChange={onChange}
				options={options}
			/>
			<div className={styles.buttons}>
				<Button onClick={onSubmit} type="submit" size="large" variant="contained">
					Опубликовать
				</Button>
				<Button type="clear" size="large">Отмена</Button>
			</div>
		</Paper>
	);
};
