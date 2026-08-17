import UserItem from "./UserItem";
import styles from "./UsersList.module.css";
import type { User } from "../../types/user";

interface UsersListProps {
  items: User[];
}

const UsersList = ({ items }: UsersListProps) => {
  if (items.length === 0) {
    return (
      <div className="center">
        <h2>No users found.</h2>
      </div>
    );
  }

  return (
    <ul className={styles["users-list"]}>
      {items.map((user) => (
        <UserItem key={user.id} user={user} />
      ))}
    </ul>
  );
};

export default UsersList;
