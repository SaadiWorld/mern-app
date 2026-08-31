import { useEffect, useState } from "react";

import ErrorModal from "../../components/shared/UIElements/ErrorModal";
import LoadingSpinner from "../../components/shared/UIElements/LoadingSpinner";
import UsersList from "../../components/user/UsersList";
import { useHttpClient } from "../../hooks/http-hook";
import { API_ENDPOINTS } from "../../api/endpoints";
import type { User } from "../../types/user";

type UsersResponse = {
  users: User[];
};

const Users = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedUsers, setLoadedUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest<UsersResponse>(
          API_ENDPOINTS.users,
        );
        setLoadedUsers(responseData.users);
      } catch (_err) {
        // Error is managed by the hook
      }
    };

    fetchUsers();
  }, [sendRequest]);

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedUsers.length > 0 && (
        <UsersList items={loadedUsers} />
      )}
      {!isLoading && loadedUsers.length === 0 && (
        <div className="center">
          <h2>No users found.</h2>
        </div>
      )}
    </>
  );
};

export default Users;
