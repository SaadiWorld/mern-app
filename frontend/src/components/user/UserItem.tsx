import { Link } from "react-router";
import Card from "../shared/UIElements/Card";
import styles from "./UserItem.module.css";
import Avatar from "../shared/UIElements/Avatar";
import type { User } from "../../types/user";

interface UserItemProps {
  user: User;
}

const UserItem = ({ user }: UserItemProps) => {
  return (
    <li className={styles["user-item"]}>
      <Card className={styles["user-item__content"]}>
        <Link to={`/${user.id}/places`}>
          <div className={styles["user-item__image"]}>
            <Avatar image={user.image} alt={user.name} />
          </div>

          <div className={styles["user-item__info"]}>
            <h2>{user.name}</h2>
            <h3>
              {user.places.length}{" "}
              {user.places.length === 1 ? "Place" : "Places"}
            </h3>
          </div>
        </Link>
      </Card>
    </li>
  );
};

export default UserItem;
