import React, {useEffect} from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";
import {useDispatch, useSelector} from "react-redux";
import {Post, TagsBlock, CommentsBlock} from "../components";
import {fetchPosts, fetchTags} from "../redux/slices/posts";

const comments = [
	{
		id: 1,
		user: {
			fullName: "Вася Пупкин",
			avatarUrl: "https://mui.com/static/images/avatar/1.jpg",
		},
		text: "Это тестовый комментарий",
	},
	{
		id: 2,
		user: {
			fullName: "Иван Иванов",
			avatarUrl: "https://mui.com/static/images/avatar/2.jpg",
		},
		text: "When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top",
	},
]

export const Home = () => {
	const dispatch = useDispatch();
	const userData = useSelector(state => state.auth.data);
	const {posts, tags} = useSelector(state => state.posts);
	
	const isPostLoading = posts.status === 'loading';
	const isTagsLoading = tags.status === 'loading';
	
	useEffect(() => {
		dispatch(fetchPosts());
		dispatch(fetchTags());
	}, [dispatch])
	
	
	
	return (
		<>
			<Tabs
				style={{marginBottom: 15}}
				value={0}
				aria-label="basic tabs example"
			>
				<Tab label="Новые"/>
				<Tab label="Популярные"/>
			</Tabs>
			<Grid container spacing={4}>
				<Grid xs={8} item>
					{(isPostLoading ? [...Array(5)] : posts.items).map((post, index) =>
						isPostLoading ?
							(
								<React.Fragment key={index.toString()}>
									<Post isLoading={true} />
								</React.Fragment>
							)
								:
							(
								<React.Fragment key={post._id}>
									<Post
										id={post._id}
										title={post.title}
										imageUrl={post.imageUrl}
										user={post.user}
										createdAt={post.createdAt}
										viewsCount={post.viewsCount}
										commentsCount={Math.ceil(Math.random() * 10)}
										tags={post?.tags}
										isEditable={userData?._id === post.user._id}
										isLoading={isPostLoading}
									/>
								</React.Fragment>
							)
					)}
				</Grid>
				<Grid xs={4} item>
					<TagsBlock
						items={tags.items}
						isLoading={isTagsLoading}
					/>
					<CommentsBlock
						items={comments}
						isLoading={false}
					/>
				</Grid>
			</Grid>
		</>
	);
};
