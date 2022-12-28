import React from "react";
import styles from "./UserInfo.module.scss";
import dateFormat from "dateformat";
// eslint-disable-next-line
import monthName from "./monthName"; // название месяцев.
export const UserInfo = ({ avatarUrl, fullName, additionalText }) => {
  
    let avatarImg = avatarUrl.includes('http') ? avatarUrl : 'http://localhost:5000' + avatarUrl;
    
  return (
    <div className={styles.root}>
        {!avatarImg && <span className={styles.noavatar}></span>}
        {avatarImg && <img className={styles.avatar} src={avatarImg} alt={fullName} />}
      <div className={styles.userDetails}>
        <span className={styles.userName}>{fullName}</span>
        <span className={styles.additional}>{dateFormat(additionalText, "dd mmmm yyyy HH:MM")}</span>
      </div>
    </div>
  );
};
