import UsersList from "../../components/user/UsersList";
import type { User } from "../../types/user";

const Users = () => {
  const USERS: User[] = [
    {
      id: 1,
      name: "Walter White",
      image:
        "https://static.wikia.nocookie.net/breakingbad/images/e/e7/BB-S5B-Walt-590.jpg",
      places: 3,
    },
  ];
  return <UsersList items={USERS} />;
};

export default Users;
