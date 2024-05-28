import React from "react";
import { useParams } from "react-router-dom";

const ProfileDetailPage = () => {

  const { username } = useParams();
  return (
    <div>
      <h1>Profile Page for {username}!</h1>
    </div>
  );
}
export default ProfileDetailPage;