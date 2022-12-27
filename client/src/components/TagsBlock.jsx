import React from "react";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import TagIcon from "@mui/icons-material/Tag";
import ListItemText from "@mui/material/ListItemText";
import Skeleton from "@mui/material/Skeleton";

import {SideBlock} from "./SideBlock";
import {Link} from "react-router-dom";

export const TagsBlock = ({items, isLoading = true}) => {
	
	const itemsList = isLoading ? [...Array(5)] : items;
	
	return (
		<SideBlock title="Тэги">
			<List>
				{itemsList.map((name, i) => (
					<React.Fragment key={i.toString()}>
						<ListItem disablePadding>
							<Link
								style={{textDecoration: "none", color: "black", width:'100%'}}
								to={`/tags/${name}`}
							>
								<ListItemButton>
									<ListItemIcon>
										<TagIcon/>
									</ListItemIcon>
									{isLoading ? (
										<Skeleton width={100}/>
									) : (
										<ListItemText primary={name}/>
									)}
								</ListItemButton>
							</Link>
						</ListItem>
					</React.Fragment>
				))}
			</List>
		</SideBlock>
	);
};
